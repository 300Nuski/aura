import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate, useInView } from "framer-motion";
import { ArrowRight, Play, ShieldCheck, Zap, Percent } from "lucide-react";

const lineReveal = {
  initial: { y: "110%" },
  animate: (i) => ({
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 + i * 0.13 },
  }),
};

const DecorativeWheel = () => (
  <svg viewBox="0 0 300 300" className="w-full h-full animate-spin-slower" data-testid="hero-deco-wheel">
    <circle cx="150" cy="150" r="146" fill="none" stroke="#C9A86A" strokeWidth="1.5" />
    <circle cx="150" cy="150" r="120" fill="none" stroke="#C9A86A" strokeWidth="1" strokeDasharray="4 10" />
    {Array.from({ length: 37 }).map((_, i) => {
      const a = (i * 360) / 37;
      const rad = ((a - 90) * Math.PI) / 180;
      const x1 = 150 + 120 * Math.cos(rad);
      const y1 = 150 + 120 * Math.sin(rad);
      const x2 = 150 + 142 * Math.cos(rad);
      const y2 = 150 + 142 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i === 0 ? "#A32A29" : "#C9A86A"} strokeWidth={i === 0 ? 2 : 1} />;
    })}
    <circle cx="150" cy="150" r="86" fill="#FDFBF7" stroke="#C9A86A" strokeWidth="1" />
    <circle cx="150" cy="150" r="70" fill="none" stroke="#C9A86A" strokeWidth="0.75" strokeDasharray="2 6" />
    <text x="150" y="143" textAnchor="middle" className="font-serif" fontSize="26" fill="#171614" letterSpacing="4">AURA</text>
    <text x="150" y="168" textAnchor="middle" fontSize="11" fill="#C9A86A" letterSpacing="6" fontFamily="JetBrains Mono, monospace">ROYALE</text>
  </svg>
);

const FloatingCard = ({ rank, suit, red, className, style }) => (
  <motion.div style={style} className={`absolute w-[86px] h-[124px] sm:w-[104px] sm:h-[148px] bg-white rounded-xl border border-[rgba(201,168,106,0.4)] shadow-[0_24px_50px_-20px_rgba(23,22,20,0.3)] p-3 flex flex-col justify-between ${className}`}>
    <span className={`font-serif text-2xl leading-none ${red ? "text-aura-crimson" : "text-aura-ink"}`}>{rank}</span>
    <span className={`self-center text-4xl ${red ? "text-aura-crimson" : "text-aura-ink"}`}>{suit}</span>
    <span className={`font-serif text-2xl leading-none self-end rotate-180 ${red ? "text-aura-crimson" : "text-aura-ink"}`}>{rank}</span>
  </motion.div>
);

