import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CHAPTERS = [
  {
    number: "01",
    title: "Roulette Impérial",
    tag: "Der Klassiker am Rad",
    description:
      "Das pure französische Kesselspiel mit Zero-La-Partage-Regel. Eleganter Balllauf, 37 handgefertigte Segmente und Live-Kamerawechsel in 4K.",
    stat: "98,65% RTP",
    action: "Am Kessel Platz nehmen",
    image:
      "https://images.unsplash.com/photo-1773335638484-297f95ef33a9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBjYXNpbm8lMjByb3VsZXR0ZXxlbnwwfHx8fDE3ODgwODQ1NDJ8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    number: "02",
    title: "Blackjack Privé",
    tag: "Die Präzision von 21",
    description:
      "Spielen Sie Single-Deck oder 6-Deck nach klassischen Casino-Regeln. Split, Double Down und Perfect Pairs mit direkter Auszahlung.",
    stat: "99,42% RTP",
    action: "Karten austeilen",
    image:
      "https://images.unsplash.com/photo-1636583133884-fbefc7ac3fb3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHxwbGF5aW5nJTIwY2FyZHMlMjBwb2tlcnxlbnwwfHx8fDE3ODgwODQ1NDJ8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    number: "03",
    title: "Poker Salon No-Limit",
    tag: "Meisterschaft der Psychologie",
    description:
      "Texas Hold'em und Omaha an exklusiven Tischen. Keine Bots, verifizierte High-Roller-Räume und wöchentliche Master-Turniere.",
    stat: "10.000 € Daily Pots",
    action: "Salon beitreten",
    image:
      "https://images.unsplash.com/photo-1596451190630-186aff535bf2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHw0fHxwbGF5aW5nJTIwY2FyZHMlMjBwb2tlcnxlbnwwfHx8fDE3ODgwODQ1NDJ8MA&ixlib=rb-4.1.0&q=85",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const Manifesto = () => (
  <section id="spiele" className="py-20 sm:py-28 lg:py-32" data-testid="manifesto-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-16 sm:mb-24 max-w-2xl"
      >
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-aura-gold font-medium mb-4">Das Manifest</p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-[2.75rem] font-medium tracking-tight leading-snug">
          Drei Disziplinen. <span className="italic text-aura-goldhover">Eine Haltung.</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-aura-secondary leading-relaxed">
          Wir reduzieren das Casino auf seine Essenz: präzise Mathematik, ehrliche Quoten und
          handwerkliche Perfektion an jedem Tisch.
        </p>
      </motion.div>

      <div className="flex flex-col gap-20 sm:gap-28">
        {CHAPTERS.map((c, idx) => (
          <motion.article
            key={c.number}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center"
            data-testid={`manifesto-chapter-${c.number}`}
          >
            <div className={`md:col-span-1 flex md:flex-col items-start gap-2 ${idx % 2 === 1 ? "md:order-3" : ""}`}>
              <span className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-aura-gold/50 leading-none">{c.number}</span>
            </div>

            <div className={`md:col-span-6 lg:col-span-5 ${idx % 2 === 1 ? "md:order-2" : ""}`}>
              <div className="group relative overflow-hidden rounded-2xl border border-[rgba(201,168,106,0.3)] aspect-[4/3] shadow-[0_36px_70px_-36px_rgba(23,22,20,0.35)]">
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(253,251,247,0.25),transparent_55%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-4 left-4 rounded-full bg-[rgba(253,251,247,0.88)] backdrop-blur-md border border-[rgba(201,168,106,0.35)] px-4 py-1.5">
                  <span className="font-mono text-xs font-semibold text-aura-ink tracking-wide">{c.stat}</span>
                </div>
              </div>
            </div>

            <div className={`md:col-span-5 lg:col-span-6 ${idx % 2 === 1 ? "md:order-1 md:text-right md:justify-self-end" : ""} max-w-xl`}>
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-aura-gold font-medium mb-3">{c.tag}</p>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-snug mb-4">{c.title}</h3>
              <p className="text-sm sm:text-base text-aura-secondary leading-relaxed mb-6">{c.description}</p>
              <a
                href="#arena"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("arena") && window.__lenis?.scrollTo(document.getElementById("arena"), { offset: -72, duration: 1.4 });
                }}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-aura-ink border-b border-aura-gold pb-1 hover:text-aura-goldhover transition-colors duration-300"
                data-testid={`manifesto-action-${c.number}`}
              >
                {c.action}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Manifesto;
