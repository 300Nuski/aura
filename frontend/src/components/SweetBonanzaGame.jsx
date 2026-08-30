import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, RotateCw, Minus, Plus, Gift } from "lucide-react";
import CandySymbol from "@/components/CandySymbols";
import { playWinChime, playCashoutChime } from "@/lib/sounds";
import { recordRound } from "@/lib/rounds";

const COLS = 6;
const ROWS = 5;
const REGULARS = ["blueberry", "lemon", "kiwi", "watermelon", "orange", "plum", "jelly", "donut", "cupcake"];
const POOL = [
  ...Array(16).fill("blueberry"),
  ...Array(15).fill("lemon"),
  ...Array(14).fill("kiwi"),
  ...Array(13).fill("watermelon"),
  ...Array(12).fill("orange"),
  ...Array(11).fill("plum"),
  ...Array(9).fill("jelly"),
  ...Array(6).fill("donut"),
  ...Array(4).fill("cupcake"),
  ...Array(5).fill("jar"),
];
const PAYTABLE = {
  blueberry: [0.4, 0.9, 4],
  lemon: [0.4, 1, 4.5],
  kiwi: [0.5, 1.1, 5],
  watermelon: [0.6, 1.3, 6],
  orange: [0.7, 1.5, 7],
  plum: [0.8, 1.8, 8],
  jelly: [1, 2, 10],
  donut: [1.5, 3, 15],
  cupcake: [2.5, 6, 25],
};
const BETS = [10, 25, 50, 100, 250];
const BOMBS = [2, 2, 2, 3, 3, 3, 5, 5, 10, 10, 25, 50, 100];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const payFor = (type, count) => (count >= 12 ? PAYTABLE[type][2] : count >= 10 ? PAYTABLE[type][1] : count >= 8 ? PAYTABLE[type][0] : 0);

const evaluate = (cells, bet) => {
  const counts = {};
  cells.forEach((c) => {
    if (REGULARS.includes(c.type)) counts[c.type] = (counts[c.type] || 0) + 1;
  });
  let win = 0;
  const winKeys = new Set();
  Object.entries(counts).forEach(([t, n]) => {
    if (payFor(t, n) > 0) {
      win += payFor(t, n) * bet;
      cells.forEach((c) => c.type === t && winKeys.add(c.key));
    }
  });
  return { win, winKeys };
};

