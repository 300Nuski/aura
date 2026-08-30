import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroBanner from "@/components/HeroBanner";
import BentoGrid from "@/components/BentoGrid";
import TopMatches from "@/components/TopMatches";
import TopSlots from "@/components/TopSlots";
import LiveBets from "@/components/LiveBets";
import Footer from "@/components/Footer";

const Home = ({ onClaim }) => {
  const location = useLocation();

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const t = setTimeout(() => {
      const el = document.getElementById(target);
      if (el) window.__lenis?.scrollTo(el, { offset: -90, duration: 1.2 });
    }, 350);
    return () => clearTimeout(t);
  }, [location.state]);

  return (
    <div data-testid="home-page">
      <HeroBanner onClaim={onClaim} />
      <BentoGrid />
      <TopMatches />
      <TopSlots />
      <LiveBets />
      <Footer />
    </div>
  );
};

export default Home;
