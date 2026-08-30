export const SYMBOLS = [
  { type: "grapes", label: "Trauben", pays: [0.4, 0.9, 4] },
  { type: "melon", label: "Melone", pays: [0.5, 1, 5] },
  { type: "plum", label: "Pflaume", pays: [0.8, 1.2, 8] },
  { type: "blue", label: "Blaues Bonbon", pays: [1.5, 2, 12] },
  { type: "purple", label: "Lila Bonbon", pays: [2, 5, 20] },
  { type: "heart", label: "Rotes Herz", pays: [4, 10, 40] },
];

const Gloss = ({ x = 22, y = 16, rx = 7, ry = 4 }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#FFFFFF" opacity="0.45" />
);

const CandySymbol = ({ type }) => {
  switch (type) {
    case "grapes":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="g-gr" cx="0.35" cy="0.3" r="0.9">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#7C3AED" />
            </radialGradient>
          </defs>
          <ellipse cx="34" cy="12" rx="7" ry="4" fill="#4ADE80" transform="rotate(-18 34 12)" />
          {[[24, 24], [40, 24], [32, 32], [22, 39], [42, 39], [32, 48]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="8.5" fill="url(#g-gr)" stroke="#5B21B6" strokeWidth="1" />
          ))}
          <Gloss x={25} y={21} rx={3.5} ry={2.2} />
        </svg>
      );
    case "melon":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="g-me" cx="0.35" cy="0.3" r="0.95">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#16A34A" />
            </radialGradient>
          </defs>
          <ellipse cx="32" cy="34" rx="21" ry="17" fill="url(#g-me)" stroke="#15803D" strokeWidth="1.5" />
          <path d="M22 20 C26 30 26 40 22 48" stroke="#15803D" strokeWidth="2" fill="none" opacity="0.55" />
          <path d="M32 17.5 C32 30 32 42 32 50.5" stroke="#15803D" strokeWidth="2" fill="none" opacity="0.55" />
          <path d="M42 20 C38 30 38 40 42 48" stroke="#15803D" strokeWidth="2" fill="none" opacity="0.55" />
          <Gloss x={24} y={24} rx={6} ry={3.5} />
        </svg>
      );
    case "plum":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="g-pl" cx="0.35" cy="0.3" r="0.95">
              <stop offset="0%" stopColor="#F9A8D4" />
              <stop offset="100%" stopColor="#DB2777" />
            </radialGradient>
          </defs>
          <path d="M32 17 C36 9 45 9 47 14 C43 19 36 20 32 17 Z" fill="#4ADE80" stroke="#15803D" strokeWidth="1" />
          <circle cx="32" cy="36" r="18" fill="url(#g-pl)" stroke="#BE185D" strokeWidth="1.5" />
          <Gloss x={25} y={27} rx={6} ry={3.5} />
        </svg>
      );
    case "blue":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="g-bl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <path d="M15 26 L5 19 L5 45 L15 38 Z" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1" />
          <path d="M49 26 L59 19 L59 45 L49 38 Z" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1" />
          <rect x="14" y="19" width="36" height="26" rx="13" fill="url(#g-bl)" stroke="#1D4ED8" strokeWidth="1.5" />
          <path d="M20 25 C26 22 38 22 44 25" stroke="#DBEAFE" strokeWidth="3" fill="none" opacity="0.7" />
        </svg>
      );
    case "purple":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="g-pu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D8B4FE" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>
          </defs>
          <rect x="13" y="13" width="38" height="38" rx="10" fill="url(#g-pu)" stroke="#7E22CE" strokeWidth="1.5" />
          <rect x="21" y="21" width="22" height="22" rx="5" fill="none" stroke="#E9D5FF" strokeWidth="3" opacity="0.75" />
          <Gloss x={23} y={19} rx={6} ry={3} />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="g-he" cx="0.35" cy="0.3" r="0.95">
              <stop offset="0%" stopColor="#FCA5A5" />
              <stop offset="100%" stopColor="#DC2626" />
            </radialGradient>
          </defs>
          <path
            d="M32 52 C16 40 11 29 20 21 C26 15 33 19 32 27 C31 19 38 15 44 21 C53 29 48 40 32 52 Z"
            fill="url(#g-he)"
            stroke="#B91C1C"
            strokeWidth="1.5"
          />
          <Gloss x={24} y={24} rx={5} ry={3} />
        </svg>
      );
    case "lollipop":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="g-lo" cx="0.35" cy="0.3" r="0.95">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="100%" stopColor="#E11D48" />
            </radialGradient>
          </defs>
          <rect x="29" y="34" width="6" height="25" rx="3" fill="#F8FAFC" stroke="#FDA4AF" strokeWidth="1" />
          <circle cx="32" cy="25" r="17" fill="url(#g-lo)" stroke="#BE123C" strokeWidth="1.5" />
          <path d="M32 11.5 A13.5 13.5 0 0 1 45.5 25" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M32 38.5 A13.5 13.5 0 0 1 18.5 25" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="32" cy="25" r="4" fill="#FFFFFF" />
        </svg>
      );
    case "bomb":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="g-bo" cx="0.35" cy="0.3" r="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="45%" stopColor="#F97316" />
              <stop offset="75%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="33" r="18" fill="url(#g-bo)" stroke="#312E81" strokeWidth="2" />
          <circle cx="32" cy="33" r="8" fill="#312E81" />
          <path d="M32 15 L32 8 M38 17 L43 11 M26 17 L21 11" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          <Gloss x={25} y={22} rx={5} ry={3} />
        </svg>
      );
    default:
      return null;
  }
};

export default CandySymbol;
