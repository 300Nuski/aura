import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import api from "@/lib/api";
import Topbar from "@/components/Topbar";
import LeftSidebar from "@/components/LeftSidebar";
import ChatPanel from "@/components/ChatPanel";
import BonusModal from "@/components/BonusModal";
import AuthModal from "@/components/AuthModal";
import Home from "@/pages/Home";
import RoulettePage from "@/pages/RoulettePage";
import BlackjackPage from "@/pages/BlackjackPage";
import CrashPage from "@/pages/CrashPage";

const Shell = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(1561);
  const [bonusOpen, setBonusOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

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

  useEffect(() => {
    if (user) setBalance(user.balance ?? 1561);
    if (user === null) setBalance(1561);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      api.put("/auth/balance", { balance }).catch(() => {});
    }, 1200);
    return () => clearTimeout(t);
  }, [balance, user]);

  const openBonus = useCallback(() => setBonusOpen(true), []);

  return (
    <div className="App min-h-screen bg-night-bg text-white" data-testid="app-root">
      <Topbar balance={balance} onDeposit={openBonus} onLogin={() => setAuthOpen(true)} />
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
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <Toaster position="top-center" theme="dark" richColors />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
