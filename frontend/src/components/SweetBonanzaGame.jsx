import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import CandySymbol from "@/components/CandySymbols";
import { playWinChime, playCashoutChime } from "@/lib/sounds";
import { recordRound } from "@/lib/rounds";

const COLS = 6;
const ROWS = 5;
const REGULARS = ["grapes", "melon", "plum", "blue", "purple", "heart"];
const POOL = [
  ...Array(22).fill("grapes"),
  ...Array(20).fill("melon"),
  ...Array(18).fill("plum"),
  ...Array(14).fill("blue"),
  ...Array(12).fill("purple"),
  ...Array(8).fill("heart"),
  ...Array(6).fill("lollipop"),
];
const PAYTABLE = { grapes: [0.4, 0.9, 4], melon: [0.5, 1, 5], plum: [0.8, 1.2, 8], blue: [1.5, 2, 12], purple: [2, 5, 20], heart: [4, 10, 40] };
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
  const [bet, setBet] = useState(25);
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
    const scatters = cells.filter((c) => c.type === "lollipop").length;
    return { win, scatters };
  };

  const spin = async () => {
    if (busy || balance < bet) return;
    setBusy(true);
    setSplash(null);
    setRoundWin(0);
    setBomb(null);
    setBalance((b) => b - bet);
    let total = 0;
    const first = await playOnce();
    total += first.win;
    let fs = first.scatters >= 4 ? 10 : 0;
    if (fs) {
      setFsTotal(0);
      toast.success("4+ Lollis! 10 FREISPIELE!");
      await sleep(900);
    }
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
      total += w;
      setFsTotal((t) => t + w);
      setRoundWin(w);
      if (r.scatters >= 4) {
        fs += 5;
        toast.info("+5 Freispiele!");
      }
      fs--;
      await sleep(500);
    }
    setFsLeft(0);
    const credit = Math.floor(total);
    if (credit > 0) {
      setBalance((b) => b + credit);
      playWinChime();
      recordRound({ game: "Sweet Bonanza", bet, mult: +(total / bet).toFixed(2), payout: credit });
      if (total >= bet * 10) {
        setSplash(credit);
        setShake(true);
        await sleep(2400);
        setSplash(null);
        setShake(false);
      } else {
        toast.success(`Gewinn: +${credit.toLocaleString("de-DE")} €`);
      }
    } else {
      recordRound({ game: "Sweet Bonanza", bet, mult: 0, payout: 0 });
    }
    setRoundWin(0);
    setBusy(false);
  };

  return (
    <div
      className="relative rounded-[26px] p-2.5 shadow-[0_30px_80px_-20px_rgba(236,72,153,0.4)]"
      style={{ background: "repeating-linear-gradient(45deg,#FF5C8A 0 14px,#FFFFFF 14px 28px)" }}
      data-testid="sb-game"
    >
      <div className={`relative rounded-[20px] bg-gradient-to-b from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] p-4 sm:p-6 overflow-hidden ${shake ? "animate-candy-shake" : ""}`}>
        <div className="absolute -top-10 -left-10 w-48 h-24 bg-white/15 rounded-full blur-2xl" aria-hidden="true" />
        <div className="absolute -bottom-8 -right-8 w-56 h-28 bg-[#F0ABFC]/20 rounded-full blur-2xl" aria-hidden="true" />
        {[["12%", "18%"], ["85%", "12%"], ["70%", "82%"], ["8%", "75%"], ["45%", "8%"], ["92%", "55%"]].map(([l, t], i) => (
          <span key={i} className="absolute w-1.5 h-1.5 rounded-full bg-white animate-twinkle" style={{ left: l, top: t, animationDelay: `${i * 0.4}s` }} aria-hidden="true" />
        ))}

        <h2
          className="relative z-10 text-center font-display font-black text-3xl sm:text-4xl tracking-tight -rotate-2 mb-1 select-none"
          data-testid="sb-title"
        >
          <span className="bg-gradient-to-b from-[#FDE68A] to-[#F59E0B] bg-clip-text text-transparent drop-shadow-[0_2px_0_rgba(120,53,15,0.8)]">SWEET&nbsp;</span>
          <span className="bg-gradient-to-b from-[#F9A8D4] to-[#EC4899] bg-clip-text text-transparent drop-shadow-[0_2px_0_rgba(131,24,67,0.8)]">BONANZA</span>
        </h2>
        <p className="relative z-10 text-center text-[11px] font-mono uppercase tracking-[0.22em] text-[#E9D5FF] mb-4">
          8+ gleiche Symbole gewinnen · überall auf dem Feld
        </p>

        <div className="relative z-10 w-full max-w-[680px] mx-auto mb-4">
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2" key={gen} data-testid="sb-grid">
            {grid.map((c, i) => (
              <motion.div
                key={c.key}
                initial={{ y: -46 - Math.floor(i / COLS) * 22, opacity: 0, scale: 0.7 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 21, delay: Math.floor(i / COLS) * 0.05 + (i % COLS) * 0.015 }}
                className={`aspect-square rounded-xl bg-white/10 p-1 flex items-center justify-center ${winningKeys.has(c.key) ? "winning-cell" : ""}`}
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
                <div className="w-24 h-24 drop-shadow-[0_0_30px_rgba(253,224,71,0.8)]">
                  <CandySymbol type="bomb" />
                </div>
                <span className="mt-1 font-display font-black text-4xl text-[#FDE047] drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]">×{bomb}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {splash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-2xl bg-[#2E1065]/80 backdrop-blur-sm"
                data-testid="sb-win-splash"
              >
                <motion.p
                  initial={{ scale: 0.4, rotate: -6 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 13 }}
                  className="font-display font-black text-3xl sm:text-5xl bg-gradient-to-b from-[#FDE68A] to-[#F59E0B] bg-clip-text text-transparent drop-shadow-[0_3px_0_rgba(120,53,15,0.9)]"
                >
                  GROSSER GEWINN!
                </motion.p>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mt-2 font-mono font-bold text-2xl sm:text-3xl text-white"
                >
                  +{splash.toLocaleString("de-DE")} €
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-3 mb-4 min-h-[36px]">
          {fsLeft > 0 ? (
            <span className="rounded-full bg-[#F0ABFC]/20 border border-[#F0ABFC]/50 text-[#F5D0FE] font-mono text-xs font-bold px-4 py-2" data-testid="sb-freespins-display">
              FREISPIELE: {fsLeft} · Gewinn bisher {Math.floor(fsTotal).toLocaleString("de-DE")} €
            </span>
          ) : roundWin > 0 ? (
            <motion.span
              key={roundWin}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="rounded-full bg-mint/20 border border-mint/50 text-mint font-mono text-xs font-bold px-4 py-2"
              data-testid="sb-round-win"
            >
              Rundengewinn: {Math.floor(roundWin).toLocaleString("de-DE")} €
            </motion.span>
          ) : (
            <span className="text-xs text-[#DDD6FE] font-medium inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
              4+ Lollis lösen 10 Freispiele mit Multiplikator-Bomben bis ×100 aus
            </span>
          )}
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-4">
          {BETS.map((b) => (
            <button
              key={b}
              onClick={() => setBet(b)}
              disabled={busy}
              className={`rounded-full px-4 py-2 font-mono text-xs font-bold border-2 transition-all duration-300 disabled:opacity-40 ${
                bet === b
                  ? "bg-[#FDE047] text-black border-[#FDE047] scale-110 shadow-[0_0_18px_rgba(253,224,71,0.6)]"
                  : "bg-white/10 text-white border-white/20 hover:border-[#FDE047]/60"
              }`}
              data-testid={`sb-bet-${b}`}
            >
              {b} €
            </button>
          ))}
        </div>

        <button
          onClick={spin}
          disabled={busy || balance < bet}
          className="relative z-10 mx-auto flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF5C8A] to-[#FBBF24] text-white font-display font-black text-lg px-12 py-4 shadow-[0_12px_36px_-8px_rgba(255,92,138,0.7)] hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          data-testid="sb-spin-btn"
        >
          {busy ? "Es tumbling …" : `DREHEN · ${bet} €`}
        </button>

        <p className="relative z-10 text-center mt-3 text-[11px] font-mono text-[#C4B5FD]" data-testid="sb-balance">
          Guthaben: <span className="text-white font-bold">{balance.toLocaleString("de-DE")} €</span>
        </p>
      </div>
    </div>
  );
};

export default SweetBonanzaGame;
