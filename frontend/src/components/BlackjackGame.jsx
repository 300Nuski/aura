import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Hand, RefreshCcw, Coins } from "lucide-react";

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
    className={`w-12 h-[68px] sm:w-14 sm:h-20 rounded-lg border shadow-[0_10px_24px_-12px_rgba(23,22,20,0.35)] flex flex-col justify-between p-1.5 ${
      hidden ? "bg-aura-noir border-aura-gold/60" : "bg-white border-[rgba(201,168,106,0.45)]"
    }`}
  >
    {hidden ? (
      <div className="w-full h-full rounded border border-aura-gold/40 flex items-center justify-center">
        <span className="text-aura-gold text-lg">◆</span>
      </div>
    ) : (
      <>
        <span className={`font-serif text-sm sm:text-base leading-none ${card.red ? "text-aura-crimson" : "text-aura-ink"}`}>{card.rank}</span>
        <span className={`self-center text-lg sm:text-xl ${card.red ? "text-aura-crimson" : "text-aura-ink"}`}>{card.s}</span>
        <span className={`font-serif text-sm sm:text-base leading-none self-end rotate-180 ${card.red ? "text-aura-crimson" : "text-aura-ink"}`}>{card.rank}</span>
      </>
    )}
  </motion.div>
);

const BlackjackGame = () => {
  const [balance, setBalance] = useState(1000);
  const [chip, setChip] = useState(50);
  const [deck, setDeck] = useState([]);
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [phase, setPhase] = useState("bet");
  const [message, setMessage] = useState("Platzieren Sie Ihren Einsatz und starten Sie die Runde.");
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
    if (ps > 21) {
      setMessage(`Überkauft mit ${ps}. Der Dealer gewinnt.`);
      setStreak(0);
      toast.error(`Bust! ${ps} Punkte.`);
    } else if (ds > 21) {
      setMessage(`Dealer überkauft mit ${ds}. Sie gewinnen!`);
      setBalance((b) => b + currentBet * 2);
      setStreak((s) => s + 1);
      toast.success(`Gewonnen! +${(currentBet * 2).toLocaleString("de-DE")} €`);
    } else if (ps > ds) {
      setMessage(`${ps} gegen ${ds}. Sie gewinnen!`);
      setBalance((b) => b + currentBet * 2);
      setStreak((s) => s + 1);
      toast.success(`Gewonnen! +${(currentBet * 2).toLocaleString("de-DE")} €`);
    } else if (ps === ds) {
      setMessage(`Unentschieden bei ${ps}. Einsatz zurück.`);
      setBalance((b) => b + currentBet);
      toast.info("Push — Einsatz zurückerstattet.");
    } else {
      setMessage(`${ps} gegen ${ds}. Der Dealer gewinnt.`);
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
    setPhase("player");
    if (score(p) === 21) {
      const isBJ = true;
      setPhase("done");
      setDealer(dl);
      const win = Math.floor(chip * 2.5);
      setBalance((b) => b - 0 + win);
      setMessage("Blackjack! Auszahlung 3:2.");
      setStreak((s) => s + 1);
      toast.success(`Blackjack! +${win.toLocaleString("de-DE")} €`);
      void isBJ;
    } else {
      setMessage("Ihr Zug: Karte nehmen oder halten?");
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
      setMessage(score(p) === 21 ? "21! Perfekt — halten Sie an." : "Karte nehmen oder halten?");
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
    setMessage("Platzieren Sie Ihren Einsatz und starten Sie die Runde.");
  };

  const refill = () => {
    setBalance(1000);
    toast.info("Demo-Guthaben auf 1.000 € aufgefüllt.");
  };

  return (
    <div className="rounded-2xl bg-white border border-[rgba(201,168,106,0.3)] shadow-[0_36px_80px_-40px_rgba(23,22,20,0.3)] p-6 sm:p-8" data-testid="blackjack-game">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-aura-gold font-medium mb-1">Spiel B</p>
          <h3 className="font-serif text-xl sm:text-2xl font-medium">Blackjack Privé · 21</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-aura-muted">Guthaben</p>
          <p className="font-mono text-lg font-semibold tabular-nums" data-testid="blackjack-balance">{balance.toLocaleString("de-DE")} €</p>
        </div>
      </div>

      <div className="rounded-xl bg-aura-goldtint/70 border border-[rgba(201,168,106,0.3)] p-4 sm:p-5 mb-5 min-h-[220px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-aura-muted">Dealer</span>
          <span className="font-mono text-sm font-semibold" data-testid="blackjack-dealer-score">
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

        <div className="gold-hairline mb-5" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-aura-muted">Ihre Hand</span>
          <span className="font-mono text-sm font-semibold" data-testid="blackjack-player-score">
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

      <p className="text-center text-xs sm:text-sm text-aura-secondary mb-4 min-h-[20px]" data-testid="blackjack-message">{message}</p>

      <div className="flex items-center justify-center gap-2 mb-4">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => setChip(c)}
            disabled={phase !== "bet"}
            className={`w-11 h-11 rounded-full font-mono text-xs font-semibold border-2 transition-all duration-300 ${
              chip === c
                ? "bg-aura-noir text-aura-gold border-aura-gold scale-110"
                : "bg-aura-goldtint text-aura-ink border-[rgba(201,168,106,0.4)] hover:border-aura-gold"
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
            className="col-span-2 rounded-full bg-aura-noir text-aura-ivory py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-aura-goldhover transition-colors duration-300 disabled:opacity-40"
            data-testid="blackjack-deal-btn"
          >
            <Coins className="w-4 h-4" />
            Austeilen · {chip} €
          </button>
        ) : (
          <>
            <button
              onClick={hit}
              className="rounded-full bg-aura-noir text-aura-ivory py-3 text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-aura-goldhover transition-colors duration-300"
              data-testid="blackjack-hit-btn"
            >
              <Plus className="w-4 h-4" /> Karte
            </button>
            <button
              onClick={stand}
              className="rounded-full border-2 border-aura-ink py-3 text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:border-aura-gold hover:text-aura-goldhover transition-colors duration-300"
              data-testid="blackjack-stand-btn"
            >
              <Hand className="w-4 h-4" /> Halten
            </button>
          </>
        )}
        <button
          onClick={reset}
          className="rounded-full bg-aura-alabaster py-3 text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-aura-elevated transition-colors duration-300"
          data-testid="blackjack-reset-btn"
        >
          <RefreshCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-aura-secondary">
        <span data-testid="blackjack-streak">
          Gewinnserie: <span className="font-mono font-semibold text-aura-ink">{streak}</span>
        </span>
        {balance < CHIPS[0] && (
          <button onClick={refill} className="font-semibold text-aura-goldhover underline underline-offset-2" data-testid="blackjack-refill-btn">
            Guthaben auffüllen
          </button>
        )}
      </div>
    </div>
  );
};

export default BlackjackGame;
