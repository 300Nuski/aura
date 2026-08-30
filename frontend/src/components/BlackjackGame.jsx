import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Hand, RefreshCcw, Coins } from "lucide-react";
import { playWinChime } from "@/lib/sounds";
import { recordRound } from "@/lib/rounds";

const SUITS = [
  { s: "♠", red: false },
  { s: "♥", red: true },
  { s: "♦", red: true },
  { s: "♣", red: false },
];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const CHIPS = [10, 50, 100, 500];

const buildDeck = () => {
  const deck = [];
  for (const suit of SUITS) for (const rank of RANKS) deck.push({ rank, ...suit });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const cardValue = (rank) => (rank === "A" ? 11 : ["J", "Q", "K"].includes(rank) ? 10 : Number(rank));

const score = (cards) => {
  let total = cards.reduce((t, c) => t + cardValue(c.rank), 0);
  let aces = cards.filter((c) => c.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
};

const Card = ({ card, hidden, index }) => (
  <motion.div
    initial={{ y: -36, opacity: 0, rotate: -6 }}
    animate={{ y: 0, opacity: 1, rotate: 0 }}
    transition={{ duration: 0.45, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    className={`w-12 h-[68px] sm:w-14 sm:h-20 rounded-lg border shadow-[0_10px_24px_rgba(0,0,0,0.5)] flex flex-col justify-between p-1.5 ${
      hidden ? "bg-night-sidebar border-mint/50" : "bg-white border-slate-200"
    }`}
  >
    {hidden ? (
      <div className="w-full h-full rounded border border-mint/30 flex items-center justify-center">
        <span className="text-mint text-lg">◆</span>
      </div>
    ) : (
      <>
        <span className={`font-display text-sm sm:text-base font-bold leading-none ${card.red ? "text-red-600" : "text-slate-900"}`}>{card.rank}</span>
        <span className={`self-center text-lg sm:text-xl ${card.red ? "text-red-600" : "text-slate-900"}`}>{card.s}</span>
        <span className={`font-display text-sm sm:text-base font-bold leading-none self-end rotate-180 ${card.red ? "text-red-600" : "text-slate-900"}`}>{card.rank}</span>
      </>
    )}
  </motion.div>
);

const BlackjackGame = ({ balance, setBalance }) => {
  const [chip, setChip] = useState(50);
  const [deck, setDeck] = useState([]);
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [phase, setPhase] = useState("bet");
  const [message, setMessage] = useState("Einsatz wählen und austeilen.");
  const [streak, setStreak] = useState(0);
  const [bet, setBet] = useState(0);

  const playerScore = score(player);
  const dealerVisibleScore = phase === "player" || phase === "bet" ? (dealer.length ? cardValue(dealer[0].rank) : 0) : score(dealer);

  const finish = (p, d, deckRest, currentBet) => {
    const ps = score(p);
    const ds = score(d);
    setDeck(deckRest);
    setDealer(d);
    setPhase("done");
    const outcome = ps > 21 ? { mult: 0, payout: 0 } : ds > 21 || ps > ds ? { mult: 2, payout: currentBet * 2 } : ps === ds ? { mult: 1, payout: currentBet } : { mult: 0, payout: 0 };
    recordRound({ game: "Blackjack", bet: currentBet, ...outcome });
    if (ps > 21) {
      setMessage(`Überkauft mit ${ps}. Dealer gewinnt.`);
      setStreak(0);
      toast.error(`Bust! ${ps} Punkte.`);
    } else if (ds > 21) {
      setMessage(`Dealer überkauft mit ${ds}. Du gewinnst!`);
      setBalance((b) => b + currentBet * 2);
      setStreak((s) => s + 1);
      playWinChime();
      toast.success(`Gewonnen! +${(currentBet * 2).toLocaleString("de-DE")} €`);
    } else if (ps > ds) {
      setMessage(`${ps} gegen ${ds}. Du gewinnst!`);
      setBalance((b) => b + currentBet * 2);
      setStreak((s) => s + 1);
      playWinChime();
      toast.success(`Gewonnen! +${(currentBet * 2).toLocaleString("de-DE")} €`);
    } else if (ps === ds) {
      setMessage(`Push bei ${ps}. Einsatz zurück.`);
      setBalance((b) => b + currentBet);
      toast.info("Push — Einsatz zurückerstattet.");
    } else {
      setMessage(`${ps} gegen ${ds}. Dealer gewinnt.`);
      setStreak(0);
      toast.error("Der Dealer gewinnt diese Runde.");
    }
  };

  const deal = () => {
    if (balance < chip) return;
    const d = buildDeck();
    const p = [d.pop(), d.pop()];
    const dl = [d.pop(), d.pop()];
    setDeck(d);
    setPlayer(p);
    setDealer(dl);
    setBet(chip);
    setBalance((b) => b - chip);
    if (score(p) === 21) {
      setPhase("done");
      const win = Math.floor(chip * 2.5);
      setBalance((b) => b + win);
      setMessage("Blackjack! Auszahlung 3:2.");
      setStreak((s) => s + 1);
      playWinChime();
      recordRound({ game: "Blackjack", bet: chip, mult: 2.5, payout: win });
      toast.success(`Blackjack! +${win.toLocaleString("de-DE")} €`);
    } else {
      setPhase("player");
      setMessage("Dein Zug: Karte oder halten?");
    }
  };

  const hit = () => {
    const d = [...deck];
    const p = [...player, d.pop()];
    setPlayer(p);
    if (score(p) > 21) {
      finish(p, dealer, d, bet);
    } else {
      setDeck(d);
      setMessage(score(p) === 21 ? "21! Perfekt — halten." : "Karte oder halten?");
    }
  };

  const stand = () => {
    const d = [...deck];
    const dl = [...dealer];
    while (score(dl) < 17) dl.push(d.pop());
    finish(player, dl, d, bet);
  };

  const reset = () => {
    setPhase("bet");
    setPlayer([]);
    setDealer([]);
    setMessage("Einsatz wählen und austeilen.");
  };

  return (
    <div className="rounded-2xl bg-night-card border border-night-border p-5 sm:p-6" data-testid="blackjack-game">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-mint font-bold mb-1">Kartenspiel</p>
          <h3 className="font-display text-lg sm:text-xl font-extrabold">Blackjack 21 VIP</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">Guthaben</p>
          <p className="font-mono text-base font-bold text-mint tabular-nums" data-testid="blackjack-balance">{balance.toLocaleString("de-DE")} €</p>
        </div>
      </div>

      <div className="rounded-xl bg-[#0D2818] border border-mint/20 p-4 sm:p-5 mb-5 min-h-[220px] shadow-[inset_0_0_60px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">Dealer</span>
          <span className="font-mono text-sm font-bold text-mint" data-testid="blackjack-dealer-score">
            {dealer.length ? dealerVisibleScore : "—"}
          </span>
        </div>
        <div className="flex gap-2 min-h-[72px] sm:min-h-[84px] mb-5" data-testid="blackjack-dealer-hand">
          <AnimatePresence>
            {dealer.map((c, i) => (
              <Card key={`d-${i}-${c.rank}${c.s}`} card={c} hidden={phase === "player" && i === 1} index={i} />
            ))}
          </AnimatePresence>
        </div>

        <div className="h-px bg-mint/15 mb-5" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">Deine Hand</span>
          <span className="font-mono text-sm font-bold text-mint" data-testid="blackjack-player-score">
            {player.length ? playerScore : "—"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[72px] sm:min-h-[84px]" data-testid="blackjack-player-hand">
          <AnimatePresence>
            {player.map((c, i) => (
              <Card key={`p-${i}-${c.rank}${c.s}`} card={c} hidden={false} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-center text-xs sm:text-sm text-slate-400 mb-4 min-h-[20px]" data-testid="blackjack-message">{message}</p>

      <div className="flex items-center justify-center gap-2 mb-4">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => setChip(c)}
            disabled={phase !== "bet"}
            className={`w-11 h-11 rounded-full font-mono text-xs font-bold border-2 transition-all duration-300 ${
              chip === c
                ? "bg-mint text-black border-mint scale-110 shadow-[0_0_18px_rgba(0,229,117,0.5)]"
                : "bg-night-elevated text-slate-300 border-night-border hover:border-mint/50"
            } disabled:opacity-40`}
            data-testid={`blackjack-chip-selector-${c}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {phase === "bet" || phase === "done" ? (
          <button
            onClick={deal}
            disabled={balance < chip}
            className="col-span-2 rounded-full bg-mint text-black py-3 text-sm font-extrabold inline-flex items-center justify-center gap-2 hover:bg-mint-hover transition-colors duration-300 disabled:opacity-40 shadow-[0_0_22px_rgba(0,229,117,0.35)]"
            data-testid="blackjack-deal-btn"
          >
            <Coins className="w-4 h-4" />
            Austeilen · {chip} €
          </button>
        ) : (
          <>
            <button
              onClick={hit}
              className="rounded-full bg-white text-black py-3 text-sm font-extrabold inline-flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors duration-300"
              data-testid="blackjack-hit-btn"
            >
              <Plus className="w-4 h-4" strokeWidth={3} /> Karte
            </button>
            <button
              onClick={stand}
              className="rounded-full border-2 border-slate-400/60 py-3 text-sm font-extrabold inline-flex items-center justify-center gap-1.5 hover:border-mint hover:text-mint transition-colors duration-300"
              data-testid="blackjack-stand-btn"
            >
              <Hand className="w-4 h-4" /> Halten
            </button>
          </>
        )}
        <button
          onClick={reset}
          className="rounded-full bg-night-elevated py-3 text-sm font-bold inline-flex items-center justify-center gap-1.5 text-slate-300 hover:bg-night-cardhover transition-colors duration-300"
          data-testid="blackjack-reset-btn"
        >
          <RefreshCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span data-testid="blackjack-streak">
          Gewinnserie: <span className="font-mono font-bold text-mint">{streak}</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider">Dealer steht ab 17</span>
      </div>
    </div>
  );
};

export default BlackjackGame;
