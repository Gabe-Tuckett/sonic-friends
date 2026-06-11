/* Sonic Friends — reward system.
   Rings: earned on every correct answer, persist in localStorage.
   Chaos Emeralds: one awarded every RINGS_PER_EMERALD rings.
   All 7 emeralds -> Super Sonic celebration, then the hunt restarts. */

const RINGS_PER_EMERALD = 30;
const EMERALD_COLORS = ['#4caf50', '#e53935', '#2196f3', '#fdd835', '#ab47bc', '#eceff1', '#26c6da'];
const EMERALD_NAMES = ['green', 'red', 'blue', 'yellow', 'purple', 'silver', 'sky blue'];

const Rewards = (() => {
  const store = {
    get rings()    { return +(localStorage.getItem('sf_rings') || 0); },
    set rings(v)   { localStorage.setItem('sf_rings', v); },
    get emeralds() { return +(localStorage.getItem('sf_emeralds') || 0); },
    set emeralds(v){ localStorage.setItem('sf_emeralds', v); },
    get supers()   { return +(localStorage.getItem('sf_supers') || 0); },
    set supers(v)  { localStorage.setItem('sf_supers', v); }
  };

  function ringSVG(size = 26) {
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}">
      <circle cx="12" cy="12" r="8" fill="none" stroke="#f6b73c" stroke-width="5"/>
      <circle cx="12" cy="12" r="8" fill="none" stroke="#fde9a8" stroke-width="2"/>
    </svg>`;
  }

  function emeraldSVG(color, size = 22, dim = false) {
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="opacity:${dim ? 0.25 : 1}">
      <path d="M12 2 L21 9 L12 22 L3 9 Z" fill="${color}" stroke="rgba(0,0,0,0.35)" stroke-width="1.2"/>
      <path d="M12 2 L16 9 L12 22 L8 9 Z" fill="#fff" opacity="0.3"/>
    </svg>`;
  }

  function renderHUD() {
    const hud = document.getElementById('hud');
    if (!hud) return;
    const towards = store.rings % RINGS_PER_EMERALD;
    hud.innerHTML = `
      <span class="hud-rings">${ringSVG()}<b id="ringCount">${store.rings}</b></span>
      <span class="hud-emeralds">
        ${EMERALD_COLORS.map((c, i) => emeraldSVG(c, 20, i >= store.emeralds)).join('')}
      </span>
      ${store.supers > 0 ? `<span class="hud-super" title="Super wins">⭐${store.supers}</span>` : ''}
      <span class="hud-progress"><i style="width:${(towards / RINGS_PER_EMERALD) * 100}%"></i></span>`;
  }

  /* Award rings with the ring chime and a little +N popup near the counter. */
  function addRings(n = 1) {
    store.rings += n;
    Sound.ring();
    renderHUD();
    const counter = document.getElementById('ringCount');
    if (counter) {
      const pop = document.createElement('span');
      pop.className = 'ring-pop';
      pop.textContent = `+${n}`;
      counter.parentElement.appendChild(pop);
      setTimeout(() => pop.remove(), 900);
    }
    const earned = Math.floor(store.rings / RINGS_PER_EMERALD);
    if (earned > store.emeralds && store.emeralds < 7) {
      setTimeout(() => awardEmerald(Math.min(earned, 7)), 1200);
    }
  }

  function awardEmerald(count) {
    store.emeralds = count;
    const i = count - 1;
    overlay(`
      <div class="ceremony">
        <div class="ceremony-art spin-slow">${emeraldSVG(EMERALD_COLORS[i], 150)}</div>
        <div class="ceremony-text">CHAOS EMERALD!</div>
      </div>`);
    Sound.sparkle();
    confettiBurst(120);
    Voice.say(`Wow! You found the ${EMERALD_NAMES[i]} Chaos Emerald! ${7 - count > 0 ? `Only ${7 - count} to go!` : ''}`);
    renderHUD();
    setTimeout(() => {
      closeOverlay();
      if (count >= 7) goSuper();
    }, 3400);
  }

  /* All 7 emeralds: Super Sonic moment, then the emerald hunt restarts. */
  function goSuper() {
    const sonic = charById('sonic');
    const goldArt = sonic.art
      .replaceAll('#2563d8', '#f6c623').replaceAll('#173f96', '#b8860b')
      .replaceAll('#14a83b', '#e53935');
    overlay(`
      <div class="ceremony super">
        <div class="ceremony-art bounce-big">
          <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="#fff7d6"/>${goldArt}</svg>
        </div>
        <div class="ceremony-text gold">SUPER SONIC!</div>
      </div>`);
    Sound.superFanfare();
    confettiBurst(250);
    Voice.say('All seven Chaos Emeralds! You turned into Super Sonic! You are AMAZING!');
    store.supers += 1;
    store.emeralds = 0;
    setTimeout(() => { closeOverlay(); renderHUD(); }, 5000);
  }

  function overlay(html) {
    closeOverlay();
    const el = document.createElement('div');
    el.id = 'ceremonyOverlay';
    el.innerHTML = html;
    document.body.appendChild(el);
  }

  function closeOverlay() {
    const el = document.getElementById('ceremonyOverlay');
    if (el) el.remove();
  }

  return { addRings, renderHUD, ringSVG, emeraldSVG, store };
})();
