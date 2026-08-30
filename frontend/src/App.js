import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import Topbar from "@/components/Topbar";
import LeftSidebar from "@/components/LeftSidebar";
import ChatPanel from "@/components/ChatPanel";
import BonusModal from "@/components/BonusModal";
import Home from "@/pages/Home";
import RoulettePage from "@/pages/RoulettePage";
import BlackjackPage from "@/pages/BlackjackPage";
import CrashPage from "@/pages/CrashPage";

function App() {
  const [balance, setBalance] = useState(1561);
  const [bonusOpen, setBonusOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 1.05 });
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

  const openBonus = useCallback(() => setBonusOpen(true), []);

  return (
    <BrowserRouter>
      <div className="App min-h-screen bg-night-bg text-white" data-testid="app-root">
        <Topbar balance={balance} onDeposit={openBonus} />
        <LeftSidebar />
        <ChatPanel />
        <main className="pt-16 md:pt-20 sm:pl-20 xl:pr-80 min-h-screen">
          <div className="px-4 md:px-6 py-6 max-w-[1440px] mx-auto">
            <Routes>
              <Route path="/" element={<Home onClaim={openBonus} />} />
              <Route path="/roulette" element={<RoulettePage balance={balance} setBalance={setBalance} />} />
              <Route path="/blackjack" element={<BlackjackPage balance={balance} setBalance={setBalance} />} />
              <Route path="/crash" element={<CrashPage balance={balance} setBalance={setBalance} />} />
            </Routes>
          </div>
        </main>
        <BonusModal open={bonusOpen} onOpenChange={setBonusOpen} onDeposit={(amt) => setBalance((b) => b + amt)} />
        <Toaster position="top-center" theme="dark" richColors />
      </div>
    </BrowserRouter>
  );
}

export default App;
