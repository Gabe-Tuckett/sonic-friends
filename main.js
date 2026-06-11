/* Sonic Friends — shell: menu, navigation, HUD, confetti, asset overrides. */

const stageEl = () => document.getElementById('stage');

/* ---------- confetti (gold rings + sparks) ---------- */
const CONFETTI_COLORS = ['#f6b73c', '#2563d8', '#4fc3f7', '#fff', '#fdd835', '#e8554d'];

function confettiBurst(n = 70) {
  const box = document.getElementById('confetti');
  for (let i = 0; i < n; i++) {
    const c = document.createElement('span');
    c.className = 'confetto';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    c.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    c.style.animationDelay = Math.random() * 0.4 + 's';
    if (Math.random() < 0.5) c.style.borderRadius = '50%';
    box.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

/* ---------- asset overrides: img/<id>.png replaces built-in art ---------- */
function probeImages() {
  CHARACTERS.forEach((c) => {
    const im = new Image();
    im.onload = () => { c.imgUrl = `img/${c.id}.png`; };
    im.src = `img/${c.id}.png`;
  });
}

/* ---------- navigation ---------- */
function showMenu() {
  Games.stop();
  if (Voice.supported) speechSynthesis.cancel();
  document.getElementById('homeBtn').classList.add('hidden');
  const stage = stageEl();
  stage.innerHTML = `
    <div class="title-wrap">
      <h1 class="title"><span>SONIC</span> FRIENDS</h1>
      <div class="title-streak"></div>
    </div>
    <div class="menu"></div>`;
  const menu = stage.querySelector('.menu');
  Games.list.forEach((g) => {
    const b = document.createElement('button');
    b.className = 'menu-card';
    b.style.setProperty('--accent', g.color);
    b.innerHTML = `<span class="menu-art">${g.icon()}</span><span class="menu-label">${g.label}</span>`;
    b.onclick = () => {
      Sound.unlock();
      Sound.pop();
      openGame(g);
    };
    menu.appendChild(b);
  });
}

function openGame(g) {
  document.getElementById('homeBtn').classList.remove('hidden');
  const stage = stageEl();
  stage.innerHTML = '';
  Games.start(g.id, stage);
}

/* ---------- boot ---------- */
document.getElementById('homeBtn').onclick = () => { Sound.pop(); showMenu(); };
probeImages();
Voice.probeClips(CHARACTERS.map((c) => c.id));
Rewards.renderHUD();
showMenu();

// exposed for automated smoke tests
window._sf = { Games, Rewards, CHARACTERS };
