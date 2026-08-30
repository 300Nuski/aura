import { useMemo, useRef, useState } from "react";
import { motion, animate } from "framer-motion";
import { toast } from "sonner";
import { RotateCw } from "lucide-react";

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

const RouletteGame = () => {
  const [balance, setBalance] = useState(1000);
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
        const a1 = a0 + SEG;
        const mid = a0 + SEG / 2;
        const fill = num === 0 ? "#2F6B4F" : REDS.has(num) ? "#A32A29" : "#1B1916";
        const [tx, ty] = polar(160, 160, 118, mid);
        return { num, d: wedgePath(160, 160, 148, a0, a1), fill, tx, ty, mid };
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

    await animate(target - (360 * 6 + delta), target, {
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
    if (won) {
      setBalance((b) => b + chip * mult);
      toast.success(`Gewonnen! Die Kugel fällt auf ${num} · +${(chip * mult).toLocaleString("de-DE")} €`);
    } else {
      toast.error(`Die Kugel fällt auf ${num}. Leider verloren.`);
    }
    setSpinning(false);
  };

  return (
    <div className="rounded-2xl bg-white border border-[rgba(201,168,106,0.3)] shadow-[0_36px_80px_-40px_rgba(23,22,20,0.3)] p-6 sm:p-8" data-testid="roulette-game">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-aura-gold font-medium mb-1">Spiel A</p>
          <h3 className="font-serif text-xl sm:text-2xl font-medium">Aura Roulette Spin</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-aura-muted">Guthaben</p>
          <p className="font-mono text-lg font-semibold tabular-nums" data-testid="roulette-balance">{balance.toLocaleString("de-DE")} €</p>
        </div>
      </div>

      <div className="relative w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] mx-auto mb-6">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[9px] border-r-[9px] border-t-[16px] border-l-transparent border-r-transparent border-t-aura-gold drop-shadow" />
        <div ref={wheelRef} className="w-full h-full will-change-transform" data-testid="roulette-wheel-svg">
          <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-[0_20px_36px_rgba(23,22,20,0.22)]">
            <circle cx="160" cy="160" r="156" fill="#F6F2EA" stroke="#C9A86A" strokeWidth="2" />
            {segments.map((s) => (
              <g key={s.num}>
                <path d={s.d} fill={s.fill} stroke="#C9A86A" strokeWidth="0.5" />
                <text
                  x={s.tx}
                  y={s.ty}
                  fill="#FDFBF7"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${s.mid} ${s.tx} ${s.ty})`}
                >
                  {s.num}
                </text>
              </g>
            ))}
            <circle cx="160" cy="160" r="66" fill="#FDFBF7" stroke="#C9A86A" strokeWidth="1.5" />
            <circle cx="160" cy="160" r="56" fill="none" stroke="#C9A86A" strokeWidth="0.75" strokeDasharray="2 5" />
            <text x="160" y="157" textAnchor="middle" fontSize="17" fill="#171614" letterSpacing="3" fontFamily="Cormorant Garamond, serif">AURA</text>
            <text x="160" y="176" textAnchor="middle" fontSize="7.5" fill="#C9A86A" letterSpacing="3" fontFamily="JetBrains Mono, monospace">ROYALE</text>
          </svg>
        </div>
        {result && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className={`absolute inset-x-0 -bottom-2 mx-auto w-max rounded-full px-4 py-1.5 font-mono text-xs font-semibold shadow-lg ${
              result.won ? "bg-emerald-700 text-white" : "bg-aura-noir text-aura-ivory"
            }`}
            data-testid="roulette-result-badge"
          >
            {result.num} · {result.num === 0 ? "Grün" : REDS.has(result.num) ? "Rot" : "Schwarz"} {result.won ? `· +${result.amount.toLocaleString("de-DE")} €` : ""}
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => setChip(c)}
            disabled={spinning}
            className={`w-11 h-11 rounded-full font-mono text-xs font-semibold border-2 transition-all duration-300 ${
              chip === c
                ? "bg-aura-noir text-aura-gold border-aura-gold scale-110"
                : "bg-aura-goldtint text-aura-ink border-[rgba(201,168,106,0.4)] hover:border-aura-gold"
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
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
              bet.type === o.id
                ? "bg-aura-gold text-white shadow-[0_10px_24px_-10px_rgba(201,168,106,0.7)]"
                : "bg-aura-alabaster text-aura-secondary hover:bg-aura-elevated"
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
            className="rounded-full border border-[rgba(201,168,106,0.4)] bg-white px-3 py-2 text-xs font-mono"
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
        className="w-full rounded-full bg-aura-noir text-aura-ivory py-3.5 text-sm font-semibold inline-flex items-center justify-center gap-2.5 hover:bg-aura-goldhover transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        data-testid="roulette-spin-button"
      >
        <RotateCw className={`w-4 h-4 ${spinning ? "animate-spin" : ""}`} />
        {spinning ? "Die Kugel rollt …" : `Drehen · Einsatz ${chip} €`}
      </button>

      {history.length > 0 && (
        <div className="mt-5 flex items-center justify-center gap-2" data-testid="roulette-history">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-aura-muted mr-1">Verlauf</span>
          {history.map((n, i) => (
            <span
              key={`${n}-${i}`}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-semibold text-white ${
                n === 0 ? "bg-emerald-700" : REDS.has(n) ? "bg-aura-crimson" : "bg-aura-noir"
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
