/* Sonic Friends — menu + the three mini-games. */

const $ = (sel) => document.querySelector(sel);

const screens = {
  menu: $('#screen-menu'),
  meet: $('#screen-meet'),
  find: $('#screen-find'),
  match: $('#screen-match')
};

function show(name) {
  Object.entries(screens).forEach(([k, el]) => el.classList.toggle('hidden', k !== name));
  $('#homeBtn').classList.toggle('hidden', name === 'menu');
  $('#againBtn').classList.add('hidden');
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pickFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ===== confetti ===== */

const CONFETTI_COLORS = ['#2563d8', '#f6b73c', '#e8554d', '#43a047', '#f06292', '#9575cd', '#4dd0e1'];

function confettiBurst(n = 70) {
  const box = $('#confetti');
  for (let i = 0; i < n; i++) {
    const c = document.createElement('span');
    c.className = 'confetto';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = pickFrom(CONFETTI_COLORS);
    c.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    c.style.animationDelay = Math.random() * 0.4 + 's';
    if (Math.random() < 0.5) c.style.borderRadius = '50%';
    box.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

/* ===== menu ===== */

$('#menuArtMeet').innerHTML = charSVG(CHARACTERS[0]);

document.querySelectorAll('.menu-card').forEach((btn) => {
  btn.addEventListener('click', () => {
    Sound.unlock(); // first tap unlocks audio + speech on iOS
    Sound.pop();
    const game = btn.dataset.game;
    show(game);
    if (game === 'meet') startMeet();
    if (game === 'find') startFind();
    if (game === 'match') startMatch();
  });
});

$('#homeBtn').addEventListener('click', () => {
  Sound.pop();
  show('menu');
});

/* ===== game 1: meet the characters ===== */

function startMeet() {
  const grid = $('#meetGrid');
  grid.innerHTML = '';
  CHARACTERS.forEach((c) => {
    const card = document.createElement('button');
    card.className = 'char-card';
    card.setAttribute('aria-label', c.name);
    card.innerHTML = charSVG(c);
    card.addEventListener('click', () => {
      Sound.pop();
      Voice.speak(`${c.speak}! ${c.tag}`);
      card.classList.remove('bounce');
      void card.offsetWidth; // restart the animation
      card.classList.add('bounce');
    });
    grid.appendChild(card);
  });
  Voice.speak('Tap a friend to hear their name!');
}

/* ===== game 2: find the character ===== */

const PROMPTS = ['Where is NAME?', 'Can you find NAME?', 'Tap NAME!', 'Look for NAME!'];
const PRAISE = ['Yay! You found NAME!', 'Great job! That is NAME!', 'Awesome! NAME!', 'Woohoo! You got NAME!'];
const MAX_STARS = 10;

const find = { streak: 0, stars: 0, target: null, locked: false };

function startFind() {
  find.streak = 0;
  find.stars = 0;
  renderStars();
  newFindRound();
}

function findGridSize() {
  if (find.streak >= 6) return 9;
  if (find.streak >= 3) return 6;
  return 4;
}

function newFindRound() {
  find.locked = false;
  const size = findGridSize();
  const chars = shuffle(CHARACTERS).slice(0, size);
  find.target = pickFrom(chars);

  const grid = $('#findGrid');
  grid.className = `grid find-grid size-${size}`;
  grid.innerHTML = '';
  chars.forEach((c) => {
    const card = document.createElement('button');
    card.className = 'char-card';
    card.setAttribute('aria-label', c.name);
    card.innerHTML = charSVG(c);
    card.addEventListener('click', () => onFindTap(c, card));
    grid.appendChild(card);
  });

  setTimeout(sayFindPrompt, 350);
}

function sayFindPrompt() {
  Voice.speak(pickFrom(PROMPTS).replace('NAME', find.target.speak));
}

$('#repeatBtn').addEventListener('click', () => {
  Sound.pop();
  sayFindPrompt();
});

function onFindTap(c, card) {
  if (find.locked) return;
  if (c.id === find.target.id) {
    find.locked = true;
    find.streak++;
    find.stars++;
    card.classList.add('winner');
    Sound.chime();
    confettiBurst(45);
    Voice.speak(pickFrom(PRAISE).replace('NAME', c.speak));
    renderStars(true);
    if (find.stars >= MAX_STARS) {
      Sound.fanfare();
      confettiBurst(160);
      setTimeout(() => {
        Voice.speak('You got all the stars! You are a superstar!');
        find.stars = 0;
        find.streak = Math.min(find.streak, 6);
        renderStars();
        newFindRound();
      }, 2200);
    } else {
      setTimeout(newFindRound, 1900);
    }
  } else {
    Sound.boing();
    card.classList.remove('wobble');
    void card.offsetWidth;
    card.classList.add('wobble');
    Voice.speak(`That is ${c.speak}! Try again. Where is ${find.target.speak}?`);
    find.streak = 0;
  }
}

function renderStars(popLast = false) {
  const box = $('#stars');
  box.innerHTML = '';
  for (let i = 0; i < MAX_STARS; i++) {
    const earned = i < find.stars;
    const span = document.createElement('span');
    if (earned && popLast && i === find.stars - 1) span.className = 'earned';
    span.innerHTML = `<svg viewBox="0 0 24 24">
      <path d="M12 2 l2.9 6.2 6.8 0.8 -5 4.6 1.3 6.7 -6 -3.3 -6 3.3 1.3 -6.7 -5 -4.6 6.8 -0.8 Z"
        fill="${earned ? '#f6b73c' : 'rgba(255,255,255,0.45)'}"
        stroke="${earned ? '#c98a12' : 'rgba(0,0,0,0.15)'}" stroke-width="1"/>
    </svg>`;
    box.appendChild(span);
  }
}

/* ===== game 3: memory match ===== */

const PAIRS = 6;
const match = { first: null, locked: false, found: 0 };

function startMatch() {
  match.first = null;
  match.locked = false;
  match.found = 0;
  $('#againBtn').classList.add('hidden');

  const chars = shuffle(CHARACTERS).slice(0, PAIRS);
  const deck = shuffle([...chars, ...chars]);

  const grid = $('#matchGrid');
  grid.innerHTML = '';
  deck.forEach((c) => {
    const card = document.createElement('button');
    card.className = 'match-card';
    card.dataset.id = c.id;
    card.setAttribute('aria-label', 'Hidden card');
    card.innerHTML = `
      <div class="match-inner">
        <div class="match-face match-back">
          <svg viewBox="0 0 24 24">
            <path d="M12 2 l2.9 6.2 6.8 0.8 -5 4.6 1.3 6.7 -6 -3.3 -6 3.3 1.3 -6.7 -5 -4.6 6.8 -0.8 Z" fill="#f6b73c"/>
          </svg>
        </div>
        <div class="match-face match-front">${charSVG(c)}</div>
      </div>`;
    card.addEventListener('click', () => onMatchTap(c, card));
    grid.appendChild(card);
  });

  Voice.speak('Find the matching friends!');
}

function onMatchTap(c, card) {
  if (match.locked || card.classList.contains('flipped')) return;
  Sound.flip();
  card.classList.add('flipped');
  Voice.speak(c.speak);

  if (!match.first) {
    match.first = card;
    return;
  }

  const a = match.first;
  match.first = null;

  if (a.dataset.id === card.dataset.id) {
    a.classList.add('matched');
    card.classList.add('matched');
    match.found++;
    setTimeout(() => Sound.chime(), 350);
    if (match.found === PAIRS) {
      setTimeout(() => {
        Sound.fanfare();
        confettiBurst(160);
        Voice.speak('You did it! You found all the friends!');
        $('#againBtn').classList.remove('hidden');
      }, 900);
    }
  } else {
    match.locked = true;
    setTimeout(() => {
      a.classList.remove('flipped');
      card.classList.remove('flipped');
      match.locked = false;
    }, 1300);
  }
}

$('#againBtn').addEventListener('click', () => {
  Sound.pop();
  startMatch();
});

/* ===== boot ===== */

show('menu');

// exposed for automated smoke tests
window._sf = { find, match };
