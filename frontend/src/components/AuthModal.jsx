import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

const formatDetail = (detail) => {
  if (detail == null) return "Etwas ist schiefgelaufen. Bitte erneut versuchen.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : String(e))).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
};

const AuthModal = ({ open, onOpenChange }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const u = await login(email, password);
        toast.success(`Willkommen zurück, ${u.name}!`);
      } else {
        const u = await register(name, email, password);
        toast.success(`Willkommen bei AURA ROYALE, ${u.name}! Startguthaben: 1.561 €`);
      }
      onOpenChange(false);
      setPassword("");
    } catch (err) {
      setError(formatDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-night-card border border-night-border text-white sm:max-w-md rounded-2xl" data-testid="auth-dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-extrabold">
            {mode === "login" ? "Willkommen zurück" : "Konto erstellen"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-400">
            {mode === "login"
              ? "Melde dich an, um dein Guthaben zu speichern und weiterzuspielen."
              : "Registriere dich und starte mit 1.561 € Demo-Guthaben."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1.5 mt-1 mb-4">
          {[
            ["login", "Anmelden", LogIn],
            ["register", "Registrieren", UserPlus],
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => { setMode(id); setError(""); }}
              className={`flex-1 rounded-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors duration-300 ${
                mode === id ? "bg-mint text-black" : "bg-night-elevated text-slate-400 hover:text-white"
              }`}
              data-testid={`auth-tab-${id}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              required
              minLength={2}
              className="w-full rounded-xl bg-night-sidebar border border-night-border px-4 py-3 text-sm focus:outline-none focus:border-mint/60 placeholder:text-slate-600"
              data-testid="auth-name-input"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-Mail-Adresse"
            required
            className="w-full rounded-xl bg-night-sidebar border border-night-border px-4 py-3 text-sm focus:outline-none focus:border-mint/60 placeholder:text-slate-600"
            data-testid="auth-email-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort (min. 6 Zeichen)"
            required
            minLength={6}
            className="w-full rounded-xl bg-night-sidebar border border-night-border px-4 py-3 text-sm focus:outline-none focus:border-mint/60 placeholder:text-slate-600"
            data-testid="auth-password-input"
          />

          {error && (
            <p className="rounded-lg bg-[#FF4757]/10 border border-[#FF4757]/40 text-[#FF6B7A] text-xs px-3.5 py-2.5" data-testid="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-mint text-black font-extrabold text-sm py-3.5 hover:bg-mint-hover transition-colors duration-300 disabled:opacity-50 shadow-[0_0_22px_rgba(0,229,117,0.35)]"
            data-testid="auth-submit-btn"
          >
            {loading ? "Einen Moment …" : mode === "login" ? "Anmelden" : "Konto erstellen"}
          </button>
        </form>

        <p className="mt-3 text-[11px] text-slate-600 leading-relaxed">
          Demo-Plattform: Dein Konto speichert nur dein Spielgeld-Guthaben. 18+ · Keine Echtgeld-Spiele.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
