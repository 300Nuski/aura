import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Gamepad2, Disc, Layers, Trophy, Sparkles, Rocket, Package, Swords, ShieldCheck } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

const ITEMS = [
  { id: "lobby", label: "Lobby", icon: Gamepad2, route: "/" },
  { id: "roulette", label: "Roulette", icon: Disc, route: "/roulette" },
  { id: "blackjack", label: "Blackjack", icon: Layers, route: "/blackjack" },
  { id: "crash", label: "Crash", icon: Rocket, route: "/crash" },
  { id: "jackpot", label: "Jackpot", icon: Trophy },
  { id: "slots", label: "Slots", icon: Sparkles, scroll: "slots" },
  { id: "cases", label: "Cases", icon: Package },
  { id: "matches", label: "Esports", icon: Swords, scroll: "matches" },
];

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleClick = (item) => {
    if (item.route) {
      navigate(item.route);
      return;
    }
    if (item.scroll) {
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: item.scroll } });
      } else {
        const el = document.getElementById(item.scroll);
        if (el) window.__lenis?.scrollTo(el, { offset: -90, duration: 1.2 });
      }
      return;
    }
    toast.info(`${item.label} — Demo folgt in Kürze.`);
  };

  const items = user?.role === "admin"
    ? [...ITEMS, { id: "admin", label: "Admin", icon: ShieldCheck, route: "/admin" }]
    : ITEMS;

  return (
    <aside
      className="hidden sm:flex flex-col items-center fixed top-16 md:top-20 left-0 bottom-0 w-20 z-30 bg-night-sidebar border-r border-night-bordersub py-4 gap-1 overflow-y-auto"
      data-testid="left-sidebar"
    >
      {items.map((item) => {
        const isActive = item.route && item.route === location.pathname;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className={`w-16 rounded-xl py-2.5 flex flex-col items-center gap-1.5 transition-colors duration-300 ${
              isActive ? "bg-night-elevated text-mint" : item.id === "admin" ? "text-[#c39aff]/70 hover:text-[#c39aff] hover:bg-night-card" : "text-slate-500 hover:text-slate-200 hover:bg-night-card"
            }`}
            data-testid={`sidebar-item-${item.id}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-semibold tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};

export default LeftSidebar;