const SweetBonanzaGame = ({ balance, setBalance }) => {
  const kc = useRef(1);
  const newCell = () => ({ key: kc.current++, type: POOL[Math.floor(Math.random() * POOL.length)] });
  const fillGrid = () => Array.from({ length: COLS * ROWS }, newCell);

  const [grid, setGrid] = useState(fillGrid);
  const [gen, setGen] = useState(0);
  const [winningKeys, setWinningKeys] = useState(new Set());
  const [busy, setBusy] = useState(false);
  const [betIdx, setBetIdx] = useState(1);
  const bet = BETS[betIdx];
  const [roundWin, setRoundWin] = useState(0);
  const [fsLeft, setFsLeft] = useState(0);
  const [fsTotal, setFsTotal] = useState(0);
  const [bomb, setBomb] = useState(null);
  const [splash, setSplash] = useState(null);
  const [shake, setShake] = useState(false);
  const betRef = useRef(bet);
  betRef.current = bet;

  const tumbleGrid = (cells, winKeys) => {
    const next = new Array(COLS * ROWS);
    for (let col = 0; col < COLS; col++) {
      const survivors = [];
      for (let row = ROWS - 1; row >= 0; row--) {
        const c = cells[row * COLS + col];
        if (!winKeys.has(c.key)) survivors.unshift(c);
      }
      const colCells = [...Array.from({ length: ROWS - survivors.length }, newCell), ...survivors];
      for (let row = 0; row < ROWS; row++) next[row * COLS + col] = colCells[row];
    }
    return next;
  };

  const playOnce = async () => {
    let cells = fillGrid();
    setWinningKeys(new Set());
    setGrid(cells);
    setGen((g) => g + 1);
    await sleep(750);
    let win = 0;
    for (let i = 0; i < 20; i++) {
      const ev = evaluate(cells, betRef.current);
      if (ev.win <= 0) break;
      win += ev.win;
      setRoundWin(win);
      setWinningKeys(ev.winKeys);
      await sleep(620);
      setWinningKeys(new Set());
      cells = tumbleGrid(cells, ev.winKeys);
      setGrid(cells);
      setGen((g) => g + 1);
      await sleep(680);
    }
    const scatters = cells.filter((c) => c.type === "jar").length;
    return { win, scatters };
  };

  const runFreeSpins = async (count) => {
    let fsWin = 0;
    let fs = count;
    setFsTotal(0);
    while (fs > 0) {
      setFsLeft(fs);
      const r = await playOnce();
      let w = r.win;
      if (w > 0 && Math.random() < 0.55) {
        const m = BOMBS[Math.floor(Math.random() * BOMBS.length)];
        setBomb(m);
        playCashoutChime();
        w = Math.floor(w * m);
        await sleep(1000);
        setBomb(null);
      }
      fsWin += w;
      setFsTotal((t) => t + w);
      setRoundWin(w);
      if (r.scatters >= 4) {
        fs += 5;
        toast.info("+5 Freispiele!");
      }
      fs--;
      await sleep(450);
    }
    setFsLeft(0);
    return fsWin;
  };

  const settle = async (total, stake) => {
    const credit = Math.floor(total);
    if (credit > 0) {
      setBalance((b) => b + credit);
      playWinChime();
      recordRound({ game: "Sweet Bonanza", bet: stake, mult: +(total / stake).toFixed(2), payout: credit });
      if (total >= stake * 10) {
        setSplash(credit);
        setShake(true);
        await sleep(2400);
        setSplash(null);
        setShake(false);
      } else {
        toast.success(`Gewinn: +${credit.toLocaleString("de-DE")} €`);
      }
    } else {
      recordRound({ game: "Sweet Bonanza", bet: stake, mult: 0, payout: 0 });
    }
    setRoundWin(0);
    setBusy(false);
  };

  const spin = async () => {
    if (busy || balance < bet) return;
    setBusy(true);
    setSplash(null);
    setRoundWin(0);
    setBomb(null);
    setBalance((b) => b - bet);
    const first = await playOnce();
    let total = first.win;
    if (first.scatters >= 4) {
      toast.success("4+ Freispiel-Gläser! 10 FREISPIELE!");
      await sleep(900);
      total += await runFreeSpins(10);
    }
    await settle(total, bet);
  };

  const buyFs = async () => {
    const cost = bet * 100;
    if (busy || balance < cost) return;
    setBusy(true);
    setSplash(null);
    setRoundWin(0);
    setBomb(null);
    setBalance((b) => b - cost);
    toast.success("Freispiele gekauft — 10 Runden starten!");
    await sleep(600);
    const total = await runFreeSpins(10);
    await settle(total, cost);
  };

  return (
    <div
      className="relative rounded-[26px] border-4 border-white/80 shadow-[0_30px_80px_-20px_rgba(236,72,153,0.45)] overflow-hidden bg-gradient-to-b from-[#FDF2F8] via-[#FCE7F3] to-[#FBCFE8]"
      data-testid="sb-game"
    >
      <div className="absolute top-10 -left-8 w-44 h-20 bg-white/70 rounded-full blur-xl" aria-hidden="true" />
      <div className="absolute top-24 -right-10 w-52 h-24 bg-white/60 rounded-full blur-xl" aria-hidden="true" />
      <div className="absolute -bottom-6 left-1/3 w-48 h-20 bg-white/50 rounded-full blur-xl" aria-hidden="true" />
      {[["8%", "14%"], ["88%", "10%"], ["72%", "80%"], ["6%", "68%"], ["46%", "6%"], ["94%", "48%"]].map(([l, t], i) => (
        <span key={i} className="absolute w-1.5 h-1.5 rounded-full bg-[#F472B6] animate-twinkle" style={{ left: l, top: t, animationDelay: `${i * 0.4}s` }} aria-hidden="true" />
      ))}

      <div className={`relative z-10 p-4 sm:p-6 ${shake ? "animate-candy-shake" : ""}`}>
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight -rotate-2 select-none leading-none" data-testid="sb-title">
            <span
              className="bg-gradient-to-b from-[#FB7185] to-[#DB2777] bg-clip-text text-transparent"
              style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.9)", filter: "drop-shadow(0 2px 0 rgba(131,24,67,0.35))" }}
            >
              SWEET
            </span>
            <br />
            <span
              className="bg-gradient-to-b from-[#FDE68A] to-[#F59E0B] bg-clip-text text-transparent"
              style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.9)", filter: "drop-shadow(0 2px 0 rgba(120,53,15,0.35))" }}
            >
              BONANZA
            </span>
          </h2>
          <div className="min-h-[36px] flex items-center">
            {fsLeft > 0 && (
              <span className="rounded-full bg-[#EC4899] text-white font-mono text-xs font-bold px-4 py-2 shadow-lg" data-testid="sb-freespins-display">
                FREISPIELE: {fsLeft} · {Math.floor(fsTotal).toLocaleString("de-DE")} €
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-stretch">
          <div className="hidden md:flex flex-col w-40 shrink-0 rounded-2xl bg-white/70 border-2 border-[#F9A8D4] p-4 shadow-md">
            <Gift className="w-6 h-6 text-[#EC4899] mb-2" />
            <p className="font-display font-extrabold text-sm text-[#9D174D] leading-tight mb-1">FREISPIELE KAUFEN</p>
            <p className="font-mono text-[10px] text-[#BE185D] mb-3">100 × Einsatz</p>
            <button
              onClick={buyFs}
              disabled={busy || balance < bet * 100}
              className="mt-auto rounded-xl bg-gradient-to-b from-[#F472B6] to-[#DB2777] text-white font-display font-extrabold text-sm py-2.5 border-b-4 border-[#9D174D] hover:brightness-110 active:translate-y-0.5 active:border-b-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              data-testid="sb-buy-fs-btn"
            >
              {(bet * 100).toLocaleString("de-DE")} €
            </button>
          </div>

          <div className="relative flex-1 rounded-2xl bg-white/40 border-2 border-white/80 p-2.5 sm:p-3.5 shadow-inner">
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2" key={gen} data-testid="sb-grid">
              {grid.map((c, i) => (
                <motion.div
                  key={c.key}
                  initial={{ y: -46 - Math.floor(i / COLS) * 22, opacity: 0, scale: 0.7 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 21, delay: Math.floor(i / COLS) * 0.05 + (i % COLS) * 0.015 }}
                  className={`aspect-square rounded-xl bg-white/60 border border-white/80 shadow-[0_3px_8px_rgba(157,23,77,0.12)] p-1 flex items-center justify-center ${winningKeys.has(c.key) ? "winning-cell" : ""}`}
                >
                  <CandySymbol type={c.type} />
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {bomb && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
                  data-testid="sb-bomb-overlay"
                >
                  <div className="w-24 h-24 drop-shadow-[0_0_30px_rgba(167,139,250,0.9)]">
                    <CandySymbol type="multijar" />
                  </div>
                  <span className="mt-1 font-display font-black text-4xl text-[#7C3AED] drop-shadow-[0_2px_0_rgba(255,255,255,0.9)]">×{bomb}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {splash && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-2xl bg-white/85 backdrop-blur-sm"
                  data-testid="sb-win-splash"
                >
                  <motion.p
                    initial={{ scale: 0.4, rotate: -6 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 13 }}
                    className="font-display font-black text-3xl sm:text-5xl bg-gradient-to-b from-[#FB7185] to-[#DB2777] bg-clip-text text-transparent"
                    style={{ filter: "drop-shadow(0 3px 0 rgba(131,24,67,0.25))" }}
                  >
                    GROSSER GEWINN!
                  </motion.p>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="mt-2 font-mono font-bold text-2xl sm:text-3xl text-[#9D174D]"
                  >
                    +{splash.toLocaleString("de-DE")} €
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden xl:flex flex-col justify-center gap-4 w-20 shrink-0">
            {[
              ["jar", "Freispiele"],
              ["multijar", "Multi"],
              ["jar", "Jackpot"],
            ].map(([t, label], i) => (
              <div key={i} className="animate-bob text-center" style={{ animationDelay: `${i * 0.5}s` }}>
                <CandySymbol type={t} />
                <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#9D174D] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[32px] my-3">
          {roundWin > 0 ? (
            <motion.span
              key={roundWin}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="rounded-full bg-white border-2 border-[#F472B6] text-[#DB2777] font-mono text-sm font-bold px-5 py-1.5 shadow-md"
              data-testid="sb-round-win"
            >
              Gewinn: {Math.floor(roundWin).toLocaleString("de-DE")} €
            </motion.span>
          ) : (
            <span className="text-xs text-[#9D174D] font-semibold inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
              8+ gleiche Symbole gewinnen überall · 4+ Gläser = 10 Freispiele
            </span>
          )}
        </div>

        <div className="rounded-2xl bg-[#3B1454] px-4 sm:px-5 py-3 flex items-center justify-between gap-3 shadow-lg">
          <div className="text-left">
            <p className="text-[9px] font-mono uppercase tracking-wider text-[#C4B5FD]">Guthaben</p>
            <p className="font-mono font-bold text-sm sm:text-base text-white tabular-nums" data-testid="sb-balance">{balance.toLocaleString("de-DE")} €</p>
            <p className="text-[9px] font-mono uppercase tracking-wider text-[#C4B5FD] mt-1">
              Einsatz <span className="text-[#FDE047] font-bold">{bet} €</span>
            </p>
          </div>

          <p className="hidden sm:block font-display font-extrabold text-white tracking-wide text-sm">DREHEN &amp; GEWINNEN!</p>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setBetIdx((i) => Math.max(0, i - 1))}
              disabled={busy || betIdx === 0}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center hover:bg-white/20 transition-colors duration-200 disabled:opacity-30"
              data-testid="sb-bet-minus"
              aria-label="Einsatz senken"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={spin}
              disabled={busy || balance < bet}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF5C8A] to-[#F59E0B] border-4 border-white/70 shadow-[0_10px_28px_-6px_rgba(255,92,138,0.8)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              data-testid="sb-spin-btn"
              aria-label="Drehen"
            >
              <RotateCw className={`w-7 h-7 text-white ${busy ? "animate-spin" : ""}`} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setBetIdx((i) => Math.min(BETS.length - 1, i + 1))}
              disabled={busy || betIdx === BETS.length - 1}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center hover:bg-white/20 transition-colors duration-200 disabled:opacity-30"
              data-testid="sb-bet-plus"
              aria-label="Einsatz erhöhen"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SweetBonanzaGame;
