import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare } from "lucide-react";

const AVATAR_COLORS = ["from-[#8C3BFF] to-[#2E7CFF]", "from-[#00E575] to-[#00D2D3]", "from-[#FF9F1C] to-[#FF4757]", "from-[#2E7CFF] to-[#00D2D3]", "from-[#FF4757] to-[#8C3BFF]", "from-[#FFD32A] to-[#FF9F1C]"];

const INITIAL = [
  { name: "Annette S.", level: 24, text: "Gerade 2.400 € beim Royale Roulette geholt, das Rad läuft heute" },
  { name: "DerBoss99", level: 8, text: "jemand Lust auf ein 1v1 Duell in der Arena?" },
  { name: "LuckyLisa", level: 31, text: "Blackjack-Serie x5 — der Dealer hasst mich heute" },
  { name: "MaxPower", level: 12, text: "Bei 24x ausgestiegen bei Crash, lets gooo" },
  { name: "SpinQueen", level: 19, text: "Sweet Bonanza gibt wieder Freispiele wie verrückt" },
  { name: "NeoBlade", level: 42, text: "FaZe nimmt Map 2, safe call" },
];

const AUTO_POOL = [
  { name: "HighRollerH", level: 55, text: "Whale-Alarm im Live-Feed, schaut euch das an" },
  { name: "CasinoCarl", level: 17, text: "GL an alle am Tisch 4 heute Abend" },
  { name: "TimT", level: 6, text: "Erster Tag hier — diese Lobby ist ja krass designt" },
  { name: "SpinQueen", level: 19, text: "Noch einer für die Jackpot-Runde? Timer läuft" },
  { name: "LuckyLisa", level: 31, text: "21 mit 5 Karten. Ich hör jetzt auf, versprochen" },
  { name: "MaxPower", level: 12, text: "Wer tippt auf NaVi im Finale?" },
];

const ChatPanel = () => {
  const [messages, setMessages] = useState(INITIAL);
  const [input, setInput] = useState("");
  const [online, setOnline] = useState(2842);
  const listRef = useRef(null);

  useEffect(() => {
    const i = setInterval(() => {
      const msg = AUTO_POOL[Math.floor(Math.random() * AUTO_POOL.length)];
      setMessages((m) => [...m.slice(-30), { ...msg, id: Date.now() }]);
    }, 6500);
    const o = setInterval(() => setOnline((v) => Math.max(2400, v + Math.floor(Math.random() * 21) - 10)), 3000);
    return () => { clearInterval(i); clearInterval(o); };
  }, []);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m.slice(-30), { id: Date.now(), name: "Du", level: 42, text, own: true }]);
    setInput("");
  };

  return (
    <aside
      className="hidden xl:flex flex-col fixed top-20 right-0 bottom-0 w-80 z-30 bg-night-chat border-l border-night-bordersub"
      data-testid="chat-panel"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-night-bordersub">
        <span className="inline-flex items-center gap-2 font-display font-bold text-sm">
          <MessageSquare className="w-4 h-4 text-mint" />
          Online Chat
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-mint" data-testid="chat-online-count">
          <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse-dot" />
          {online.toLocaleString("de-DE")}
        </span>
      </div>

      <div ref={listRef} className="chat-scroll flex-1 overflow-y-auto px-4 py-4 space-y-4" data-testid="chat-messages">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={m.id ?? i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex gap-2.5"
            >
              <span className={`shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${AVATAR_COLORS[(m.name.charCodeAt(0) + i) % AVATAR_COLORS.length]} flex items-center justify-center text-[11px] font-bold`}>
                {m.name.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5">
                  <span className={`text-[13px] font-semibold truncate ${m.own ? "text-mint" : "text-slate-200"}`}>{m.name}</span>
                  <span className="shrink-0 rounded bg-night-elevated border border-night-border px-1 py-px text-[9px] font-mono text-amber-300">{m.level}</span>
                </p>
                <p className="text-xs text-slate-400 leading-relaxed break-words">{m.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={send} className="p-4 border-t border-night-bordersub" data-testid="chat-form">
        <div className="flex items-center gap-2 rounded-xl bg-night-card border border-night-border px-3.5 py-2.5 focus-within:border-mint/50 transition-colors duration-300">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nachricht schreiben …"
            maxLength={140}
            className="flex-1 min-w-0 bg-transparent text-sm placeholder:text-slate-600 focus:outline-none"
            data-testid="chat-input"
          />
          <button type="submit" className="shrink-0 w-8 h-8 rounded-lg bg-mint text-black flex items-center justify-center hover:bg-mint-hover transition-colors duration-300" data-testid="chat-send-btn" aria-label="Senden">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </aside>
  );
};

export default ChatPanel;
