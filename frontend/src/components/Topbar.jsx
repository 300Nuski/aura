import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, animate } from "framer-motion";
import { Flame, Bell, Coins, Plus, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import api from "@/lib/api";

const NAVS = [
  { id: "lobby", label: "Lobby", route: "/" },
  { id: "roulette", label: "Roulette", route: "/roulette" },
  { id: "blackjack", label: "Blackjack", route: "/blackjack" },
  { id: "crash", label: "Crash", route: "/crash" },
];

const GAME_COLORS = { Roulette: "#E84118", Blackjack: "#00E575", Crash: "#FF9F1C" };

const AnimatedBalance = ({ value }) => {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    prev.current = value;
    const c = animate(from, value, { duration: 0.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => c.stop();
  }, [value]);
  return (
    <span className="font-mono font-bold text-sm tabular-nums" data-testid="topbar-balance">
      {display.toLocaleString("de-DE")}
    </span>
  );
};

const Topbar = ({ balance, onDeposit, onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [rounds, setRounds] = useState([]);
  const active = NAVS.find((n) => n.route === location.pathname)?.id ?? "";

  useEffect(() => {
    if (menuOpen && user) {
      api.get("/rounds/mine?limit=5").then((r) => setRounds(r.data)).catch(() => setRounds([]));
    }
  }, [menuOpen, user]);

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 h-16 md:h-20 bg-night-surface/90 backdrop-blur-xl border-b border-night-elevated px-4 md:px-6 flex items-center justify-between"
      data-testid="topbar"
    >
      <div className="flex items-center gap-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group" data-testid="topbar-logo">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-mint to-[#2E7CFF] flex items-center justify-center shadow-[0_0_22px_rgba(0,229,117,0.4)] group-hover:shadow-[0_0_32px_rgba(0,229,117,0.65)] transition-shadow duration-300">
            <Flame className="w-5 h-5 text-black" fill="currentColor" />
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight">
            AURA <span className="text-mint">ROYALE</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1.5" data-testid="topbar-nav">
          {NAVS.map((n) => (
            <button
              key={n.id}
              onClick={() => navigate(n.route)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-300 ${
                active === n.id ? "bg-night-elevated text-white" : "text-slate-400 hover:text-white hover:bg-night-card"
              }`}
              data-testid={`topbar-nav-${n.id}`}
            >
              {n.label}
            </button>
          ))}
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors duration-300 ${
                location.pathname === "/admin" ? "bg-[#8C3BFF]/25 text-[#c39aff]" : "text-[#c39aff]/70 hover:text-[#c39aff] hover:bg-night-card"
              }`}
              data-testid="topbar-nav-admin"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2 rounded-full bg-night-card border border-night-border px-3.5 py-2">
          <Coins className="w-4 h-4 text-amber-400" />
          <AnimatedBalance value={balance} />
        </div>
        <button
          onClick={onDeposit}
          className="animate-deposit-glow rounded-full bg-mint text-black text-[13px] font-bold px-4 md:px-5 py-2.5 inline-flex items-center gap-1.5 hover:bg-mint-hover transition-colors duration-300"
          data-testid="topbar-deposit-btn"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          Einzahlen
        </button>
        <button className="relative w-9 h-9 rounded-full bg-night-card border border-night-border hidden sm:flex items-center justify-center hover:border-mint/50 transition-colors duration-300" data-testid="topbar-bell" aria-label="Benachrichtigungen">
          <Bell className="w-4 h-4 text-slate-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-mint animate-pulse-dot" />
        </button>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="relative block"
              data-testid="topbar-avatar"
              aria-label="Konto-Menü"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8C3BFF] to-[#2E7CFF] flex items-center justify-center font-display font-bold text-sm">
                {initials || "?"}
              </div>
              <span className="absolute -bottom-1 -right-1 rounded-full bg-mint text-black text-[9px] font-mono font-bold px-1.5 py-px">42</span>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 w-72 rounded-xl bg-night-card border border-night-border shadow-[0_24px_50px_rgba(0,0,0,0.55)] p-4 z-50"
                  data-testid="account-menu"
                >
                  <p className="font-display font-bold text-sm truncate" data-testid="account-name">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate mb-1">{user.email}</p>
                  {user.role === "admin" && (
                    <span className="inline-block rounded bg-[#8C3BFF]/20 border border-[#8C3BFF]/40 text-[#c39aff] text-[9px] font-mono font-bold px-1.5 py-0.5 mb-1">ADMIN</span>
                  )}

                  <div className="h-px bg-night-bordersub my-3" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 mb-2">Letzte Runden</p>
                  <div className="space-y-1.5 mb-3 max-h-40 overflow-y-auto chat-scroll" data-testid="account-rounds">
                    {rounds.length === 0 && (
                      <p className="text-xs text-slate-600 py-1" data-testid="account-rounds-empty">Noch keine Runden gespielt.</p>
                    )}
                    {rounds.map((r, i) => (
                      <div key={i} className="flex items-center justify-between text-xs" data-testid="account-round-row">
                        <span className="flex items-center gap-2 font-semibold text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GAME_COLORS[r.game] || "#64748B" }} />
                          {r.game}
                          <span className="font-mono text-slate-500">{r.mult > 0 ? `${r.mult}x` : "—"}</span>
                        </span>
                        <span className={`font-mono font-bold ${r.payout > r.bet ? "text-mint" : r.payout > 0 ? "text-slate-300" : "text-slate-600"}`}>
                          {r.payout > 0 ? `+${r.payout.toLocaleString("de-DE")}` : `-${r.bet.toLocaleString("de-DE")}`} €
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-night-bordersub my-3" />
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="w-full rounded-lg bg-night-elevated border border-night-border text-slate-300 text-xs font-bold py-2.5 inline-flex items-center justify-center gap-2 hover:border-[#FF4757]/60 hover:text-[#FF6B7A] transition-colors duration-300"
                    data-testid="logout-btn"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Abmelden
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="rounded-full border border-mint/60 text-mint text-[13px] font-bold px-4 md:px-5 py-2.5 hover:bg-mint hover:text-black transition-colors duration-300"
            data-testid="topbar-login-btn"
          >
            Anmelden
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
