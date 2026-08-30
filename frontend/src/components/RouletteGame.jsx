import { useMemo, useRef, useState } from "react";
import { motion, animate } from "framer-motion";
import { toast } from "sonner";
import { RotateCw } from "lucide-react";
import { playWinChime } from "@/lib/sounds";
import { recordRound } from "@/lib/rounds";

const WHEEL = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const REDS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const SEG = 360 / 37;
const CHIPS = [10, 50, 100, 500];

const polar = (cx, cy, r, deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

const wedgePath = (cx, cy, r, a0, a1) => {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
};

const BET_OPTIONS = [
  { id: "red", label: "Rot", testid: "roulette-bet-red-btn", mult: 2 },
  { id: "black", label: "Schwarz", testid: "roulette-bet-black-btn", mult: 2 },
  { id: "even", label: "Gerade", testid: "roulette-bet-even-btn", mult: 2 },
  { id: "odd", label: "Ungerade", testid: "roulette-bet-odd-btn", mult: 2 },
  { id: "straight", label: "Zahl", testid: "roulette-bet-straight-btn", mult: 36 },
];

const checkWin = (bet, num) => {
  switch (bet.type) {
    case "red": return REDS.has(num);
    case "black": return num !== 0 && !REDS.has(num);
    case "even": return num !== 0 && num % 2 === 0;
    case "odd": return num % 2 === 1;
    case "straight": return num === bet.number;
    default: return false;
  }
};

const RouletteGame = ({ balance, setBalance }) => {
  const [chip, setChip] = useState(50);
  const [bet, setBet] = useState({ type: "red" });
  const [straightNum, setStraightNum] = useState(7);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const rotationRef = useRef(0);
  const wheelRef = useRef(null);

  const segments = useMemo(
    () =>
      WHEEL.map((num, i) => {
        const a0 = i * SEG;
        const mid = a0 + SEG / 2;
        const fill = num === 0 ? "#00E575" : REDS.has(num) ? "#E84118" : "#232938";
        const [tx, ty] = polar(160, 160, 118, mid);
        return { num, d: wedgePath(160, 160, 148, a0, a0 + SEG), fill, tx, ty, mid };
      }),
    []
  );

  const spin = async () => {
    if (spinning || balance < chip) return;
    const activeBet = bet.type === "straight" ? { ...bet, number: straightNum } : bet;
    setSpinning(true);
    setResult(null);
    setBalance((b) => b - chip);

    const idx = Math.floor(Math.random() * 37);
    const num = WHEEL[idx];
    const current = rotationRef.current;
    const norm = ((current % 360) + 360) % 360;
    const targetMod = (((360 - (idx * SEG + SEG / 2)) % 360) + 360) % 360;
    const delta = (((targetMod - norm) % 360) + 360) % 360;
    const target = current + 360 * 6 + delta;
    rotationRef.current = target;

    await animate(current, target, {
      duration: 4.4,
      ease: [0.12, 0.75, 0.08, 1],
      onUpdate: (v) => {
        if (wheelRef.current) wheelRef.current.style.transform = `rotate(${v}deg)`;
      },
    });

    const won = checkWin(activeBet, num);
    const mult = BET_OPTIONS.find((o) => o.id === activeBet.type).mult;
    setResult({ num, won, amount: won ? chip * mult : 0 });
    setHistory((h) => [num, ...h].slice(0, 8));
    recordRound({ game: "Roulette", bet: chip, mult: won ? mult : 0, payout: won ? chip * mult : 0 });
    if (won) {
      setBalance((b) => b + chip * mult);
      playWinChime();
      toast.success(`Gewonnen! Kugel auf ${num} · +${(chip * mult).toLocaleString("de-DE")} €`);
    } else {
      toast.error(`Kugel auf ${num}. Leider verloren.`);
    }
    setSpinning(false);
  };

  return (
    <div className="rounded-2xl bg-night-card border border-night-border p-5 sm:p-6" data-testid="roulette-game">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#E84118] font-bold mb-1">Kesselspiel</p>
          <h3 className="font-display text-lg sm:text-xl font-extrabold">Royale Roulette</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">Guthaben</p>
          <p className="font-mono text-base font-bold text-mint tabular-nums" data-testid="roulette-balance">{balance.toLocaleString("de-DE")} €</p>
        </div>
      </div>

      <div className="relative w-[230px] h-[230px] sm:w-[280px] sm:h-[280px] mx-auto mb-6">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[9px] border-r-[9px] border-t-[16px] border-l-transparent border-r-transparent border-t-mint drop-shadow-[0_0_10px_rgba(0,229,117,0.7)]" />
        <div ref={wheelRef} className="w-full h-full will-change-transform" data-testid="roulette-wheel-svg">
          <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-[0_18px_36px_rgba(0,0,0,0.55)]">
            <circle cx="160" cy="160" r="156" fill="#0B0D12" stroke="#2A3040" strokeWidth="2" />
            {segments.map((s) => (
              <g key={s.num}>
                <path d={s.d} fill={s.fill} stroke="#0B0D12" strokeWidth="0.75" />
                <text
                  x={s.tx}
                  y={s.ty}
                  fill="#FFFFFF"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${s.mid} ${s.tx} ${s.ty})`}
                >
                  {s.num}
                </text>
              </g>
            ))}
            <circle cx="160" cy="160" r="66" fill="#0E1015" stroke="#00E575" strokeWidth="1.5" />
            <circle cx="160" cy="160" r="56" fill="none" stroke="#2A3040" strokeWidth="0.75" strokeDasharray="2 5" />
            <text x="160" y="157" textAnchor="middle" fontSize="17" fontWeight="800" fill="#FFFFFF" letterSpacing="3" fontFamily="Outfit, sans-serif">AURA</text>
            <text x="160" y="176" textAnchor="middle" fontSize="7.5" fill="#00E575" letterSpacing="3" fontFamily="JetBrains Mono, monospace">ROYALE</text>
          </svg>
        </div>
        {result && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className={`absolute inset-x-0 -bottom-2 mx-auto w-max rounded-full px-4 py-1.5 font-mono text-xs font-bold shadow-lg ${
              result.won ? "bg-mint text-black" : "bg-night-elevated text-slate-300 border border-night-border"
            }`}
            data-testid="roulette-result-badge"
          >
            {result.num} · {result.num === 0 ? "Zero" : REDS.has(result.num) ? "Rot" : "Schwarz"} {result.won ? `· +${result.amount.toLocaleString("de-DE")} €` : ""}
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => setChip(c)}
            disabled={spinning}
            className={`w-11 h-11 rounded-full font-mono text-xs font-bold border-2 transition-all duration-300 ${
              chip === c
                ? "bg-mint text-black border-mint scale-110 shadow-[0_0_18px_rgba(0,229,117,0.5)]"
                : "bg-night-elevated text-slate-300 border-night-border hover:border-mint/50"
            }`}
            data-testid={`roulette-chip-selector-${c}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        {BET_OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={() => setBet({ type: o.id })}
            disabled={spinning}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
              bet.type === o.id
                ? "bg-mint text-black shadow-[0_0_16px_rgba(0,229,117,0.4)]"
                : "bg-night-elevated text-slate-400 hover:text-white hover:bg-night-cardhover"
            }`}
            data-testid={o.testid}
          >
            {o.label} <span className="font-mono opacity-70">×{o.mult}</span>
          </button>
        ))}
        {bet.type === "straight" && (
          <select
            value={straightNum}
            onChange={(e) => setStraightNum(Number(e.target.value))}
            disabled={spinning}
            className="rounded-full border border-night-border bg-night-elevated px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-mint/60"
            data-testid="roulette-bet-number-select"
          >
            {Array.from({ length: 37 }).map((_, n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        )}
      </div>

      <button
        onClick={spin}
        disabled={spinning || balance < chip}
        className="w-full rounded-full bg-mint text-black py-3.5 text-sm font-extrabold inline-flex items-center justify-center gap-2.5 hover:bg-mint-hover transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_22px_rgba(0,229,117,0.35)]"
        data-testid="roulette-spin-button"
      >
        <RotateCw className={`w-4 h-4 ${spinning ? "animate-spin" : ""}`} strokeWidth={2.5} />
        {spinning ? "Die Kugel rollt …" : `Drehen · Einsatz ${chip} €`}
      </button>

      {history.length > 0 && (
        <div className="mt-5 flex items-center justify-center gap-2 flex-wrap" data-testid="roulette-history">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 mr-1">Verlauf</span>
          {history.map((n, i) => (
            <span
              key={`${n}-${i}`}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${
                n === 0 ? "bg-mint text-black" : REDS.has(n) ? "bg-[#E84118] text-white" : "bg-night-elevated text-white border border-night-border"
              }`}
            >
              {n}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouletteGame;
