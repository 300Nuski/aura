import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Users, Wifi } from "lucide-react";
import RocketShip from "@/components/RocketShip";
import { playCashoutChime } from "@/lib/sounds";
import { recordRound } from "@/lib/rounds";

const BOT_NAMES = ["NoOneCanBeatMe", "Hello34445", "waffleman", "Defundings", "Nochance", "xXShadowXx", "KrakenKid", "LunaSky", "PixelPirat", "GoldenGir"];
const AVATARS = ["from-[#8C3BFF] to-[#2E7CFF]", "from-[#00E575] to-[#00D2D3]", "from-[#FF9F1C] to-[#FF4757]", "from-[#2E7CFF] to-[#00D2D3]", "from-[#FF4757] to-[#8C3BFF]", "from-[#FFD32A] to-[#FF9F1C]"];
const GROWTH = 0.00013;
const WAIT_MS = 5000;

const W = 600;
const H = 340;
const PADL = 40;
const PADB = 28;
const PADT = 20;
const PADR = 16;

const genCrash = () => Math.min(100, Math.max(1, Math.floor((0.99 / (1 - Math.random())) * 100) / 100));

const genBots = () =>
  Array.from({ length: 7 + Math.floor(Math.random() * 3) }, (_, i) => ({
    id: `bot-${i}-${Date.now()}`,
    name: BOT_NAMES[i % BOT_NAMES.length],
    bet: 50 + Math.floor(Math.random() * 2950),
    target: +(1.05 + Math.random() * 6).toFixed(2),
    cashed: false,
    lost: false,
  }));

const pillCls = (m) =>
  m < 2
    ? "bg-[#FF4757]/15 text-[#FF6B7A] border-[#FF4757]/30"
    : m < 10
    ? "bg-[#2E7CFF]/15 text-[#7cadff] border-[#2E7CFF]/30"
    : "bg-[#8C3BFF]/20 text-[#c39aff] border-[#8C3BFF]/40";

