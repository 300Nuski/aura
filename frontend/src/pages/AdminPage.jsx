import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ShieldCheck, Users, Coins, Crown, Check, ArrowLeft } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import api from "@/lib/api";

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);
  const [editBalance, setEditBalance] = useState({});
  const [saving, setSaving] = useState(null);

  const load = () => api.get("/admin/users").then((r) => setUsers(r.data)).catch(() => setUsers([]));

  useEffect(() => {
    if (user?.role === "admin") load();
  }, [user]);

  if (user === null) {
    return (
      <div className="rounded-2xl bg-night-card border border-night-border p-10 text-center" data-testid="admin-no-auth">
        <p className="font-display font-bold text-lg mb-2">Bitte anmelden</p>
        <p className="text-sm text-slate-400">Du musst eingeloggt sein, um das Admin-Panel zu sehen.</p>
      </div>
    );
  }

  if (user && user.role !== "admin") {
    return (
      <div className="rounded-2xl bg-night-card border border-[#FF4757]/30 p-10 text-center" data-testid="admin-forbidden">
        <ShieldCheck className="w-8 h-8 text-[#FF4757] mx-auto mb-3" />
        <p className="font-display font-bold text-lg mb-2">Kein Zugriff</p>
        <p className="text-sm text-slate-400">Dieser Bereich ist nur für Administratoren.</p>
      </div>
    );
  }

  const saveBalance = async (id) => {
    const val = Math.floor(Number(editBalance[id]));
    if (!Number.isFinite(val) || val < 0) {
      toast.error("Ungültiger Betrag.");
      return;
    }
    setSaving(id);
    try {
      await api.put(`/admin/users/${id}/balance`, { balance: val });
      toast.success("Guthaben aktualisiert.");
      setUsers((us) => us.map((u) => (u.id === id ? { ...u, balance: val } : u)));
    } catch {
      toast.error("Speichern fehlgeschlagen.");
    } finally {
      setSaving(null);
    }
  };

  const toggleRole = async (u) => {
    const next = u.role === "admin" ? "user" : "admin";
    try {
      await api.put(`/admin/users/${u.id}/role`, { role: next });
      toast.success(next === "admin" ? `${u.name} ist jetzt Admin.` : `${u.name} ist jetzt Nutzer.`);
      setUsers((us) => us.map((x) => (x.id === u.id ? { ...x, role: next } : x)));
    } catch (e) {
      toast.error(e.response?.data?.detail || "Rollenwechsel fehlgeschlagen.");
    }
  };

  const totalBalance = (users ?? []).reduce((s, u) => s + u.balance, 0);
  const adminCount = (users ?? []).filter((u) => u.role === "admin").length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} data-testid="admin-page">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-mint transition-colors duration-300 mb-5"
        data-testid="admin-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Lobby
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-xl bg-[#8C3BFF]/20 border border-[#8C3BFF]/40 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-[#c39aff]" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight uppercase">Admin Panel</h1>
          <p className="text-xs text-slate-500">Nutzerverwaltung · Guthaben & Rollen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Nutzer gesamt", value: users?.length ?? "—", icon: Users, cls: "text-mint" },
          { label: "Guthaben gesamt", value: `${totalBalance.toLocaleString("de-DE")} €`, icon: Coins, cls: "text-amber-300" },
          { label: "Admins", value: adminCount, icon: Crown, cls: "text-[#c39aff]" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-night-card border border-night-border p-5" data-testid={`admin-stat-${s.label.replace(/\s/g, "-").toLowerCase()}`}>
            <s.icon className={`w-5 h-5 ${s.cls} mb-2`} />
            <p className="font-mono font-bold text-xl tabular-nums">{s.value}</p>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-night-card border border-night-border overflow-hidden" data-testid="admin-users-table">
        <div className="grid grid-cols-12 gap-2 px-5 py-3.5 border-b border-night-bordersub text-[10px] font-mono uppercase tracking-wider text-slate-500">
          <span className="col-span-4">Nutzer</span>
          <span className="col-span-2">Rolle</span>
          <span className="col-span-3">Guthaben</span>
          <span className="col-span-3 text-right">Aktionen</span>
        </div>
        {(users ?? []).map((u) => (
          <div key={u.id} className="grid grid-cols-12 gap-2 px-5 py-3.5 border-b border-night-bordersub/60 items-center hover:bg-night-cardhover/40 transition-colors duration-200" data-testid={`admin-user-row-${u.id}`}>
            <div className="col-span-4 flex items-center gap-3 min-w-0">
              <span className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#8C3BFF] to-[#2E7CFF] flex items-center justify-center text-[11px] font-bold">
                {u.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {u.name}
                  {u.id === user.id && <span className="ml-2 text-[9px] font-mono text-mint">DU</span>}
                </p>
                <p className="text-xs text-slate-500 truncate">{u.email}</p>
              </div>
            </div>
            <div className="col-span-2">
              <span className={`rounded px-2 py-1 text-[10px] font-mono font-bold border ${
                u.role === "admin" ? "bg-[#8C3BFF]/15 text-[#c39aff] border-[#8C3BFF]/40" : "bg-night-elevated text-slate-400 border-night-border"
              }`} data-testid={`admin-role-badge-${u.id}`}>
                {u.role === "admin" ? "ADMIN" : "NUTZER"}
              </span>
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={editBalance[u.id] ?? u.balance}
                onChange={(e) => setEditBalance((m) => ({ ...m, [u.id]: e.target.value }))}
                className="w-24 rounded-lg bg-night-sidebar border border-night-border px-2.5 py-1.5 font-mono text-xs font-bold focus:outline-none focus:border-mint/60"
                data-testid={`admin-balance-input-${u.id}`}
              />
              <button
                onClick={() => saveBalance(u.id)}
                disabled={saving === u.id}
                className="w-8 h-8 rounded-lg bg-mint/15 border border-mint/40 text-mint flex items-center justify-center hover:bg-mint hover:text-black transition-colors duration-300 disabled:opacity-40"
                data-testid={`admin-save-balance-${u.id}`}
                aria-label="Guthaben speichern"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
            <div className="col-span-3 text-right">
              <button
                onClick={() => toggleRole(u)}
                disabled={u.id === user.id}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
                  u.role === "admin"
                    ? "bg-night-elevated border border-[#FF4757]/40 text-[#FF6B7A] hover:bg-[#FF4757]/20"
                    : "bg-night-elevated border border-[#8C3BFF]/40 text-[#c39aff] hover:bg-[#8C3BFF]/20"
                }`}
                data-testid={`admin-role-toggle-${u.id}`}
              >
                {u.role === "admin" ? "Admin entfernen" : "Admin machen"}
              </button>
            </div>
          </div>
        ))}
        {users && users.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Keine Nutzer gefunden.</p>
        )}
      </div>
    </motion.div>
  );
};

export default AdminPage;
