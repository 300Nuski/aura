let ctx = null;

const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

const note = (c, freq, at, dur, vol = 0.08, type = "sine") => {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(vol, at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
};

export const playWinChime = () => {
  try {
    const c = getCtx();
    const t = c.currentTime;
    note(c, 523.25, t, 0.4, 0.07);
    note(c, 659.25, t + 0.09, 0.4, 0.07);
    note(c, 783.99, t + 0.18, 0.55, 0.09);
    note(c, 1046.5, t + 0.28, 0.6, 0.05);
  } catch {}
};

export const playCashoutChime = () => {
  try {
    const c = getCtx();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.16);
    g.gain.setValueAtTime(0.07, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.3);
    note(c, 1567.98, t + 0.15, 0.5, 0.06);
    note(c, 2093, t + 0.23, 0.5, 0.045);
  } catch {}
};
