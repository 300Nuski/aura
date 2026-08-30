import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, ChevronLeft, ChevronRight, Play } from "lucide-react";

const SLOTS = [
  { name: "Gates of Olympus", provider: "Pragmatic", rtp: "96.50%", mult: "5000x", tag: "HOT", tagCls: "bg-[#FF3838]", grad: "from-[#FFD32A] via-[#8C3BFF] to-[#3d1a75]" },
  { name: "Sweet Bonanza", provider: "Pragmatic", rtp: "96.48%", mult: "21100x", tag: "SPIELBAR", tagCls: "bg-mint text-black", grad: "from-[#FF6B9D] via-[#c0457e] to-[#5c1f4e]", route: "/sweet-bonanza" },
  { name: "Book of Dead", provider: "Play'n GO", rtp: "96.21%", mult: "5000x", tag: "CLASSIC", tagCls: "bg-[#2E7CFF]", grad: "from-[#FF9F1C] via-[#a3540e] to-[#3d2408]" },
  { name: "Razor Shark", provider: "Push Gaming", rtp: "96.70%", mult: "50000x", tag: "HIGH VOL", tagCls: "bg-[#00D2D3] text-black", grad: "from-[#00D2D3] via-[#0e7a9c] to-[#07334a]" },
  { name: "San Quentin", provider: "Nolimit City", rtp: "96.03%", mult: "150000x", tag: "EXTREME", tagCls: "bg-[#FF4757]", grad: "from-[#FF4757] via-[#8c1d33] to-[#330a18]" },
];

const TopSlots = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const scrollBy = (dir) => scrollRef.current?.scrollBy({ left: dir * 420, behavior: "smooth" });

  return (
    <section id="slots" className="mb-12" data-testid="slots-section">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight uppercase flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-mint" />
          Top Slots
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => scrollBy(-1)} className="w-8 h-8 rounded-lg bg-night-card border border-night-border flex items-center justify-center hover:border-mint/50 transition-colors duration-300" data-testid="slots-scroll-left" aria-label="Zurück">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scrollBy(1)} className="w-8 h-8 rounded-lg bg-night-card border border-night-border flex items-center justify-center hover:border-mint/50 transition-colors duration-300" data-testid="slots-scroll-right" aria-label="Weiter">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="slots-scroll flex gap-4 overflow-x-auto pb-2 snap-x" data-testid="slots-strip">
        {SLOTS.map((s, i) => (
          <motion.button
            key={s.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            onClick={() => (s.route ? navigate(s.route) : toast.info(`${s.name} — Slot-Demo folgt in Kürze.`))}
            className="group relative shrink-0 w-44 h-60 rounded-2xl overflow-hidden snap-start text-left border border-night-border hover:border-mint/50 transition-colors duration-300"
            data-testid={`slot-card-${i}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-b ${s.grad} group-hover:scale-105 transition-transform duration-500`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <span className={`absolute top-3 left-3 rounded px-2 py-0.5 text-[9px] font-mono font-bold text-white ${s.tagCls}`}>{s.tag}</span>
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="w-12 h-12 rounded-full bg-mint flex items-center justify-center shadow-[0_0_26px_rgba(0,229,117,0.6)]">
                <Play className="w-5 h-5 text-black" fill="currentColor" />
              </span>
            </span>
            <div className="absolute bottom-0 left-0 right-0 p-3.5">
              <p className="font-display font-extrabold text-sm leading-tight mb-1">{s.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-300">{s.provider}</span>
                <span className="font-mono text-[10px] font-bold text-mint">RTP {s.rtp}</span>
              </div>
              <p className="font-mono text-[10px] text-amber-300 mt-0.5">max {s.mult}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default TopSlots;
