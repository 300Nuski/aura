import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Diamond } from "lucide-react";

const LINKS = [
  { id: "spiele", label: "Die Spiele", num: "01" },
  { id: "arena", label: "Spiel-Arena", num: "02" },
  { id: "vip", label: "Privé Club", num: "03" },
  { id: "faq", label: "FAQ", num: "04" },
];

const Navbar = ({ onOpenBonus, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ${
        scrolled
          ? "bg-[rgba(253,251,247,0.85)] backdrop-blur-xl border-b border-[rgba(201,168,106,0.25)] shadow-[0_8px_40px_-18px_rgba(23,22,20,0.18)]"
          : "bg-transparent border-b border-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <button
          onClick={() => window.__lenis?.scrollTo(0, { duration: 1.2 })}
          className="flex items-center gap-2.5 group"
          data-testid="navbar-brand"
        >
          <span className="w-8 h-8 rounded-full border border-aura-gold flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
            <Diamond className="w-3.5 h-3.5 text-aura-gold" fill="currentColor" />
          </span>
          <span className="font-serif text-xl tracking-[0.18em] font-semibold">
            AURA <span className="text-aura-gold">ROYALE</span>
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-8" data-testid="navbar-links">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="text-[13px] font-medium tracking-wide text-aura-secondary hover:text-aura-ink transition-colors duration-300 flex items-baseline gap-1.5"
              data-testid={`navbar-link-${l.id}`}
            >
              <span className="font-mono text-[10px] text-aura-gold">{l.num}</span>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <span className="hidden xl:inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.18em] text-aura-muted uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse-dot" />
            Lizenziert · 24/7 Live
          </span>
          <button
            onClick={onOpenBonus}
            className="relative overflow-hidden rounded-full bg-aura-noir text-aura-ivory text-[13px] font-semibold px-5 py-2.5 hover:bg-aura-goldhover transition-colors duration-300"
            data-testid="navbar-bonus-cta"
          >
            Bonus freischalten
          </button>
        </div>

        <button
          className="lg:hidden p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü"
          data-testid="navbar-mobile-toggle"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden bg-[rgba(253,251,247,0.96)] backdrop-blur-xl border-b border-[rgba(201,168,106,0.25)]"
            data-testid="navbar-mobile-menu"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className="text-left font-serif text-2xl flex items-baseline gap-3"
                  data-testid={`navbar-mobile-link-${l.id}`}
                >
                  <span className="font-mono text-xs text-aura-gold">{l.num}</span>
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => { setOpen(false); onOpenBonus(); }}
                className="mt-2 rounded-full bg-aura-noir text-aura-ivory text-sm font-semibold px-5 py-3"
                data-testid="navbar-mobile-bonus-cta"
              >
                Bonus freischalten · 100% bis 1.500 €
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
