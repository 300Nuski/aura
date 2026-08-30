import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Wie funktioniert der 100% Willkommensbonus?",
    a: "Ihre erste Einzahlung bis zu 1.500 € wird sofort verdoppelt. Zusätzlich erhalten Sie 150 Freispiele für unsere Roulette- und Slot-Klassiker. Die Durchspielbedingungen betragen faire 25x.",
  },
  {
    q: "Sind die Demo-Spiele auf dieser Seite kostenlos?",
    a: "Ja, absolut. Unsere integrierte Roulette- und Blackjack-Arena ist zu 100% kostenlos und dient dem risikofreien Kennenlernen unserer Spielmechaniken mit Spielguthaben.",
  },
  {
    q: "Welche Zahlungsmethoden werden unterstützt?",
    a: "Wir unterstützen Sofortüberweisung, Kreditkarten (Visa/Mastercard), Apple Pay, SEPA Instant sowie ausgewählte Krypto-Assets (BTC, ETH, USDT).",
  },
  {
    q: "Wie garantiert Aura Royale faires Spiel (RTP)?",
    a: "Alle unsere Spiele werden von unabhängigen Prüfinstituten (eCOGRA / iTech Labs) zertifiziert. Unsere Zufallsgeneratoren (RNG) arbeiten kryptografisch verifizierbar.",
  },
];

const FaqSection = () => (
  <section id="faq" className="py-20 sm:py-28 lg:py-32 bg-aura-alabaster/50 border-t border-[rgba(201,168,106,0.2)]" data-testid="faq-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-5"
      >
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-aura-gold font-medium mb-4">Leitfaden</p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-[2.75rem] font-medium tracking-tight leading-snug">
          Häufige <span className="italic text-aura-goldhover">Fragen.</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-aura-secondary leading-relaxed max-w-md">
          Transparenz ist Teil unseres Hauses. Alles, was Sie vor Ihrem ersten Spiel wissen sollten —
          präzise beantwortet.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7"
      >
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-[rgba(201,168,106,0.3)]"
              data-testid={`faq-accordion-item-${i}`}
            >
              <AccordionTrigger className="text-left font-serif text-lg sm:text-xl font-medium py-6 hover:text-aura-goldhover hover:no-underline transition-colors duration-300">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-aura-secondary leading-relaxed pb-6">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FaqSection;
