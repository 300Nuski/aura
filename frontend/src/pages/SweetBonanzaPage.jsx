import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Candy } from "lucide-react";
import SweetBonanzaGame from "@/components/SweetBonanzaGame";
import CandySymbol, { SYMBOLS } from "@/components/CandySymbols";

const SweetBonanzaPage = ({ balance, setBalance }) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} data-testid="sweet-bonanza-page">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-mint transition-colors duration-300 mb-5"
        data-testid="sb-back-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Lobby
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
        <div className="lg:col-span-3">
          <SweetBonanzaGame balance={balance} setBalance={setBalance} />
        </div>
        <aside className="rounded-2xl bg-night-card border border-night-border p-5 sm:p-6" data-testid="sb-paytable">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#EC4899] font-bold mb-1">Gewinntabelle</p>
          <h3 className="font-display text-lg font-extrabold mb-4 flex items-center gap-2">
            <Candy className="w-4 h-4 text-[#EC4899]" />
            Symbole & Werte
          </h3>
          <ul className="space-y-3 mb-5">
            {SYMBOLS.map((s) => (
              <li key={s.type} className="flex items-center gap-3">
                <span className="w-9 h-9 shrink-0">
                  <CandySymbol type={s.type} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate">{s.label}</p>
                  <p className="font-mono text-[10px] text-slate-500">
                    8+: <span className="text-mint">{s.pays[0]}×</span> · 10+: <span className="text-mint">{s.pays[1]}×</span> · 12+: <span className="text-mint">{s.pays[2]}×</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="h-px bg-night-bordersub mb-4" />
          <div className="flex items-center gap-3 mb-3">
            <span className="w-9 h-9 shrink-0">
              <CandySymbol type="lollipop" />
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-white font-semibold">Lolli (Scatter):</span> 4+ lösen 10 Freispiele aus, weitere 4+ geben +5.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 shrink-0">
              <CandySymbol type="bomb" />
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-white font-semibold">Regenbogen-Bombe:</span> erscheint in Freispielen und multipliziert den Rundengewinn mit ×2 bis ×100.
            </p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default SweetBonanzaPage;
