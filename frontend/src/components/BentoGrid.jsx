import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Flame, Disc, Trophy, Layers, Rocket, ArrowUpRight } from "lucide-react";

const BentoGrid = () => {
  const navigate = useNavigate();
  const [jackpot, setJackpot] = useState(148920);

  useEffect(() => {
    const i = setInterval(() => setJackpot((j) => j + Math.floor(Math.random() * 37) + 3), 2200);
    return () => clearInterval(i);
  }, []);

  const cards = [
    {
      id: "pvp",
      span: "col-span-12 md:col-span-6 lg:col-span-7",
      title: "PVP BATTLE ARENA",
      subtitle: "1v1 & 2v2 Live-Duelle um Echtgeld-Pots",
      gradient: "from-[#2E7CFF]/30 via-[#1b2a52]/40 to-night-card",
      border: "hover:border-[#2E7CFF]/60",
      badge: "24 AKTIVE DUELLE",
      badgeCls: "bg-[#2E7CFF]/20 text-[#7cadff] border-[#2E7CFF]/30",
      cta: "Jetzt duellieren",
      icon: Flame,
      iconCls: "text-[#2E7CFF]",
      img: "https://images.unsplash.com/photo-1598550487031-0898b4852123?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwyfHxlc3BvcnRzJTIwYXJlbmF8ZW58MHx8fGJsYWNrfDE3ODg1MjgwNzN8MA&ixlib=rb-4.1.0&q=85",
      onClick: () => toast.info("PvP-Duelle — Demo folgt in Kürze."),
      testid: "bento-card-pvp",
    },
    {
      id: "roulette",
      span: "col-span-12 md:col-span-6 lg:col-span-5",
      title: "ROYALE ROULETTE",
      subtitle: "Klassisches Kesselspiel · bis 36x",
      gradient: "from-[#E84118]/30 via-[#3d1410]/40 to-night-card",
      border: "hover:border-[#E84118]/60",
      badge: "SPIELBAR",
      badgeCls: "bg-mint/15 text-mint border-mint/30",
      cta: "Tisch öffnen",
      icon: Disc,
      iconCls: "text-[#E84118]",
      img: "https://images.unsplash.com/photo-1611786431136-bdd6744ed72d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwxfHxyb3VsZXR0ZSUyMHRhYmxlfGVufDB8fHxibGFja3wxNzg4NTI4MDMxfDA&ixlib=rb-4.1.0&q=85",
      onClick: () => navigate("/roulette"),
      testid: "bento-card-roulette",
    },
    {
      id: "jackpot",
      span: "col-span-12 md:col-span-4",
      title: "MEGA JACKPOT",
      subtitle: `Pool: ${jackpot.toLocaleString("de-DE")} €`,
      gradient: "from-[#8C3BFF]/30 via-[#2a1547]/40 to-night-card",
      border: "hover:border-[#8C3BFF]/60",
      badge: "STEIGT LIVE",
      badgeCls: "bg-[#8C3BFF]/20 text-[#c39aff] border-[#8C3BFF]/30",
      cta: "Ticket kaufen",
      icon: Trophy,
      iconCls: "text-[#8C3BFF]",
      img: "https://images.unsplash.com/photo-1567771097667-472adfa6945a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHxnb2xkJTIwY29pbnN8ZW58MHx8fGJsYWNrfDE3ODg1MjgwNDJ8MA&ixlib=rb-4.1.0&q=85",
      onClick: () => toast.info("Jackpot-Tickets — Demo folgt in Kürze."),
      testid: "bento-card-jackpot",
    },
    {
      id: "blackjack",
      span: "col-span-12 md:col-span-4",
      title: "BLACKJACK 21 VIP",
      subtitle: "Dealer schlagen · Split & Double",
      gradient: "from-[#00E575]/25 via-[#0d2818]/50 to-night-card",
      border: "hover:border-mint/60",
      badge: "SPIELBAR",
      badgeCls: "bg-mint/15 text-mint border-mint/30",
      cta: "Karten geben",
      icon: Layers,
      iconCls: "text-mint",
      img: "https://images.unsplash.com/photo-1597042962047-005b63a5eb25?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwxfHxwb2tlciUyMGNoaXBzfGVufDB8fHxibGFja3wxNzg4NTI4MDM2fDA&ixlib=rb-4.1.0&q=85",
      onClick: () => navigate("/blackjack"),
      testid: "bento-card-blackjack",
    },
    {
      id: "crash",
      span: "col-span-12 md:col-span-4",
      title: "ROCKET CRASH",
      subtitle: "Multiplikator bis 1000x",
      gradient: "from-[#FF9F1C]/30 via-[#40260a]/40 to-night-card",
      border: "hover:border-[#FF9F1C]/60",
      badge: "SPIELBAR · NEU",
      badgeCls: "bg-mint/15 text-mint border-mint/30",
      cta: "Rakete starten",
      icon: Rocket,
      iconCls: "text-[#FF9F1C]",
      img: "https://images.unsplash.com/photo-1519326844852-704caea5679e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwyfHxnYW1pbmclMjBkYXJrfGVufDB8fHxibGFja3wxNzg4NTI4MDc5fDA&ixlib=rb-4.1.0&q=85",
      onClick: () => navigate("/crash"),
      testid: "bento-card-crash",
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 mb-10" data-testid="bento-grid">
      {cards.map((c, i) => (
        <motion.button
          key={c.id}
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4 }}
          onClick={c.onClick}
          className={`group relative overflow-hidden rounded-2xl border border-night-border bg-gradient-to-br ${c.gradient} ${c.border} ${c.span} p-5 sm:p-6 text-left transition-colors duration-300 min-h-[170px] flex flex-col justify-between`}
          data-testid={c.testid}
        >
          {c.img && (
            <>
              <img
                src={c.img}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500 pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night-card via-night-card/75 to-night-card/40 pointer-events-none" />
            </>
          )}
          <c.icon className={`absolute -right-5 -bottom-6 w-32 h-32 opacity-[0.13] group-hover:opacity-25 group-hover:scale-110 transition-all duration-500 ${c.iconCls}`} strokeWidth={1.2} />
          <div className="relative z-10">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider ${c.badgeCls}`}>
              {c.badge}
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-display text-lg sm:text-xl font-extrabold tracking-wide">{c.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{c.subtitle}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-white group-hover:text-mint transition-colors duration-300">
              {c.cta}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default BentoGrid;
