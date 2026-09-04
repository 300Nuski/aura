import { motion } from "framer-motion";
import { Swords, Eye, Clock3 } from "lucide-react";

const MATCHES = [
  {
    id: "m1",
    game: "Counter-Strike 2",
    tournament: "ESL Pro League · International",
    teamA: "Natus Vincere",
    teamB: "FaZe Clan",
    oddsA: "1.74",
    oddsB: "2.12",
    live: true,
    status: "LIVE · MAP 2",
    score: "11 - 9",
    time: "15:00",
    viewers: "26K",
    img: "https://images.unsplash.com/photo-1612151388040-9ec75d2de8c7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwzfHxlc3BvcnRzJTIwYXJlbmF8ZW58MHx8fGJsYWNrfDE3ODg1MjgwNzN8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "m2",
    game: "Valorant",
    tournament: "VCT Masters · International",
    teamA: "Fnatic",
    teamB: "Sentinels",
    oddsA: "1.88",
    oddsB: "1.95",
    live: false,
    status: "STARTET IN 14 MIN",
    score: "VS",
    time: "13:15",
    viewers: "8K",
    img: "https://images.unsplash.com/photo-1548686304-5c3be888a00b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwYXJlbmF8ZW58MHx8fGJsYWNrfDE3ODg1MjgwNzN8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "m3",
    game: "EA Sports FC 24",
    tournament: "World Finals · International",
    teamA: "Umut",
    teamB: "Vejrgang",
    oddsA: "2.05",
    oddsB: "1.78",
    live: true,
    status: "LIVE · 2. HÄLFTE",
    score: "3 - 2",
    time: "15:00",
    viewers: "19K",
    img: "https://images.unsplash.com/photo-1527690789675-4ea7d8da4fe3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwzfHxnYW1pbmclMjBkYXJrfGVufDB8fHxibGFja3wxNzg4NTI4MDc5fDA&ixlib=rb-4.1.0&q=85",
  },
];

const TopMatches = () => (
  <section id="matches" className="mb-12" data-testid="matches-section">
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight uppercase flex items-center gap-2.5">
        <Swords className="w-5 h-5 text-mint" />
        Top Matches
      </h2>
      <span className="text-xs font-semibold text-slate-400 hover:text-mint cursor-pointer transition-colors duration-300" data-testid="matches-see-all">
        Alle ansehen
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {MATCHES.map((m, i) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: i * 0.08 }}
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-2xl bg-night-card border border-night-border hover:border-mint/40 p-5 transition-colors duration-300"
          data-testid={`match-card-${m.id}`}
        >
          {m.img && (
            <>
              <img
                src={m.img}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night-card via-night-card/85 to-night-card/60 pointer-events-none" />
            </>
          )}
          <div className="relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-bold">{m.game}</span>
            {m.live ? (
              <span className="inline-flex items-center gap-1.5 rounded bg-[#FF3838]/15 border border-[#FF3838]/40 text-[#FF3838] px-2 py-0.5 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3838] animate-pulse-dot" />
                LIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300 px-2 py-0.5 text-[10px] font-mono font-bold">
                <Clock3 className="w-3 h-3" />
                BALD
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mb-4">{m.tournament}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className="w-1.5 h-4 rounded-full bg-[#FF9F1C]" />
                {m.teamA}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className="w-1.5 h-4 rounded-full bg-[#2E7CFF]" />
                {m.teamB}
              </span>
            </div>
            <p className="text-center font-display font-extrabold text-2xl tracking-tight pt-1" data-testid={`match-score-${m.id}`}>{m.score}</p>
          </div>

          <div className="flex items-center justify-between border-t border-night-bordersub pt-3.5">
            <div className="flex gap-2">
              <span className="font-mono font-bold text-amber-300 text-xs px-2 py-1 rounded bg-amber-400/10 border border-amber-400/20">1 · {m.oddsA}</span>
              <span className="font-mono font-bold text-amber-300 text-xs px-2 py-1 rounded bg-amber-400/10 border border-amber-400/20">2 · {m.oddsB}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
              <Eye className="w-3.5 h-3.5" />
              {m.viewers}
            </span>
          </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default TopMatches;
