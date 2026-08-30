import { motion } from "framer-motion";
import RouletteGame from "@/components/RouletteGame";
import BlackjackGame from "@/components/BlackjackGame";

const Playground = () => (
  <section id="arena" className="py-20 sm:py-28 lg:py-32 bg-aura-alabaster/50 border-y border-[rgba(201,168,106,0.2)]" data-testid="playground-section">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14 sm:mb-20 text-center max-w-2xl mx-auto"
      >
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-aura-gold font-medium mb-4">Die Arena</p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-[2.75rem] font-medium tracking-tight leading-snug">
          Spielen Sie. <span className="italic text-aura-goldhover">Ohne Risiko.</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-aura-secondary leading-relaxed">
          Zwei voll spielbare Demos mit 1.000&nbsp;€ Spielguthaben — echte Regeln, echte Mathematik,
          null Echtgeld. Lernen Sie unsere Mechanik kennen, bevor Sie Platz nehmen.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <RouletteGame />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <BlackjackGame />
        </motion.div>
      </div>
    </div>
  </section>
);

export default Playground;
