import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Diamond, ArrowRight } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }
    toast.success("Willkommen im Privé Club! Ihre Einladung ist unterwegs.");
    setEmail("");
  };

  return (
    <footer className="relative bg-aura-noir text-aura-ivory overflow-hidden" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-8 h-8 rounded-full border border-aura-gold flex items-center justify-center">
                <Diamond className="w-3.5 h-3.5 text-aura-gold" fill="currentColor" />
              </span>
              <span className="font-serif text-xl tracking-[0.18em] font-semibold">
                AURA <span className="text-aura-gold">ROYALE</span>
              </span>
            </div>
            <p className="text-sm text-aura-ivory/60 leading-relaxed max-w-sm mb-8">
              Die Kunst des Spiels im reinsten Licht. Grand Casino &amp; Privé Club —
              lizenziert, geprüft und kompromisslos elegant.
            </p>
            <div className="flex items-center gap-4">
              <span className="w-11 h-11 rounded-full border-2 border-aura-crimson text-aura-crimson font-mono font-bold text-xs flex items-center justify-center" data-testid="footer-age-badge">
                18+
              </span>
              <p className="text-xs text-aura-ivory/50 max-w-[260px] leading-relaxed">
                Glücksspiel kann süchtig machen. Hilfe: BZgA-Telefonberatung 0800&nbsp;1&nbsp;37&nbsp;27&nbsp;00 (kostenlos).
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-aura-gold mb-5">Navigation</p>
            <ul className="space-y-3 text-sm text-aura-ivory/70">
              {[
                ["Die Spiele", "spiele"],
                ["Spiel-Arena", "arena"],
                ["Privé Club", "vip"],
                ["FAQ", "faq"],
              ].map(([label, id]) => (
                <li key={id}>
                  <button
                    onClick={() => {
                      const el = document.getElementById(id);
                      if (el) window.__lenis?.scrollTo(el, { offset: -72, duration: 1.4 });
                    }}
                    className="hover:text-aura-gold transition-colors duration-300"
                    data-testid={`footer-link-${id}`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-aura-gold mb-5">VIP-Einladung</p>
            <p className="text-sm text-aura-ivory/60 leading-relaxed mb-5">
              Erhalten Sie exklusive Turnier-Einladungen und Bonus-Previews vor allen anderen.
            </p>
            <form onSubmit={subscribe} className="flex gap-2" data-testid="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre@email.de"
                className="flex-1 min-w-0 rounded-full bg-white/10 border border-white/15 px-5 py-3 text-sm placeholder:text-aura-ivory/40 focus:outline-none focus:border-aura-gold transition-colors duration-300"
                data-testid="newsletter-email-input"
              />
              <button
                type="submit"
                className="rounded-full bg-aura-gold text-aura-noir px-5 py-3 text-sm font-semibold inline-flex items-center gap-2 hover:bg-aura-goldhover hover:text-white transition-colors duration-300"
                data-testid="newsletter-submit-btn"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-aura-ivory/40">
          <p>© 2026 Aura Royale Grand Casino. Alle Rechte vorbehalten. Demo-Spiele nutzen Spielgeld.</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-aura-gold cursor-pointer transition-colors duration-300">Impressum</span>
            <span className="hover:text-aura-gold cursor-pointer transition-colors duration-300">Datenschutz</span>
            <span className="hover:text-aura-gold cursor-pointer transition-colors duration-300">AGB</span>
          </div>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif text-center text-[18vw] leading-[0.75] font-semibold text-white/[0.045] select-none pointer-events-none tracking-tight -mb-[4vw]"
        aria-hidden="true"
      >
        AURA ROYALE
      </motion.p>
    </footer>
  );
};

export default Footer;
