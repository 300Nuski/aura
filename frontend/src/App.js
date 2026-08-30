import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Manifesto from "@/components/Manifesto";
import Playground from "@/components/Playground";
import VipBento from "@/components/VipBento";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import BonusModal from "@/components/BonusModal";

function App() {
  const [bonusOpen, setBonusOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1.05 });
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  const scrollToId = useCallback((id) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -72, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const openBonus = useCallback(() => setBonusOpen(true), []);

  return (
    <div className="App bg-aura-ivory text-aura-ink min-h-screen" data-testid="app-root">
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar onOpenBonus={openBonus} onNavigate={scrollToId} />
      <main>
        <Hero onOpenBonus={openBonus} onNavigate={scrollToId} />
        <Marquee />
        <Manifesto />
        <Playground />
        <VipBento />
        <FaqSection />
      </main>
      <Footer />
      <BonusModal open={bonusOpen} onOpenChange={setBonusOpen} />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
