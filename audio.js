/* Sonic Friends — speech + generated sound effects (no audio files needed). */

const Sound = (() => {
  let ctx = null;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, delay, dur, type = 'sine', vol = 0.2, glideTo = null) {
    const c = ac();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  return {
    unlock: ac,
    pop()     { tone(520, 0, 0.09, 'triangle', 0.18); tone(780, 0.05, 0.1, 'triangle', 0.14); },
    flip()    { tone(420, 0, 0.08, 'sine', 0.15, 620); },
    chime()   { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.3, 'sine', 0.2)); },
    boing()   { tone(320, 0, 0.3, 'sawtooth', 0.12, 140); },
    fanfare() {
      [392, 392, 392, 523, 659, 784].forEach((f, i) => tone(f, i * 0.13, 0.22, 'triangle', 0.2));
      [784, 1047].forEach((f, i) => tone(f, 0.8 + i * 0.15, 0.45, 'sine', 0.22));
    }
  };
})();

const Voice = (() => {
  const ok = 'speechSynthesis' in window;
  let voice = null;

  function pick() {
    const vs = speechSynthesis.getVoices();
    if (!vs.length) return;
    voice =
      vs.find(v => v.lang.startsWith('en') && /child|kid|junior|samantha|zira|jenny|aria/i.test(v.name)) ||
      vs.find(v => v.lang === 'en-US') ||
      vs.find(v => v.lang.startsWith('en')) ||
      vs[0];
  }

  if (ok) {
    pick();
    speechSynthesis.onvoiceschanged = pick;
  }

  function speak(text, opts = {}) {
    if (!ok) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.rate = opts.rate || 0.9;
    u.pitch = opts.pitch || 1.15;
    speechSynthesis.speak(u);
  }

  return { speak, supported: ok };
})();
