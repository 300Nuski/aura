const PHRASES = [
  "EUROPEAN ROULETTE",
  "BLACKJACK ROYALE",
  "TEXAS HOLD'EM PRIVÉ",
  "100% WILLKOMMENSBONUS",
  "HIGH ROLLER SUITE",
  "INSTANT WITHDRAWAL",
  "PROVABLY FAIR",
];

const Marquee = () => {
  const row = [...PHRASES, ...PHRASES];
  return (
    <div className="relative border-y border-[rgba(201,168,106,0.3)] bg-aura-alabaster/60 py-5 overflow-hidden" data-testid="marquee-ribbon">
      <div className="marquee-track flex whitespace-nowrap w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center" aria-hidden={half === 1}>
            {row.map((p, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className="font-serif italic text-xl sm:text-2xl text-aura-ink/80 tracking-wide px-6">{p}</span>
                <span className="text-aura-gold text-xs">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
