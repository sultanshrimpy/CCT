let ctx: AudioContext | null = null;

function getCtx(): AudioContext {  
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume()
  return ctx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.3) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playMessageReceived() {
  playTone(880, 0.15, "sine", 0.2);
  setTimeout(() => playTone(1100, 0.2, "sine", 0.15), 100);
}


export function playVoiceJoin() {
  playTone(600, 0.08, "sine", 0.3);
  setTimeout(() =>playTone(800, 0.12, "sine", 0.2), 60);
}

let callInterval: ReturnType<typeof setInterval> | null = null;

export function playIncomingCall() {
    stopIncomingCall();
    const ring = () => {
      playTone(440, 0.3, "sine", 0.4);
      setTimeout(() => playTone(480, 0.3, "sine", 0.4), 350);
    };
    ring();
    callInterval = setInterval(ring, 2000);
}

export function stopIncomingCall() {
  if (callInterval) {
    clearInterval(callInterval);
    callInterval = null;
  }
}
