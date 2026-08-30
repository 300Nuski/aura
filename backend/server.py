from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import List

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
DEFAULT_BALANCE = 1561


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    response.set_cookie("access_token", create_access_token(user_id, email), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie("refresh_token", create_refresh_token(user_id), httponly=True, secure=True, samesite="none", max_age=604800, path="/")


def public_user(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "email": doc["email"],
        "name": doc.get("name", ""),
        "role": doc.get("role", "user"),
        "balance": doc.get("balance", DEFAULT_BALANCE),
    }


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Nicht angemeldet")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Ungültiger Token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sitzung abgelaufen")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Ungültiger Token")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="Benutzer nicht gefunden")
    return user


class RegisterInput(BaseModel):
    name: str = Field(min_length=2, max_length=40)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class BalanceInput(BaseModel):
    balance: int = Field(ge=0, le=10_000_000)


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/auth/register")
async def register(input: RegisterInput, response: Response):
    email = input.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Diese E-Mail ist bereits registriert.")
    doc = {
        "name": input.name.strip(),
        "email": email,
        "password_hash": hash_password(input.password),
        "role": "user",
        "balance": DEFAULT_BALANCE,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    set_auth_cookies(response, str(result.inserted_id), email)
    return public_user(doc)


@api_router.post("/auth/login")
async def login(input: LoginInput, response: Response):
    email = input.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="E-Mail oder Passwort falsch.")
    set_auth_cookies(response, str(user["_id"]), email)
    return public_user(user)


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return public_user(user)


@api_router.get("/auth/balance")
async def get_balance(user=Depends(get_current_user)):
    return {"balance": user.get("balance", DEFAULT_BALANCE)}


@api_router.put("/auth/balance")
async def set_balance(input: BalanceInput, user=Depends(get_current_user)):
    await db.users.update_one({"_id": user["_id"]}, {"$set": {"balance": input.balance}})
    return {"balance": input.balance}


async def require_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Nur für Admins.")
    return user


@api_router.get("/admin/users")
async def admin_users(admin=Depends(require_admin)):
    users = await db.users.find().sort("created_at", -1).to_list(500)
    return [{**public_user(u), "created_at": u.get("created_at", "")} for u in users]


class RoleInput(BaseModel):
    role: str


def parse_object_id(user_id: str) -> ObjectId:
    try:
        return ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Ungültige Nutzer-ID.")


@api_router.put("/admin/users/{user_id}/role")
async def admin_set_role(user_id: str, input: RoleInput, admin=Depends(require_admin)):
    if input.role not in ("user", "admin"):
        raise HTTPException(status_code=400, detail="Ungültige Rolle.")
    if str(admin["_id"]) == user_id and input.role != "admin":
        raise HTTPException(status_code=400, detail="Du kannst dir nicht selbst die Admin-Rolle entziehen.")
    res = await db.users.update_one({"_id": parse_object_id(user_id)}, {"$set": {"role": input.role}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden.")
    return {"ok": True, "role": input.role}


@api_router.put("/admin/users/{user_id}/balance")
async def admin_set_balance(user_id: str, input: BalanceInput, admin=Depends(require_admin)):
    res = await db.users.update_one({"_id": parse_object_id(user_id)}, {"$set": {"balance": input.balance}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden.")
    return {"ok": True, "balance": input.balance}


class RoundInput(BaseModel):
    game: str = Field(max_length=30)
    bet: int = Field(ge=0, le=10_000_000)
    mult: float = Field(ge=0, le=100_000)
    payout: int = Field(ge=0, le=100_000_000)


@api_router.post("/rounds")
async def create_round(input: RoundInput, user=Depends(get_current_user)):
    await db.rounds.insert_one({
        "user_id": str(user["_id"]),
        "game": input.game,
        "bet": input.bet,
        "mult": input.mult,
        "payout": input.payout,
        "ts": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True}


@api_router.get("/rounds/mine")
async def my_rounds(limit: int = 5, user=Depends(get_current_user)):
    return await db.rounds.find({"user_id": str(user["_id"])}, {"_id": 0}).sort("ts", -1).to_list(min(limit, 20))


async def seed_user(email: str, password: str, name: str, role: str):
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "name": name,
            "email": email,
            "password_hash": hash_password(password),
            "role": role,
            "balance": DEFAULT_BALANCE,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await seed_user(os.environ["ADMIN_EMAIL"], os.environ["ADMIN_PASSWORD"], "Admin", "admin")
    await seed_user("demo@auraroyale.de", "Demo2026!", "Demo Spieler", "user")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
