import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Layers } from "lucide-react";
import BlackjackGame from "@/components/BlackjackGame";

const RULES = [
  ["Gewinn", "1:1"],
  ["Blackjack (Ass + 10)", "3:2"],
  ["Push (Gleichstand)", "Einsatz zurück"],
  ["Dealer", "steht ab 17"],
];

const BlackjackPage = ({ balance, setBalance }) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} data-testid="blackjack-page">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-mint transition-colors duration-300 mb-5"
        data-testid="blackjack-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Lobby
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2">
          <BlackjackGame balance={balance} setBalance={setBalance} />
        </div>
        <aside className="rounded-2xl bg-night-card border border-night-border p-5 sm:p-6" data-testid="blackjack-rules">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-mint font-bold mb-1">Regeln</p>
          <h3 className="font-display text-lg font-extrabold mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-mint" />
            So wird gespielt
          </h3>
          <ul className="space-y-2.5 mb-5">
            {RULES.map(([label, val]) => (
              <li key={label} className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{label}</span>
                <span className="font-mono font-bold text-mint">{val}</span>
              </li>
            ))}
          </ul>
          <div className="h-px bg-night-bordersub mb-4" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Komme näher an 21 als der Dealer, ohne dich zu überkaufen. Asse zählen 1 oder 11 —
            die Engine wählt automatisch den besten Wert.
          </p>
        </aside>
      </div>
    </motion.div>
  );
};

export default BlackjackPage;