const CrashGame = ({ balance, setBalance }) => {
  const [phase, setPhase] = useState("waiting");
  const [countdown, setCountdown] = useState(WAIT_MS / 1000);
  const [mult, setMult] = useState(1);
  const [crashPoint, setCrashPoint] = useState(null);
  const [history, setHistory] = useState(() => Array.from({ length: 7 }, genCrash));
  const [points, setPoints] = useState([]);
  const [players, setPlayers] = useState([]);
  const [myBet, setMyBet] = useState(null);
  const [betAmount, setBetAmount] = useState(100);
  const [autoCash, setAutoCash] = useState(2);

  const myBetRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);
  const balanceRef = useRef(balance);
  balanceRef.current = balance;

  const stars = useMemo(
    () =>
      Array.from({ length: 54 }, (_, i) => ({
        x: +(PADL + Math.random() * (W - PADL - PADR)).toFixed(1),
        y: +(PADT + Math.random() * (H - PADT - PADB)).toFixed(1),
        r: +(Math.random() * 1.1 + 0.3).toFixed(2),
        o: +(Math.random() * 0.45 + 0.12).toFixed(2),
        d: +((i % 12) * 0.28).toFixed(2),
      })),
    []
  );

  const cashOut = useCallback(
    (m) => {
      const mb = myBetRef.current;
      if (!mb || !mb.active) return;
      const win = Math.floor(mb.amount * m);
      myBetRef.current = null;
      setMyBet({ ...mb, active: false, cashedAt: m, win });
      setBalance((b) => b + win);
      playCashoutChime();
      recordRound({ game: "Crash", bet: mb.amount, mult: m, payout: win });
      toast.success(`Ausgestiegen bei ${m.toFixed(2)}x · +${win.toLocaleString("de-DE")} €`);
    },
    [setBalance]
  );

  useEffect(() => {
    let cancelled = false;

    const runWaiting = () => {
      setPhase("waiting");
      setMult(1);
      setCrashPoint(null);
      setPoints([]);
      setMyBet((prev) => (prev && !prev.active ? null : prev));
      setPlayers(genBots());
      const end = Date.now() + WAIT_MS;
      timerRef.current = setInterval(() => {
        if (cancelled) return;
        const remain = (end - Date.now()) / 1000;
        if (remain <= 0) {
          clearInterval(timerRef.current);
          runRound();
        } else {
          setCountdown(remain);
        }
      }, 100);
    };

    const runRound = () => {
      const crash = genCrash();
      const start = performance.now();
      setPhase("running");
      const tick = () => {
        if (cancelled) return;
        const elapsed = performance.now() - start;
        const m = Math.max(1, Math.floor(Math.exp(GROWTH * elapsed) * 100) / 100);
        setMult(m);
        setPoints((p) => [...p.slice(-360), { t: elapsed, m }]);
        setPlayers((ps) => ps.map((pl) => (!pl.cashed && !pl.lost && pl.target <= m ? { ...pl, cashed: true } : pl)));
        const mb = myBetRef.current;
        if (mb && mb.active && mb.auto && m >= mb.auto) cashOut(m);
        if (m >= crash) {
          endRound(crash);
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const endRound = (crash) => {
      setPhase("crashed");
      setCrashPoint(crash);
      setHistory((h) => [crash, ...h].slice(0, 12));
      setPlayers((ps) => ps.map((pl) => (!pl.cashed ? { ...pl, lost: true } : pl)));
      const mb = myBetRef.current;
      if (mb && mb.active) {
        myBetRef.current = null;
        setMyBet({ ...mb, active: false, lost: true });
        recordRound({ game: "Crash", bet: mb.amount, mult: 0, payout: 0 });
        toast.error(`Gecrashed bei ${crash.toFixed(2)}x — Einsatz verloren.`);
      }
      timeoutRef.current = setTimeout(() => {
        if (!cancelled) runWaiting();
      }, 2600);
    };

    runWaiting();
    return () => {
      cancelled = true;
      clearInterval(timerRef.current);
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [cashOut]);

  const placeBet = () => {
    if (phase !== "waiting" || myBet?.active) return;
    const amount = Math.floor(Math.min(Math.max(1, betAmount), balanceRef.current));
    if (amount < 1) {
      toast.error("Nicht genügend Guthaben.");
      return;
    }
    setBalance((b) => b - amount);
    const mb = { amount, auto: autoCash > 1 ? autoCash : null, active: true };
    myBetRef.current = mb;
    setMyBet(mb);
    toast.success(`Wette platziert: ${amount.toLocaleString("de-DE")} €`);
  };

  const last = points[points.length - 1];
  const maxT = Math.max(10000, last ? last.t * 1.12 : 10000);
  const maxM = Math.max(3, mult * 1.18);
  const gx = (t) => PADL + (t / maxT) * (W - PADL - PADR);
  const gy = (m) => H - PADB - (Math.log(Math.max(1, m)) / Math.log(maxM)) * (H - PADB - PADT);

  const sampled = points.filter((_, i) => i % 4 === 0);
  const smokePuffs = sampled.map((p, j) => {
    const age = sampled.length > 1 ? 1 - j / (sampled.length - 1) : 0;
    return { ...p, r: 3 + age * 9, o: 0.2 * (1 - age * 0.8) };
  });

  const curveColor = phase === "crashed" ? "#FF4757" : "#00E575";
  const linePath =
    points.length > 1
      ? points.map((p, i) => `${i === 0 ? "M" : "L"}${gx(p.t).toFixed(1)},${gy(p.m).toFixed(1)}`).join(" ")
      : "";
  const areaPath = linePath && last ? `${linePath} L${gx(last.t).toFixed(1)},${(H - PADB).toFixed(1)} L${PADL},${H - PADB} Z` : "";

  let rocketRot = 0;
  if (points.length > 2) {
    const a = points[Math.max(0, points.length - 6)];
    const b = last;
    rocketRot = (Math.atan2(gy(b.m) - gy(a.m), gx(b.t) - gx(a.t)) * 180) / Math.PI;
  }

  const yTicks = [0, 1, 2, 3, 4].map((i) => Math.exp((Math.log(maxM) * i) / 4));
  const xTicks = [2, 4, 6, 8, 10];

  const totalWager = players.reduce((s, p) => s + p.bet, 0) + (myBet?.active ? myBet.amount : 0);
  const potential = myBet?.active ? Math.floor(myBet.amount * mult) : 0;

  let btnLabel;
  let btnDisabled = false;
  if (phase === "waiting") {
    btnLabel = myBet?.active ? "Wette platziert — Runde startet …" : "Wette platzieren (nächste Runde)";
    btnDisabled = !!myBet?.active;
  } else if (phase === "running") {
    if (myBet?.active) {
      btnLabel = `Aussteigen @ ${mult.toFixed(2)}x · +${potential.toLocaleString("de-DE")} €`;
    } else {
      btnLabel = "Runde läuft — warte auf die nächste";
      btnDisabled = true;
    }
  } else {
    btnLabel = `Gecrashed @ ${crashPoint?.toFixed(2)}x`;
    btnDisabled = true;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" data-testid="crash-game">
      <div className="lg:col-span-4 flex flex-col gap-5">
        <div className="rounded-2xl bg-night-card border border-night-border p-5">
          <div className="flex gap-1.5 mb-5">
            <span className="rounded-full bg-night-elevated px-4 py-1.5 text-xs font-bold">Manuell</span>
            <button
              onClick={() => toast.info("Auto-Modus folgt in Kürze.")}
              className="rounded-full px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-white transition-colors duration-300"
              data-testid="crash-auto-tab"
            >
              Auto
            </button>
          </div>

          <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 block mb-2">Einsatz</label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              min={1}
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              disabled={phase !== "waiting" || myBet?.active}
              className="flex-1 min-w-0 rounded-xl bg-night-sidebar border border-night-border px-4 py-3 font-mono font-bold text-sm focus:outline-none focus:border-mint/60 disabled:opacity-50"
              data-testid="crash-bet-input"
            />
            {[
              ["1/2", () => setBetAmount((v) => Math.max(1, Math.floor(v / 2)))],
              ["2×", () => setBetAmount((v) => v * 2)],
              ["Max", () => setBetAmount(balanceRef.current)],
            ].map(([label, fn]) => (
              <button
                key={label}
                onClick={fn}
                disabled={phase !== "waiting" || myBet?.active}
                className="rounded-lg bg-night-elevated border border-night-border px-3 py-3 text-xs font-mono font-bold text-slate-300 hover:border-mint/50 disabled:opacity-40 transition-colors duration-300"
                data-testid={`crash-bet-quick-${label.replace(/[^a-z0-9]/gi, "").toLowerCase()}`}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 block mb-2 mt-4">Auto-Cashout</label>
          <div className="flex items-center gap-2 mb-5">
            <input
              type="number"
              min={1.01}
              step={0.1}
              value={autoCash}
              onChange={(e) => setAutoCash(Number(e.target.value))}
              disabled={myBet?.active}
              className="flex-1 min-w-0 rounded-xl bg-night-sidebar border border-night-border px-4 py-3 font-mono font-bold text-sm focus:outline-none focus:border-mint/60 disabled:opacity-50"
              data-testid="crash-auto-cashout-input"
            />
            {[2, 10].map((v) => (
              <button
                key={v}
                onClick={() => setAutoCash(v)}
                disabled={myBet?.active}
                className="rounded-lg bg-night-elevated border border-night-border px-3 py-3 text-xs font-mono font-bold text-slate-300 hover:border-mint/50 disabled:opacity-40 transition-colors duration-300"
                data-testid={`crash-auto-quick-${v}`}
              >
                {v.toFixed(2)}x
              </button>
            ))}
          </div>

          <button
            onClick={phase === "running" && myBet?.active ? () => cashOut(mult) : placeBet}
            disabled={btnDisabled}
            className={`w-full rounded-full py-3.5 text-sm font-extrabold transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
              phase === "running" && myBet?.active
                ? "bg-amber-400 text-black animate-deposit-glow"
                : "bg-mint text-black hover:bg-mint-hover shadow-[0_0_22px_rgba(0,229,117,0.35)]"
            }`}
            data-testid="crash-place-bet-btn"
          >
            {btnLabel}
          </button>
          {myBet?.active && (
            <p className="mt-3 text-center text-xs font-mono text-slate-400" data-testid="crash-my-bet-info">
              Einsatz {myBet.amount.toLocaleString("de-DE")} €{myBet.auto ? ` · Auto @ ${myBet.auto.toFixed(2)}x` : ""}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-night-card border border-night-border p-5 flex-1" data-testid="crash-players-list">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-2 text-sm font-bold">
              <Users className="w-4 h-4 text-mint" />
              {players.length + (myBet?.active ? 1 : 0)} Spieler
            </span>
            <span className="font-mono text-xs text-slate-500">{totalWager.toLocaleString("de-DE")} € Pot</span>
          </div>
          <div className="space-y-2.5 max-h-[260px] overflow-y-auto chat-scroll pr-1">
            {myBet?.active && (
              <div className="flex items-center justify-between rounded-lg bg-mint/10 border border-mint/30 px-3 py-2" data-testid="crash-my-row">
                <span className="flex items-center gap-2 text-xs font-bold text-mint">
                  <span className="w-6 h-6 rounded-full bg-mint text-black flex items-center justify-center text-[10px] font-extrabold">DU</span>
                  Du
                </span>
                <span className="font-mono text-xs font-bold text-mint">läuft …</span>
                <span className="font-mono text-xs text-slate-300">{myBet.amount.toLocaleString("de-DE")} €</span>
              </div>
            )}
            <AnimatePresence initial={false}>
              {players.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                    p.lost ? "opacity-40" : p.cashed ? "bg-night-elevated" : "bg-night-sidebar/60"
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-300 truncate">
                    <span className={`shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${AVATARS[i % AVATARS.length]} flex items-center justify-center text-[10px] font-bold`}>
                      {p.name.slice(0, 1)}
                    </span>
                    <span className="truncate max-w-[110px]">{p.name}</span>
                  </span>
                  <span className={`font-mono text-xs font-bold ${p.cashed ? "text-mint" : p.lost ? "text-[#FF6B7A]" : "text-slate-500"}`}>
                    {p.cashed ? `${p.target.toFixed(2)}x` : p.lost ? "crash" : "…"}
                  </span>
                  <span className="font-mono text-xs text-slate-400">{p.bet.toLocaleString("de-DE")} €</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="rounded-2xl bg-night-card border border-night-border p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex gap-1.5 flex-wrap" data-testid="crash-history-pills">
              {history.map((h, i) => (
                <span key={`${h}-${i}`} className={`rounded-md border px-2 py-1 text-[11px] font-mono font-bold ${pillCls(h)}`}>
                  {h.toFixed(2)}x
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              <Wifi className="w-3.5 h-3.5 text-mint" />
              Network <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse-dot" />
            </span>
          </div>

          <div className="relative">
            <div className="absolute left-12 top-2 z-10 pointer-events-none">
              <p
                className={`font-display font-black text-5xl sm:text-6xl tracking-tight tabular-nums ${
                  phase === "crashed" ? "text-[#FF4757]" : phase === "waiting" ? "text-slate-500" : "text-white"
                }`}
                data-testid="crash-multiplier-display"
              >
                {phase === "waiting" ? `${countdown.toFixed(1)}s` : `${(phase === "crashed" ? crashPoint : mult).toFixed(2)}x`}
              </p>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-slate-500 mt-1">
                {phase === "waiting" ? "Nächste Runde startet" : phase === "running" ? "Aktueller Multiplikator" : "Runde beendet"}
              </p>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" data-testid="crash-graph">
              <defs>
                <filter id="smoke-blur" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="4.5" />
                </filter>
                <filter id="line-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="crash-area-run" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E575" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#00E575" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="crash-area-crash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4757" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#FF4757" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="crash-sky" cx="0.3" cy="0.15" r="1">
                  <stop offset="0%" stopColor="#0e1b33" />
                  <stop offset="100%" stopColor="#080b16" />
                </radialGradient>
              </defs>

              {/* Weltraum-Hintergrund + Sternenfeld */}
              <rect x={PADL} y={PADT} width={W - PADL - PADR} height={H - PADT - PADB} rx="10" fill="url(#crash-sky)" />
              <g>
                {stars.map((s, i) => (
                  <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#93c5fd" opacity={s.o} className="crash-star" style={{ animationDelay: `${s.d}s` }} />
                ))}
              </g>

              {yTicks.map((m, i) => (
                <g key={i}>
                  <line x1={PADL} y1={gy(m)} x2={W - PADR} y2={gy(m)} stroke="#1B202E" strokeWidth="1" strokeDasharray="3 6" />
                  <text x={PADL - 6} y={gy(m) + 3} textAnchor="end" fontSize="9" fill="#475569" fontFamily="JetBrains Mono, monospace">
                    {i === 0 ? "1x" : `${m.toFixed(1)}x`}
                  </text>
                </g>
              ))}
              {xTicks.map((s) => (
                <text key={s} x={gx(s * 1000)} y={H - 8} textAnchor="middle" fontSize="9" fill="#475569" fontFamily="JetBrains Mono, monospace">
                  {s}s
                </text>
              ))}

              {/* Flächenfüllung unter der Flugkurve */}
              {areaPath && <path d={areaPath} fill={`url(#crash-area-${phase === "crashed" ? "crash" : "run"})`} />}

              {/* Rauch-Trail */}
              {smokePuffs.length > 1 && (
                <g filter="url(#smoke-blur)">
                  {smokePuffs.map((p, j) => (
                    <circle
                      key={j}
                      cx={gx(p.t)}
                      cy={gy(p.m)}
                      r={p.r}
                      fill={phase === "crashed" ? "#FCA5A5" : "#CBD5E1"}
                      opacity={p.o}
                    />
                  ))}
                </g>
              )}

              {/* Leuchtende Flugkurve */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke={curveColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#line-glow)"
                  data-testid="crash-curve-line"
                />
              )}

              {/* Leuchtpunkt an der Spitze */}
              {last && phase !== "waiting" && (
                <circle cx={gx(last.t)} cy={gy(last.m)} r="4" fill="#FFFFFF" filter="url(#line-glow)" />
              )}
            </svg>

            {points.length > 1 && phase !== "waiting" && (
              <div
                className="absolute w-[96px] h-[68px] -ml-[48px] -mt-[34px] pointer-events-none"
                style={{ left: `${(gx(last.t) / W) * 100}%`, top: `${(gy(last.m) / H) * 100}%` }}
                data-testid="crash-rocket"
              >
                <motion.div
                  className={phase === "running" ? "crash-rocket-bob w-full h-full" : "w-full h-full"}
                  animate={phase === "crashed" ? { y: 110, rotate: rocketRot + 70, opacity: 0 } : { opacity: 1 }}
                  transition={phase === "crashed" ? { duration: 1.1, ease: "easeIn" } : { duration: 0.2 }}
                >
                  <RocketShip
                    thrusting={phase === "running"}
                    className="w-full h-full drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]"
                    style={{ transform: `rotate(${rocketRot}deg)` }}
                  />
                </motion.div>
              </div>
            )}

            {phase === "crashed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span className="rounded-full bg-[#FF4757]/15 border border-[#FF4757]/50 text-[#FF6B7A] font-display font-extrabold text-lg px-6 py-2 backdrop-blur-sm">
                  CRASHED @ {crashPoint?.toFixed(2)}x
                </span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-night-card border border-night-border px-5 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">Dein Guthaben</span>
          <span className="font-mono font-bold text-mint tabular-nums" data-testid="crash-balance">{balance.toLocaleString("de-DE")} €</span>
        </div>
      </div>
    </div>
  );
};

export default CrashGame;
