import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, ArrowRight } from "lucide-react";

const HeroBanner = ({ onClaim }) => {
  const navigate = useNavigate();
  const [remain, setRemain] = useState(24 * 3600 * 1000);
  useEffect(() => {
    const target = Date.now() + 24 * 3600 * 1000;
    const i = setInterval(() => setRemain(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(i);
  }, []);
  const hh = String(Math.floor(remain / 3600000)).padStart(2, "0");
  const mm = String(Math.floor((remain % 3600000) / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remain % 60000) / 1000)).padStart(2, "0");

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-mint/25 bg-gradient-to-br from-[#123524] via-night-card to-[#101a2e] p-6 sm:p-10 mb-6"
      data-testid="hero-banner"
    >
      {/* Cinematisches Hintergrundbild */}
      <img
        src="https://images.unsplash.com/photo-1645180804518-5dc3e353e647?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxjYXNpbm8lMjByb3VsZXR0ZSUyMG5lb258ZW58MHx8fGJsYWNrfDE3ODg1MjgwMjB8MA&ixlib=rb-4.1.0&q=85"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1f16]/90 via-night-card/85 to-[#0a1526]/90 pointer-events-none" />

      <div className="absolute -right-20 -top-24 w-[340px] h-[340px] opacity-25 pointer-events-none animate-spin-slower" aria-hidden="true">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <circle cx="150" cy="150" r="140" fill="none" stroke="#00E575" strokeWidth="1.5" strokeDasharray="6 12" />
          <circle cx="150" cy="150" r="105" fill="none" stroke="#2E7CFF" strokeWidth="1" strokeDasharray="3 9" />
          <circle cx="150" cy="150" r="70" fill="none" stroke="#00E575" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,229,117,0.12),transparent_55%)] pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full bg-mint/15 border border-mint/30 text-mint text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] px-3.5 py-1.5 mb-5" data-testid="hero-badge">
          <Gift className="w-3.5 h-3.5" />
          Willkommenspaket · Saison 2026
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-[1.05]" data-testid="hero-headline">
          100% Bonus <span className="text-mint">bis 1.500&nbsp;€</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg">
          Plus 150 Freispiele für Roulette Royale &amp; Blackjack Privé. Einzahlen, Code aktivieren,
          direkt an die Tische — Auszahlung in unter 15 Minuten.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={onClaim}
            className="group rounded-full bg-mint text-black font-bold text-sm px-6 py-3 inline-flex items-center gap-2 hover:bg-mint-hover transition-colors duration-300 shadow-[0_0_26px_rgba(0,229,117,0.4)]"
            data-testid="hero-claim-bonus-btn"
          >
            Bonus einlösen
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button
            onClick={() => navigate("/crash")}
            className="rounded-full border border-night-border bg-night-card/60 text-sm font-semibold px-6 py-3 hover:border-mint/50 hover:text-mint transition-colors duration-300"
            data-testid="hero-play-demo-btn"
          >
            Crash kostenlos testen
          </button>
        </div>

        <div className="mt-7 flex items-center gap-3" data-testid="hero-bonus-countdown-timer">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Angebot endet in</span>
          {[["Std", hh], ["Min", mm], ["Sek", ss]].map(([label, v]) => (
            <span key={label} className="flex flex-col items-center">
              <span className="rounded-lg bg-night-sidebar border border-night-border font-mono font-bold text-lg px-2.5 py-1 tabular-nums text-mint">{v}</span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600 mt-1">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default HeroBanner;
