import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Disc } from "lucide-react";
import RouletteGame from "@/components/RouletteGame";

const RULES = [
  ["Rot / Schwarz", "×2"],
  ["Gerade / Ungerade", "×2"],
  ["Plein (eine Zahl)", "×36"],
];

const RoulettePage = ({ balance, setBalance }) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} data-testid="roulette-page">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-mint transition-colors duration-300 mb-5"
        data-testid="roulette-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Lobby
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2">
          <RouletteGame balance={balance} setBalance={setBalance} />
        </div>
        <aside className="rounded-2xl bg-night-card border border-night-border p-5 sm:p-6" data-testid="roulette-rules">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#E84118] font-bold mb-1">Regeln</p>
          <h3 className="font-display text-lg font-extrabold mb-4 flex items-center gap-2">
            <Disc className="w-4 h-4 text-[#E84118]" />
            Auszahlung
          </h3>
          <ul className="space-y-2.5 mb-5">
            {RULES.map(([label, mult]) => (
              <li key={label} className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{label}</span>
                <span className="font-mono font-bold text-mint">{mult}</span>
              </li>
            ))}
          </ul>
          <div className="h-px bg-night-bordersub mb-4" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Europäisches Roulette mit 37 Feldern (0–36). Die grüne Zero verliert bei allen
            einfachen Chancen. Dein Guthaben ist mit der Lobby synchronisiert.
          </p>
        </aside>
      </div>
    </motion.div>
  );
};

export default RoulettePage;
