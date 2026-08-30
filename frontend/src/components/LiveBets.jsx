import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";

const NAMES = ["Albert F.", "LuckyLisa", "MaxPower", "SpinQueen", "NeoBlade", "Annette S.", "DerBoss99", "CasinoCarl", "WhaleWanda", "TimT", "HighRollerH", "Mia K."];
const GAMES = [
  { n: "Roulette", c: "#E84118" },
  { n: "Blackjack", c: "#00E575" },
  { n: "Crash", c: "#FF9F1C" },
  { n: "Slots", c: "#8C3BFF" },
  { n: "Jackpot", c: "#2E7CFF" },
  { n: "Cases", c: "#00D2D3" },
];

const TABS = [
  { id: "all", label: "Live Wetten" },
  { id: "lucky", label: "Glückssträhnen" },
  { id: "whale", label: "Whale Gewinne" },
];

const now = () => new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

const genRow = () => {
  const whale = Math.random() < 0.12;
  const wager = whale ? 5000 + Math.floor(Math.random() * 15000) : 5 + Math.floor(Math.random() * 600);
  const win = Math.random() < 0.55;
  const mult = win ? +(1.1 + Math.random() * (whale ? 9 : 6)).toFixed(2) : 0;
  const game = GAMES[Math.floor(Math.random() * GAMES.length)];
  return {
    id: `${Date.now()}-${Math.random()}`,
    game,
    user: NAMES[Math.floor(Math.random() * NAMES.length)],
    time: now(),
    wager,
    mult,
    payout: win ? Math.round(wager * mult) : 0,
  };
};

const LiveBets = () => {
  const [tab, setTab] = useState("all");
  const [rows, setRows] = useState(() => Array.from({ length: 8 }, genRow));

  useEffect(() => {
    const i = setInterval(() => {
      setRows((r) => [genRow(), ...r].slice(0, 10));
    }, 3500);
    return () => clearInterval(i);
  }, []);

  const visible = rows.filter((r) => {
    if (tab === "lucky") return r.mult >= 3;
    if (tab === "whale") return r.wager >= 5000;
    return true;
  });

  return (
    <section id="live" className="mb-10" data-testid="live-bets-section">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight uppercase flex items-center gap-2.5">
          <TrendingUp className="w-5 h-5 text-mint" />
          Live Feed
        </h2>
        <div className="flex gap-1.5" data-testid="live-bets-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-colors duration-300 ${
                tab === t.id ? "bg-mint text-black" : "bg-night-card border border-night-border text-slate-400 hover:text-white"
              }`}
              data-testid={`live-tab-${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-night-card border border-night-border overflow-hidden">
        <div className="grid grid-cols-6 gap-2 px-5 py-3.5 border-b border-night-bordersub text-[10px] font-mono uppercase tracking-wider text-slate-500">
          <span>Spiel</span>
          <span>Benutzer</span>
          <span className="hidden sm:block">Uhrzeit</span>
          <span>Einsatz</span>
          <span>Multi</span>
          <span className="text-right">Auszahlung</span>
        </div>
        <AnimatePresence initial={false}>
          {visible.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-slate-500" data-testid="live-bets-empty">
              Warte auf Einträge … der Feed aktualisiert sich live.
            </p>
          )}
          {visible.slice(0, 8).map((r) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-6 gap-2 px-5 py-3 border-b border-night-bordersub/60 text-sm items-center hover:bg-night-cardhover/50 transition-colors duration-200"
              data-testid="live-bet-row"
            >
              <span className="flex items-center gap-2 font-semibold text-[13px]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.game.c }} />
                {r.game.n}
              </span>
              <span className="text-slate-400 text-[13px] truncate">{r.user}</span>
              <span className="hidden sm:block font-mono text-xs text-slate-500">{r.time}</span>
              <span className="font-mono text-xs text-slate-300">{r.wager.toLocaleString("de-DE")} €</span>
              <span>
                {r.mult > 0 ? (
                  <span className="font-mono font-bold text-amber-300 text-xs px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">{r.mult.toFixed(2)}x</span>
                ) : (
                  <span className="font-mono text-xs text-slate-600">—</span>
                )}
              </span>
              <span className={`text-right font-mono text-xs font-bold ${r.payout > 0 ? "text-mint" : "text-slate-600"}`}>
                {r.payout > 0 ? `+${r.payout.toLocaleString("de-DE")} €` : "0 €"}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LiveBets;
