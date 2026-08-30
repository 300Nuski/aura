import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { animate } from "framer-motion";
import { Flame, Bell, Coins, Plus } from "lucide-react";

const NAVS = [
  { id: "lobby", label: "Lobby", route: "/" },
  { id: "roulette", label: "Roulette", route: "/roulette" },
  { id: "blackjack", label: "Blackjack", route: "/blackjack" },
  { id: "crash", label: "Crash", route: "/crash" },
];

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

const Topbar = ({ balance, onDeposit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = NAVS.find((n) => n.route === location.pathname)?.id ?? "";

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
        <div className="relative" data-testid="topbar-avatar">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8C3BFF] to-[#2E7CFF] flex items-center justify-center font-display font-bold text-sm">
            DU
          </div>
          <span className="absolute -bottom-1 -right-1 rounded-full bg-mint text-black text-[9px] font-mono font-bold px-1.5 py-px">42</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
