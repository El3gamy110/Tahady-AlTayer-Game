let ctx: AudioContext | null = null;

function tone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.06) {
  if (typeof window === "undefined") return;
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    vol.gain.value = gain;
    osc.connect(vol);
    vol.connect(ctx.destination);
    const now = ctx.currentTime;
    vol.gain.setValueAtTime(gain, now);
    vol.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  } catch {
    /* audio unavailable */
  }
}

export type SfxName =
  | "click"
  | "select"
  | "correct"
  | "wrong"
  | "warning"
  | "reveal"
  | "roundComplete"
  | "winner";

export function playSfx(name: SfxName, enabled: boolean) {
  if (!enabled) return;
  switch (name) {
    case "click":
      tone(420, 0.07, "triangle", 0.04);
      break;
    case "select":
      tone(620, 0.09, "triangle");
      break;
    case "correct":
      tone(660, 0.12);
      window.setTimeout(() => tone(880, 0.18), 110);
      break;
    case "wrong":
      tone(200, 0.22, "sawtooth", 0.05);
      break;
    case "warning":
      tone(880, 0.08, "square", 0.03);
      break;
    case "reveal":
      tone(520, 0.1, "triangle");
      window.setTimeout(() => tone(780, 0.12, "triangle"), 90);
      break;
    case "roundComplete":
      [523, 659, 784].forEach((f, i) => window.setTimeout(() => tone(f, 0.16), i * 120));
      break;
    case "winner":
      [523, 659, 784, 1046].forEach((f, i) => window.setTimeout(() => tone(f, 0.22), i * 150));
      break;
  }
}
