// Tiny WebAudio sound utility — no assets needed.
let ctx: AudioContext | null = null;
let muted = typeof localStorage !== "undefined" && localStorage.getItem("mq_muted") === "1";

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try { ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(); }
    catch { return null; }
  }
  return ctx;
}

function beep(freq: number, dur = 0.12, type: OscillatorType = "sine", gain = 0.15) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g).connect(c.destination);
  const t = c.currentTime;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur);
}

export const sfx = {
  tap: () => beep(520, 0.05, "square", 0.06),
  correct: () => { beep(660, 0.1, "triangle", 0.18); setTimeout(() => beep(990, 0.14, "triangle", 0.18), 80); },
  wrong: () => beep(160, 0.25, "sawtooth", 0.18),
  finish: () => { beep(523, 0.12, "triangle"); setTimeout(() => beep(659, 0.12, "triangle"), 120); setTimeout(() => beep(784, 0.2, "triangle"), 240); },
};

export const haptics = {
  tap: () => vibrate(12),
  correct: () => vibrate([18, 28, 28]),
  wrong: () => vibrate([45, 35, 45]),
  milestone: () => vibrate([25, 35, 25]),
  finish: () => vibrate([35, 35, 55]),
};

function vibrate(pattern: VibratePattern) {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  navigator.vibrate(pattern);
}

export function isMuted() { return muted; }
export function toggleMuted() {
  muted = !muted;
  if (typeof localStorage !== "undefined") localStorage.setItem("mq_muted", muted ? "1" : "0");
  return muted;
}
