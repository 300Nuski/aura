import { motion } from "framer-motion";
import { Crown, Zap, Sparkles, ShieldCheck } from "lucide-react";

const PERKS = [
  {
    title: "Persönlicher Concierge",
    desc: "Ihr persönlicher VIP-Manager erreichbar rund um die Uhr per Direktkontakt.",
    icon: Crown,
  },
  {
    title: "Prioritäre Express-Auszahlung",
    desc: "Auszahlungen ohne Verzögerung — direkt auf Ihr Bankkonto oder Krypto-Wallet.",
    icon: Zap,
  },
  {
    title: "Monaco & Vegas Einladungen",
    desc: "Exklusive Event-Tickets zu renommierten Turnieren und Gala-Abenden weltweit.",
    icon: Sparkles,
  },
  {
    title: "Individuelle Tischlimits",
    desc: "Spielen Sie ohne starre Obergrenzen in unseren privaten Salon-Suiten.",
    icon: ShieldCheck,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const VipBento = () => (
  <section id="vip" className="py-20 sm:py-28 lg:py-32" data-testid="vip-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14 sm:mb-20 max-w-2xl"
      >
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-aura-gold font-medium mb-4">Privé Club</p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-[2.75rem] font-medium tracking-tight leading-snug">
          Privilegien, die man <span className="italic text-aura-goldhover">nicht kaufen</span> kann.
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
      >
        <motion.div
          variants={item}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="md:row-span-2 relative overflow-hidden rounded-2xl border border-[rgba(201,168,106,0.3)] min-h-[320px] md:min-h-0 shadow-[0_36px_70px_-36px_rgba(23,22,20,0.35)]"
          data-testid="vip-image-tile"
        >
          <img
            src="https://images.unsplash.com/photo-1580657274234-7339717f4541?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwxfHxjaGFtcGFnbmUlMjBnbGFzcyUyMGx1eHVyeXxlbnwwfHx8fDE3ODgwODQ1NTB8MA&ixlib=rb-4.1.0&q=85"
            alt="Champagner im Privé Salon"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aura-noir/70 via-aura-noir/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-aura-gold mb-2">Salon Privé</p>
            <p className="font-serif text-xl sm:text-2xl text-aura-ivory leading-snug">
              Champagner-Empfang jeden Freitag ab 20 Uhr.
            </p>
          </div>
        </motion.div>

        {PERKS.map((p) => (
          <motion.div
            key={p.title}
            variants={item}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-2xl bg-white border border-[rgba(201,168,106,0.3)] p-6 sm:p-7 shadow-[0_24px_50px_-30px_rgba(23,22,20,0.25)] hover:border-aura-gold/60 hover:shadow-[0_30px_60px_-28px_rgba(201,168,106,0.45)] transition-[border-color,box-shadow] duration-500"
            data-testid={`vip-perk-${p.title.toLowerCase().replace(/[^a-z]/g, "-")}`}
          >
            <span className="w-11 h-11 rounded-full bg-aura-goldtint border border-[rgba(201,168,106,0.4)] flex items-center justify-center mb-5">
              <p.icon className="w-5 h-5 text-aura-goldhover" />
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-medium mb-2">{p.title}</h3>
            <p className="text-sm text-aura-secondary leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default VipBento;