const Hero = ({ onOpenBonus, onNavigate }) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });

  const layerWheelX = useTransform(sx, (v) => v * 26);
  const layerWheelY = useTransform(sy, (v) => v * 22);
  const layerCard1X = useTransform(sx, (v) => v * -42);
  const layerCard1Y = useTransform(sy, (v) => v * -34);
  const layerCard2X = useTransform(sx, (v) => v * 54);
  const layerCard2Y = useTransform(sy, (v) => v * 40);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const [remain, setRemain] = useState(24 * 3600 * 1000);
  useEffect(() => {
    const target = Date.now() + 24 * 3600 * 1000;
    const i = setInterval(() => setRemain(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(i);
  }, []);
  const hh = String(Math.floor(remain / 3600000)).padStart(2, "0");
  const mm = String(Math.floor((remain % 3600000) / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remain % 60000) / 1000)).padStart(2, "0");

  const counterRef = useRef(null);
  const inView = useInView(counterRef, { once: true, margin: "-60px" });
  const [bonusVal, setBonusVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, 1500, { duration: 2.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setBonusVal(Math.round(v)) });
    return () => c.stop();
  }, [inView]);

  const [players, setPlayers] = useState(3482);
  useEffect(() => {
    const i = setInterval(() => setPlayers((p) => Math.max(2900, p + Math.floor(Math.random() * 41) - 20)), 2600);
    return () => clearInterval(i);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-[72px]"
      onMouseMove={onMove}
      data-testid="hero-section"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(201,168,106,0.14),transparent_65%)]" />
        <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(163,42,41,0.05),transparent_65%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-16 lg:py-0">
        <div className="lg:col-span-7 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(201,168,106,0.45)] bg-aura-goldtint px-4 py-1.5 mb-8"
            data-testid="hero-badge"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-aura-gold animate-pulse-dot" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-aura-goldhover font-medium">
              Exklusiver Willkommensbonus · Saison 2026
            </span>
          </motion.div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[4.6rem] font-medium tracking-tight leading-[1.04] text-aura-ink" data-testid="hero-headline">
            <span className="line-mask">
              <motion.span className="block" custom={0} variants={lineReveal} initial="initial" animate="animate">
                Das Privileg der
              </motion.span>
            </span>
            <span className="line-mask">
              <motion.span className="block italic text-aura-goldhover" custom={1} variants={lineReveal} initial="initial" animate="animate">
                vollkommenen
              </motion.span>
            </span>
            <span className="line-mask">
              <motion.span className="block" custom={2} variants={lineReveal} initial="initial" animate="animate">
                Eleganz.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            className="mt-7 max-w-xl text-base sm:text-lg font-light text-aura-secondary leading-relaxed"
            data-testid="hero-subline"
          >
            Erleben Sie Roulette, Blackjack und Poker in einer Dimension schlichter Ästhetik.
            Verdoppeln Sie Ihr Eröffnungsspiel mit <span className="font-semibold text-aura-ink">100% bis zu 1.500&nbsp;€</span> plus
            150 Freispiele im Privé Salon.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={onOpenBonus}
              className="group inline-flex items-center gap-2.5 rounded-full bg-aura-noir text-aura-ivory px-7 py-3.5 text-sm font-semibold hover:bg-aura-goldhover transition-colors duration-300"
              data-testid="hero-claim-bonus-btn"
            >
              Jetzt Bonus sichern
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() => onNavigate("arena")}
              className="group inline-flex items-center gap-2.5 rounded-full border border-aura-ink/20 px-7 py-3.5 text-sm font-semibold hover:border-aura-gold hover:text-aura-goldhover transition-colors duration-300"
              data-testid="hero-play-demo-btn"
            >
              <Play className="w-4 h-4" />
              Kostenlos ausprobieren
            </button>
          </motion.div>

          <motion.div
            ref={counterRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.25 }}
            className="mt-10 max-w-xl rounded-2xl border border-[rgba(201,168,106,0.35)] bg-[rgba(255,255,255,0.72)] backdrop-blur-xl p-5 sm:p-6 shadow-[0_30px_60px_-30px_rgba(23,22,20,0.25)]"
            data-testid="hero-bonus-panel"
          >
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-aura-muted mb-1.5">100% Match + 150 Freispiele</p>
                <p className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-aura-ink" data-testid="hero-bonus-value-display">
                  {bonusVal.toLocaleString("de-DE")}&nbsp;€
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-aura-muted mb-1.5">Angebot gültig für</p>
                <div className="flex items-center gap-1.5 font-mono" data-testid="hero-bonus-countdown-timer">
                  {[hh, mm, ss].map((v, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <span className="rounded-lg bg-aura-noir text-aura-gold text-lg sm:text-xl font-semibold px-2.5 py-1.5 tabular-nums">{v}</span>
                      {i < 2 && <span className="text-aura-gold font-semibold">:</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="gold-hairline my-4" />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-aura-secondary"><ShieldCheck className="w-3.5 h-3.5 text-aura-gold" /> MGA zertifiziert</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-aura-secondary"><Zap className="w-3.5 h-3.5 text-aura-gold" /> Blitz-Auszahlung &lt; 15 Min</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-aura-secondary"><Percent className="w-3.5 h-3.5 text-aura-gold" /> 98,7% RTP Quote</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-aura-secondary ml-auto" data-testid="hero-players-online">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse-dot" />
                {players.toLocaleString("de-DE")} Spieler online
              </span>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-5 relative h-[420px] sm:h-[500px] hidden md:block" data-testid="hero-visual">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <motion.div style={{ x: layerWheelX, y: layerWheelY }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[360px] sm:h-[360px]">
              <DecorativeWheel />
            </motion.div>
            <FloatingCard rank="A" suit="♠" red={false} className="left-2 top-8 -rotate-12" style={{ x: layerCard1X, y: layerCard1Y }} />
            <FloatingCard rank="K" suit="♥" red className="right-0 bottom-10 rotate-[14deg]" style={{ x: layerCard2X, y: layerCard2Y }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
