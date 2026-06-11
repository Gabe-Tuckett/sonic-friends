/* Sonic Friends — speech with per-character personality + generated sound effects.
   If sfx/<id>.mp3 exists in the repo, it is played for that character's name
   instead of synthesized speech (drop-in voice clips, no code changes). */

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
    /* the classic two-note ring chime */
    ring()    { tone(1318, 0, 0.07, 'square', 0.12); tone(1760, 0.07, 0.18, 'square', 0.12); },
    chime()   { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.3, 'sine', 0.2)); },
    boing()   { tone(320, 0, 0.3, 'sawtooth', 0.12, 140); },
    bop()     { tone(220, 0, 0.12, 'square', 0.18, 90); tone(660, 0.02, 0.06, 'triangle', 0.12); },
    sparkle() { [1047, 1319, 1568, 2093, 2637].forEach((f, i) => tone(f, i * 0.07, 0.25, 'sine', 0.14)); },
    note(i)   { tone([392, 494, 587, 698][i % 4], 0, 0.35, 'triangle', 0.22); },
    fanfare() {
      [392, 392, 392, 523, 659, 784].forEach((f, i) => tone(f, i * 0.13, 0.22, 'triangle', 0.2));
      [784, 1047].forEach((f, i) => tone(f, 0.8 + i * 0.15, 0.45, 'sine', 0.22));
    },
    superFanfare() {
      [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.22));
      [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, 0.8 + i * 0.12, 0.5, 'sine', 0.18));
    }
  };
})();

const Voice = (() => {
  const ok = 'speechSynthesis' in window;
  let voice = null;
  const clips = {}; // id -> Audio | null (null = no clip available)

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

  /* Probe for optional voice clips (sfx/<id>.mp3). Missing files are expected. */
  function probeClips(ids) {
    ids.forEach((id) => {
      const a = new Audio();
      a.preload = 'metadata';
      a.oncanplaythrough = () => { clips[id] = a; };
      a.onerror = () => { clips[id] = null; };
      a.src = `sfx/${id}.mp3`;
    });
  }

  function speak(text, opts = {}) {
    if (!ok) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.rate = opts.rate || 0.95;
    u.pitch = opts.pitch || 1.15;
    if (opts.onend) u.onend = opts.onend;
    speechSynthesis.speak(u);
  }

  /* Narrator: warm storyteller voice for prompts and praise. */
  function say(text, opts = {}) {
    speak(text, Object.assign({ pitch: 1.2, rate: 0.92 }, opts));
  }

  /* A character speaks in their own voice — or their real clip if provided. */
  function charSay(c, text, opts = {}) {
    if (clips[c.id]) {
      if (ok) speechSynthesis.cancel();
      const a = clips[c.id];
      a.currentTime = 0;
      a.play().catch(() => speak(text, { pitch: c.pitch, rate: c.rate }));
      return;
    }
    speak(text, Object.assign({ pitch: c.pitch, rate: c.rate }, opts));
  }

  return { speak, say, charSay, probeClips, supported: ok };
})();
