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

      <BlackjackGame balance={balance} setBalance={setBalance} />

      <aside className="mt-5 rounded-2xl bg-night-card border border-night-border p-5 sm:p-6" data-testid="blackjack-rules">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="font-display text-lg font-extrabold flex items-center gap-2 shrink-0">
            <Layers className="w-4 h-4 text-mint" />
            So wird gespielt
          </h3>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
            {RULES.map(([label, val]) => (
              <li key={label} className="rounded-xl bg-night-elevated border border-night-border px-3 py-2.5">
                <p className="text-[11px] text-slate-400 leading-tight">{label}</p>
                <p className="font-mono font-bold text-mint text-sm mt-0.5">{val}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mt-4">
          Komme näher an 21 als der Dealer, ohne dich zu überkaufen. Asse zählen 1 oder 11 —
          die Engine wählt automatisch den besten Wert.
        </p>
      </aside>
    </motion.div>
  );
};

export default BlackjackPage;
