/* Sonic Friends — the mini-games.
   Each game: { id, label, color, icon, start(stage) -> optional cleanup fn }.
   All games: no reading required, spoken prompts, rings for correct answers. */

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pickFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const sample = (arr, n) => shuffle(arr).slice(0, n);

const PRAISE = ['Yay!', 'Great job!', 'Awesome!', 'Woohoo!', 'Way past cool!', 'Super!', 'You got it!'];
const RETRY = ['Try again!', 'Almost! Try again!', 'Not that one — keep looking!'];

function bounceEl(el) { el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); }
function wobbleEl(el) { el.classList.remove('wobble'); void el.offsetWidth; el.classList.add('wobble'); }

function winEl(el, rings, after, delay = 1700) {
  el.classList.add('winner');
  Sound.chime();
  confettiBurst(40);
  Rewards.addRings(rings);
  // skip the next round if the player already left this game/screen
  if (after) setTimeout(() => { if (document.body.contains(el)) after(); }, delay);
}

/* Build a tappable card */
function card(html, cls = 'char-card') {
  const b = document.createElement('button');
  b.className = cls;
  b.innerHTML = html;
  return b;
}

const Games = (() => {
  const list = [];
  const def = (g) => list.push(g);

  /* ============ 1. MEET — free play, every friend speaks ============ */
  def({
    id: 'meet', label: 'Meet', color: '#2563d8',
    icon: () => charSVG(charById('sonic')),
    start(stage) {
      stage.innerHTML = '<div class="grid meet-grid"></div>';
      const grid = stage.firstElementChild;
      CHARACTERS.forEach((c) => {
        const el = card(charArt(c));
        el.onclick = () => { Sound.pop(); Voice.charSay(c, `${c.speak}! ${c.tag}`); bounceEl(el); };
        grid.appendChild(el);
      });
      Voice.say('Tap a friend to hear them talk!');
    }
  });

  /* ============ 2. FIND — listen and tap the right friend ============ */
  def({
    id: 'find', label: 'Find', color: '#f6b73c',
    icon: () => `<svg viewBox="0 0 100 100"><circle cx="44" cy="44" r="28" fill="#fff" stroke="#2563d8" stroke-width="7"/><line x1="65" y1="65" x2="88" y2="88" stroke="#2563d8" stroke-width="11" stroke-linecap="round"/><text x="44" y="57" font-size="36" text-anchor="middle" fill="#2563d8" font-weight="bold">?</text></svg>`,
    start(stage) {
      let streak = 0, locked = false, target = null;
      stage.innerHTML = '<div class="prompt-bar"><button class="round-btn yellow" id="hearBtn"></button></div><div class="grid find-grid"></div>';
      const grid = stage.querySelector('.find-grid');
      const hear = stage.querySelector('#hearBtn');
      hear.innerHTML = speakerIcon();
      const ask = () => Voice.say(pickFrom(['Where is NAME?', 'Can you find NAME?', 'Tap NAME!']).replace('NAME', target.speak));
      hear.onclick = () => { Sound.pop(); ask(); };
      function round() {
        locked = false;
        const n = streak >= 6 ? 9 : streak >= 3 ? 6 : 4;
        const chars = sample(CHARACTERS, n);
        target = pickFrom(chars);
        grid.className = `grid find-grid size-${n}`;
        grid.innerHTML = '';
        chars.forEach((c) => {
          const el = card(charArt(c));
          el.onclick = () => {
            if (locked) return;
            if (c.id === target.id) {
              locked = true; streak++;
              Voice.charSay(c, pickFrom(['You found me!', 'Here I am!', `That's me! ${c.speak}!`]));
              winEl(el, 2, round);
            } else {
              streak = 0;
              Sound.boing(); wobbleEl(el);
              Voice.say(`That's ${c.speak}! Where is ${target.speak}?`);
            }
          };
          grid.appendChild(el);
        });
        setTimeout(ask, 350);
      }
      round();
    }
  });

  /* ============ 3. MATCH — memory pairs ============ */
  def({
    id: 'match', label: 'Match', color: '#43a047',
    icon: () => `<svg viewBox="0 0 100 100"><rect x="12" y="22" width="36" height="50" rx="8" fill="#f6b73c" stroke="#c98a12" stroke-width="3" transform="rotate(-8 30 47)"/><rect x="52" y="22" width="36" height="50" rx="8" fill="#42a5f5" stroke="#1565c0" stroke-width="3" transform="rotate(8 70 47)"/><path d="M30 38 l3.5 7 8 1 -5.8 5.6 1.4 8 -7.1 -3.8 -7.1 3.8 1.4 -8 -5.8 -5.6 8 -1 Z" fill="#fff" transform="rotate(-8 30 47)"/><path d="M70 38 l3.5 7 8 1 -5.8 5.6 1.4 8 -7.1 -3.8 -7.1 3.8 1.4 -8 -5.8 -5.6 8 -1 Z" fill="#fff" transform="rotate(8 70 47)"/></svg>`,
    start(stage) {
      const PAIRS = 6;
      let first = null, locked = false, found = 0;
      function build() {
        first = null; locked = false; found = 0;
        const deck = shuffle(sample(CHARACTERS, PAIRS).flatMap((c) => [c, c]));
        stage.innerHTML = '<div class="match-grid"></div>';
        const grid = stage.firstElementChild;
        deck.forEach((c) => {
          const el = card(`
            <div class="match-inner">
              <div class="match-face match-back"><svg viewBox="0 0 24 24"><path d="M12 2 l2.9 6.2 6.8 0.8 -5 4.6 1.3 6.7 -6 -3.3 -6 3.3 1.3 -6.7 -5 -4.6 6.8 -0.8 Z" fill="#f6b73c"/></svg></div>
              <div class="match-face match-front">${charArt(c)}</div>
            </div>`, 'match-card');
          el.dataset.id = c.id;
          el.onclick = () => {
            if (locked || el.classList.contains('flipped')) return;
            Sound.flip();
            el.classList.add('flipped');
            Voice.charSay(c, c.speak);
            if (!first) { first = el; return; }
            const a = first; first = null;
            if (a.dataset.id === el.dataset.id) {
              a.classList.add('matched'); el.classList.add('matched');
              found++;
              setTimeout(() => { Sound.chime(); Rewards.addRings(3); }, 350);
              if (found === PAIRS) setTimeout(() => {
                Sound.fanfare(); confettiBurst(160);
                Voice.say('You found all the friends! Want to play again?');
                setTimeout(() => { if (document.body.contains(el)) build(); }, 3000);
              }, 900);
            } else {
              locked = true;
              setTimeout(() => { a.classList.remove('flipped'); el.classList.remove('flipped'); locked = false; }, 1300);
            }
          };
          grid.appendChild(el);
        });
      }
      build();
      Voice.say('Find the matching friends!');
    }
  });

  /* ============ 4. COUNT — count the rings ============ */
  def({
    id: 'count', label: 'Count', color: '#f6a51c',
    icon: () => `<svg viewBox="0 0 100 100"><circle cx="38" cy="40" r="16" fill="none" stroke="#f6b73c" stroke-width="9"/><circle cx="66" cy="58" r="16" fill="none" stroke="#f6b73c" stroke-width="9"/><text x="50" y="92" font-size="30" text-anchor="middle" fill="#7a4d08" font-weight="bold">1 2 3</text></svg>`,
    start(stage) {
      let best = 0, locked = false;
      function round() {
        locked = false;
        const max = best >= 4 ? 10 : 5;
        const n = 1 + Math.floor(Math.random() * max);
        const answers = shuffle([n, ...sample([...Array(max).keys()].map(i => i + 1).filter(x => x !== n), 2)]);
        stage.innerHTML = `<div class="ring-field"></div><div class="answer-row"></div>`;
        const field = stage.querySelector('.ring-field');
        for (let i = 0; i < n; i++) {
          const r = document.createElement('span');
          r.className = 'big-ring';
          r.innerHTML = Rewards.ringSVG(64);
          r.style.animationDelay = `${i * 0.15}s`;
          field.appendChild(r);
          setTimeout(() => Sound.pop(), 400 + i * 150);
        }
        const row = stage.querySelector('.answer-row');
        answers.forEach((a) => {
          const el = card(`<span class="big-num">${a}</span>`, 'char-card num-card');
          el.onclick = () => {
            if (locked) return;
            Voice.say(`${a}`);
            if (a === n) {
              locked = true; best++;
              setTimeout(() => Voice.say(`Yes! ${n} ring${n > 1 ? 's' : ''}! ${pickFrom(PRAISE)}`), 500);
              winEl(el, 2, round, 2200);
            } else {
              Sound.boing(); wobbleEl(el);
              setTimeout(() => Voice.say('Try counting again! Touch each ring as you count.'), 500);
            }
          };
          row.appendChild(el);
        });
        Voice.say('Count the rings! How many do you see?');
      }
      round();
    }
  });

  /* ============ 5. COLORS — Chaos Emerald colors ============ */
  def({
    id: 'colors', label: 'Colors', color: '#4caf50',
    icon: () => `<svg viewBox="0 0 100 100"><path d="M30 15 L48 30 L30 60 L12 30 Z" fill="#4caf50"/><path d="M70 30 L88 45 L70 75 L52 45 Z" fill="#e53935"/><path d="M48 55 L66 70 L48 98 L30 70 Z" fill="#2196f3"/></svg>`,
    start(stage) {
      let streak = 0, locked = false;
      function round() {
        locked = false;
        const n = Math.min(3 + Math.floor(streak / 2), 7);
        const idxs = sample([...EMERALD_COLORS.keys()], n);
        const target = pickFrom(idxs);
        stage.innerHTML = '<div class="grid find-grid size-6 emerald-grid"></div>';
        const grid = stage.firstElementChild;
        idxs.forEach((i) => {
          const el = card(Rewards.emeraldSVG(EMERALD_COLORS[i], 110), 'char-card emerald-card');
          el.onclick = () => {
            if (locked) return;
            if (i === target) {
              locked = true; streak++;
              Sound.sparkle();
              Voice.say(`Yes! The ${EMERALD_NAMES[i]} emerald! ${pickFrom(PRAISE)}`);
              winEl(el, 2, round);
            } else {
              Sound.boing(); wobbleEl(el);
              Voice.say(`That one is ${EMERALD_NAMES[i]}. Find the ${EMERALD_NAMES[target]} emerald!`);
            }
          };
          grid.appendChild(el);
        });
        setTimeout(() => Voice.say(`Find the ${EMERALD_NAMES[target]} Chaos Emerald!`), 300);
      }
      round();
    }
  });

  /* ============ 6. SHAPES — Sonic-world shapes ============ */
  def({
    id: 'shapes', label: 'Shapes', color: '#ab47bc',
    icon: () => `<svg viewBox="0 0 100 100"><circle cx="30" cy="32" r="18" fill="#f6b73c"/><rect x="55" y="16" width="32" height="32" rx="5" fill="#42a5f5"/><path d="M30 60 L48 92 L12 92 Z" fill="#e8554d"/><path d="M72 58 l5 10 11 1.5 -8 7.8 2 11 -10 -5.3 -10 5.3 2 -11 -8 -7.8 11 -1.5 Z" fill="#ab47bc"/></svg>`,
    start(stage) {
      const SHAPES = [
        { id: 'circle', name: 'circle', hint: 'A ring is a circle!', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="none" stroke="#f6b73c" stroke-width="16"/><circle cx="50" cy="50" r="34" fill="none" stroke="#fde9a8" stroke-width="5"/></svg>` },
        { id: 'square', name: 'square', hint: 'Item boxes are squares!', svg: `<svg viewBox="0 0 100 100"><rect x="16" y="16" width="68" height="68" rx="8" fill="#42a5f5" stroke="#1565c0" stroke-width="4"/><rect x="30" y="30" width="40" height="32" rx="4" fill="#dff3ff"/></svg>` },
        { id: 'triangle', name: 'triangle', hint: 'Spikes are triangles!', svg: `<svg viewBox="0 0 100 100"><path d="M50 12 L88 86 L12 86 Z" fill="#9aa3a8" stroke="#5f686d" stroke-width="4"/></svg>` },
        { id: 'star', name: 'star', hint: 'Like a star post!', svg: `<svg viewBox="0 0 100 100"><path d="M50 8 l11 25 27 3 -20 19 5.5 27 -23.5 -13.5 -23.5 13.5 5.5 -27 -20 -19 27 -3 Z" fill="#fdd835" stroke="#c9a514" stroke-width="3"/></svg>` },
        { id: 'diamond', name: 'diamond', hint: 'A Chaos Emerald is a diamond!', svg: `<svg viewBox="0 0 100 100"><path d="M50 8 L88 42 L50 94 L12 42 Z" fill="#4caf50" stroke="#1d6b21" stroke-width="3"/><path d="M50 8 L66 42 L50 94 L34 42 Z" fill="#fff" opacity="0.3"/></svg>` },
        { id: 'heart', name: 'heart', hint: 'Amy loves hearts!', svg: `<svg viewBox="0 0 100 100"><path d="M50 86 C20 62 12 40 26 26 C36 16 50 22 50 34 C50 22 64 16 74 26 C88 40 80 62 50 86 Z" fill="#f06292" stroke="#c2185b" stroke-width="3"/></svg>` }
      ];
      let streak = 0, locked = false;
      function round() {
        locked = false;
        const n = streak >= 4 ? 4 : 3;
        const opts = sample(SHAPES, n);
        const target = pickFrom(opts);
        stage.innerHTML = '<div class="grid find-grid size-4"></div>';
        const grid = stage.firstElementChild;
        opts.forEach((s) => {
          const el = card(s.svg);
          el.onclick = () => {
            if (locked) return;
            if (s.id === target.id) {
              locked = true; streak++;
              Voice.say(`Yes! That's the ${s.name}! ${s.hint}`);
              winEl(el, 2, round, 2200);
            } else {
              Sound.boing(); wobbleEl(el);
              Voice.say(`That's a ${s.name}. Find the ${target.name}!`);
            }
          };
          grid.appendChild(el);
        });
        setTimeout(() => Voice.say(`Find the ${target.name}!`), 300);
      }
      round();
    }
  });

  /* ============ 7. LETTERS — letters via character names ============ */
  def({
    id: 'letters', label: 'Letters', color: '#e8554d',
    icon: () => `<svg viewBox="0 0 100 100"><text x="50" y="72" font-size="64" text-anchor="middle" fill="#2563d8" font-weight="bold" font-family="Comic Sans MS, sans-serif">S</text></svg>`,
    start(stage) {
      const LETTER_CHAR = { A: 'amy', B: 'big', C: 'cream', D: 'eggman', E: 'espio', F: 'fang', G: 'gamma', H: 'honey', I: 'infinite', J: 'jet', K: 'knuckles', M: 'mighty', O: 'omega', R: 'rouge', S: 'sonic', T: 'tails', V: 'vector', W: 'wave' };
      const LETTERS = Object.keys(LETTER_CHAR);
      let streak = 0, locked = false;
      function round() {
        locked = false;
        const n = streak >= 4 ? 4 : 3;
        const opts = sample(LETTERS, n);
        const letter = pickFrom(opts);
        const c = charById(LETTER_CHAR[letter]);
        stage.innerHTML = '<div class="letter-stage"></div><div class="grid find-grid size-4 letter-grid"></div>';
        const top = stage.querySelector('.letter-stage');
        const grid = stage.querySelector('.letter-grid');
        opts.forEach((L) => {
          const el = card(`<span class="big-letter">${L}</span>`, 'char-card num-card');
          el.onclick = () => {
            if (locked) return;
            if (L === letter) {
              locked = true; streak++;
              top.innerHTML = `<div class="letter-reveal">${charArt(c)}</div>`;
              setTimeout(() => Voice.charSay(c, `${letter}! ${letter} is for ${c.speak}! That's me!`), 400);
              winEl(el, 2, round, 2800);
            } else {
              Sound.boing(); wobbleEl(el);
              Voice.say(`That's the letter ${L}. Find the letter ${letter}!`);
            }
          };
          grid.appendChild(el);
        });
        setTimeout(() => Voice.say(`Find the letter ${letter}! ${letter} is for ${c.speak}!`), 300);
      }
      round();
    }
  });

  /* ============ 8. HIDE — who ran away? (memory) ============ */
  def({
    id: 'hide', label: 'Who Left?', color: '#8d6e63',
    icon: () => `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="72" rx="40" ry="22" fill="#43a047"/><ellipse cx="30" cy="60" rx="22" ry="16" fill="#58b765"/><ellipse cx="68" cy="58" rx="24" ry="18" fill="#4caf50"/><circle cx="50" cy="34" r="16" fill="#2563d8"/><circle cx="44" cy="32" r="4" fill="#fff"/><circle cx="56" cy="32" r="4" fill="#fff"/></svg>`,
    start(stage) {
      let streak = 0;
      let timers = [];
      const later = (fn, ms) => timers.push(setTimeout(fn, ms));
      function round() {
        const n = streak >= 3 ? 4 : 3;
        const chars = sample(CHARACTERS, n);
        const missing = pickFrom(chars);
        const remaining = chars.filter((c) => c.id !== missing.id);
        stage.innerHTML = '<div class="hide-row"></div><div class="hide-question"></div>';
        const row = stage.firstElementChild;
        chars.forEach((c) => {
          const el = card(charArt(c));
          el.dataset.id = c.id;
          row.appendChild(el);
        });
        Voice.say(`Look carefully! ${chars.map((c) => c.speak).join(', ')}!`);
        later(() => {
          row.querySelectorAll('.char-card').forEach((el) => { el.innerHTML = cloudSVG(); el.classList.add('clouded'); });
          Sound.pop();
        }, n * 1200 + 1500);
        later(() => {
          row.innerHTML = '';
          remaining.forEach((c) => row.appendChild(card(charArt(c))));
          Voice.say('Who ran away?');
          const q = stage.querySelector('.hide-question');
          if (!q) return;
          q.innerHTML = '<div class="grid find-grid size-4"></div>';
          const grid = q.firstElementChild;
          let locked = false;
          shuffle([missing, ...sample(CHARACTERS.filter((c) => !chars.includes(c)), 2)]).forEach((c) => {
            const el = card(charArt(c));
            el.onclick = () => {
              if (locked) return;
              if (c.id === missing.id) {
                locked = true; streak++;
                Voice.charSay(c, `You remembered me! I'm ${c.speak}!`);
                winEl(el, 3, round, 2400);
              } else {
                streak = 0;
                Sound.boing(); wobbleEl(el);
                Voice.say('Hmm, look again! Who is not here anymore?');
              }
            };
            grid.appendChild(el);
          });
        }, n * 1200 + 3200);
      }
      round();
      return () => timers.forEach(clearTimeout);
    }
  });

  /* ============ 9. TEAMS — Sonic Heroes lore sorter ============ */
  def({
    id: 'teams', label: 'Teams', color: '#42a5f5',
    icon: () => `<svg viewBox="0 0 100 100"><path d="M40 8 L24 52 L40 52 L32 92 L66 40 L48 40 L60 8 Z" fill="#fdd835" stroke="#c9a514" stroke-width="3"/></svg>`,
    start(stage) {
      const TEAMS = [
        { id: 'speed', name: 'Speed', why: 'runs super fast', color: '#2563d8', icon: `<svg viewBox="0 0 100 100"><path d="M40 8 L24 52 L40 52 L32 92 L66 40 L48 40 L60 8 Z" fill="#fff"/></svg>` },
        { id: 'fly', name: 'Fly', why: 'can fly high', color: '#ab47bc', icon: `<svg viewBox="0 0 100 100"><path d="M50 30 Q20 8 8 28 Q26 30 36 44 Q20 44 14 56 Q34 56 44 50 L50 70 L56 50 Q66 56 86 56 Q80 44 64 44 Q74 30 92 28 Q80 8 50 30 Z" fill="#fff"/></svg>` },
        { id: 'power', name: 'Power', why: 'is super strong', color: '#e8554d', icon: `<svg viewBox="0 0 100 100"><path d="M30 45 Q28 25 45 25 L45 20 Q45 12 53 12 Q61 12 61 20 L61 26 Q72 28 72 40 L72 60 Q72 80 52 80 L44 80 Q30 80 30 62 Z" fill="#fff"/><line x1="42" y1="38" x2="42" y2="50" stroke="#e8554d" stroke-width="5" stroke-linecap="round"/><line x1="52" y1="36" x2="52" y2="50" stroke="#e8554d" stroke-width="5" stroke-linecap="round"/></svg>` }
      ];
      let locked = false;
      function round() {
        locked = false;
        const c = pickFrom(CHARACTERS);
        stage.innerHTML = `<div class="team-stage"><div class="team-char">${charArt(c)}</div></div><div class="team-row"></div>`;
        const row = stage.querySelector('.team-row');
        TEAMS.forEach((t) => {
          const el = card(`${t.icon}<span class="team-label">${t.name}</span>`, 'char-card team-card');
          el.style.background = t.color;
          el.onclick = () => {
            if (locked) return;
            if (t.id === c.team) {
              locked = true;
              Voice.say(`Yes! ${c.speak} is on team ${t.name}, because ${c.speak} ${t.why}!`);
              winEl(el, 2, round, 2800);
            } else {
              Sound.boing(); wobbleEl(el);
              Voice.say(`Hmm, not team ${t.name}. Try another!`);
            }
          };
          row.appendChild(el);
        });
        setTimeout(() => Voice.say(`Is ${c.speak} on team Speed, team Fly, or team Power?`), 300);
      }
      round();
    }
  });

  /* ============ 10. PATTERN — what comes next? ============ */
  def({
    id: 'pattern', label: 'Pattern', color: '#26c6da',
    icon: () => `<svg viewBox="0 0 100 100"><circle cx="20" cy="50" r="13" fill="none" stroke="#f6b73c" stroke-width="8"/><path d="M50 36 L62 47 L50 66 L38 47 Z" fill="#4caf50"/><circle cx="82" cy="50" r="13" fill="none" stroke="#f6b73c" stroke-width="8"/></svg>`,
    start(stage) {
      const ICONS = [
        { id: 'ring', name: 'ring', svg: Rewards.ringSVG(56) },
        { id: 'emerald', name: 'emerald', svg: Rewards.emeraldSVG('#4caf50', 56) },
        { id: 'star', name: 'star', svg: `<svg viewBox="0 0 24 24" width="56" height="56"><path d="M12 2 l2.9 6.2 6.8 0.8 -5 4.6 1.3 6.7 -6 -3.3 -6 3.3 1.3 -6.7 -5 -4.6 6.8 -0.8 Z" fill="#fdd835" stroke="#c9a514"/></svg>` },
        { id: 'chao', name: 'chao', svg: `<svg viewBox="0 0 24 24" width="56" height="56"><ellipse cx="12" cy="14" rx="8" ry="7" fill="#8fd8ec" stroke="#4ba3bd"/><circle cx="12" cy="4.5" r="2.2" fill="#fdd835"/><circle cx="9.5" cy="13" r="1" fill="#222"/><circle cx="14.5" cy="13" r="1" fill="#222"/></svg>` }
      ];
      let streak = 0, locked = false;
      function round() {
        locked = false;
        const k = streak >= 4 ? 3 : 2; // AB or ABC pattern
        const units = sample(ICONS, k);
        const seqLen = k === 2 ? 5 : 6;
        const seq = [...Array(seqLen)].map((_, i) => units[i % k]);
        const answer = units[seqLen % k];
        stage.innerHTML = '<div class="pattern-row"></div><div class="answer-row"></div>';
        const row = stage.querySelector('.pattern-row');
        seq.forEach((u) => { const s = document.createElement('span'); s.className = 'pattern-item'; s.innerHTML = u.svg; row.appendChild(s); });
        const q = document.createElement('span');
        q.className = 'pattern-item pattern-q';
        q.textContent = '?';
        row.appendChild(q);
        const choices = shuffle(units.length >= 3 ? units : sample(ICONS.filter(i => !units.includes(i)), 1).concat(units));
        const ans = stage.querySelector('.answer-row');
        choices.forEach((u) => {
          const el = card(u.svg, 'char-card num-card');
          el.onclick = () => {
            if (locked) return;
            if (u.id === answer.id) {
              locked = true; streak++;
              q.innerHTML = u.svg; q.classList.remove('pattern-q');
              Voice.say(`Yes! A ${u.name} comes next! ${pickFrom(PRAISE)}`);
              winEl(el, 3, round, 2400);
            } else {
              Sound.boing(); wobbleEl(el);
              Voice.say('Look at the pattern again! What comes next?');
            }
          };
          ans.appendChild(el);
        });
        setTimeout(() => Voice.say(`${seq.map((u) => u.name).join(', ')}... What comes next?`), 300);
      }
      round();
    }
  });

  /* ============ 11. SIZE — biggest / smallest ============ */
  def({
    id: 'size', label: 'Big & Small', color: '#7e57c2',
    icon: () => `<svg viewBox="0 0 100 100"><circle cx="30" cy="62" r="26" fill="#7e57c2"/><circle cx="72" cy="74" r="14" fill="#9575cd"/><circle cx="86" cy="84" r="7" fill="#b39ddb"/></svg>`,
    start(stage) {
      let locked = false;
      function round() {
        locked = false;
        const c = pickFrom(CHARACTERS);
        const wantBig = Math.random() < 0.5;
        const scales = shuffle([1.0, 0.66, 0.4]);
        stage.innerHTML = '<div class="size-row"></div>';
        const row = stage.firstElementChild;
        scales.forEach((s) => {
          const el = card(charArt(c), 'char-card size-card');
          el.style.setProperty('--scale', s);
          el.onclick = () => {
            if (locked) return;
            const correct = wantBig ? s === 1.0 : s === 0.4;
            if (correct) {
              locked = true;
              Voice.say(`Yes! That's the ${wantBig ? 'biggest' : 'smallest'} ${c.speak}! ${pickFrom(PRAISE)}`);
              winEl(el, 2, round, 2200);
            } else {
              Sound.boing(); wobbleEl(el);
              Voice.say(`Hmm, find the ${wantBig ? 'BIGGEST' : 'smallest'} one!`);
            }
          };
          row.appendChild(el);
        });
        setTimeout(() => Voice.say(`Tap the ${wantBig ? 'BIGGEST' : 'SMALLEST'} ${c.speak}!`), 300);
      }
      round();
    }
  });

  /* ============ 12. CHAO — listen-and-repeat (Simon) ============ */
  def({
    id: 'chao', label: 'Chao Song', color: '#8fd8ec',
    icon: () => `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="30" ry="26" fill="#8fd8ec" stroke="#4ba3bd" stroke-width="3"/><circle cx="50" cy="20" r="8" fill="#fdd835"/><circle cx="40" cy="54" r="4" fill="#222"/><circle cx="60" cy="54" r="4" fill="#222"/><path d="M42 66 Q50 72 58 66" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round"/><text x="80" y="36" font-size="26" fill="#4ba3bd">♪</text></svg>`,
    start(stage) {
      const COLORS = ['#42a5f5', '#fdd835', '#f06292', '#66bb6a'];
      let seq = [], pos = 0, playing = false, len = 2;
      let timers = [];
      const later = (fn, ms) => timers.push(setTimeout(fn, ms));
      stage.innerHTML = '<div class="chao-row"></div><div class="chao-msg"></div>';
      const row = stage.querySelector('.chao-row');
      const buttons = COLORS.map((color, i) => {
        const el = card(`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="30" ry="26" fill="${color}" stroke="rgba(0,0,0,0.25)" stroke-width="3"/><circle cx="50" cy="22" r="8" fill="#fdd835"/><circle cx="41" cy="54" r="4" fill="#222"/><circle cx="59" cy="54" r="4" fill="#222"/><path d="M42 66 Q50 72 58 66" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round"/></svg>`, 'char-card chao-card');
        el.onclick = () => {
          if (playing) return;
          flash(i);
          if (i === seq[pos]) {
            pos++;
            if (pos === seq.length) {
              Rewards.addRings(seq.length);
              if (len >= 6) {
                Sound.fanfare(); confettiBurst(140);
                Voice.say('You learned the whole chao song! Amazing ears!');
                len = 2;
                later(newGame, 3200);
              } else {
                Voice.say(pickFrom(PRAISE) + ' Now a longer song!');
                len++;
                later(newGame, 2200);
              }
            }
          } else {
            Sound.boing();
            Voice.say('Oops! Listen one more time!');
            later(() => playSeq(), 1800);
          }
        };
        row.appendChild(el);
        return el;
      });
      function flash(i) {
        Sound.note(i);
        buttons[i].classList.add('lit');
        later(() => buttons[i].classList.remove('lit'), 380);
      }
      function playSeq() {
        playing = true; pos = 0;
        seq.forEach((b, i) => later(() => flash(b), 700 + i * 650));
        later(() => { playing = false; Voice.say('Your turn!'); }, 700 + seq.length * 650);
      }
      function newGame() {
        seq = [...Array(len)].map(() => Math.floor(Math.random() * 4));
        Voice.say('Listen to the chao sing!');
        later(playSeq, 1400);
      }
      newGame();
      return () => timers.forEach(clearTimeout);
    }
  });

  /* ============ 13. BOP — badnik whack-a-mole ============ */
  def({
    id: 'bop', label: 'Badnik Bop', color: '#e53935',
    icon: () => badnikSVG(),
    start(stage) {
      let timers = [], score = 0, running = true;
      const later = (fn, ms) => timers.push(setTimeout(fn, ms));
      stage.innerHTML = `<div class="bop-score">${badnikSVG(34)}<b id="bopCount">0</b></div><div class="bop-grid"></div>`;
      const grid = stage.querySelector('.bop-grid');
      const holes = [...Array(6)].map(() => {
        const h = document.createElement('div');
        h.className = 'bop-hole';
        h.innerHTML = '<div class="bop-dirt"></div><button class="bop-thing"></button>';
        grid.appendChild(h);
        return h.querySelector('.bop-thing');
      });
      function popUp() {
        if (!running) return;
        const free = holes.filter((h) => !h.classList.contains('up'));
        if (free.length) {
          const h = pickFrom(free);
          const isFriend = Math.random() < 0.25;
          h.dataset.friend = isFriend ? '1' : '';
          h.innerHTML = isFriend ? flickySVG() : badnikSVG();
          h.classList.add('up');
          later(() => h.classList.remove('up'), 1400);
        }
        later(popUp, 700 + Math.random() * 500);
      }
      holes.forEach((h) => {
        h.onclick = () => {
          if (!h.classList.contains('up')) return;
          if (h.dataset.friend) {
            Sound.boing();
            Voice.say("Oh no, that's a little friend! Don't bop friends!");
          } else {
            score++;
            Sound.bop();
            const counter = stage.querySelector('#bopCount');
            if (counter) counter.textContent = score;
          }
          h.classList.remove('up');
        };
      });
      Voice.say("Bop Eggman's badniks! But don't bop the little birdies!");
      later(popUp, 2200);
      later(() => {
        running = false;
        const rings = Math.max(1, Math.floor(score / 2));
        Sound.fanfare(); confettiBurst(120);
        Voice.say(`Time's up! You bopped ${score} badniks! Doctor Eggman is so mad!`);
        Rewards.addRings(rings);
        later(() => Games.start('bop', stage), 4200);
      }, 27000);
      return () => { running = false; timers.forEach(clearTimeout); };
    }
  });

  /* ============ 14. PUZZLE — fix the picture ============ */
  def({
    id: 'puzzle', label: 'Puzzle', color: '#5c6bc0',
    icon: () => `<svg viewBox="0 0 100 100"><rect x="12" y="12" width="37" height="37" fill="#42a5f5" rx="5"/><rect x="51" y="12" width="37" height="37" fill="#66bb6a" rx="5"/><rect x="12" y="51" width="37" height="37" fill="#fdd835" rx="5"/><rect x="51" y="51" width="37" height="37" rx="5" fill="#eee" stroke="#999" stroke-dasharray="6 4" stroke-width="3"/><text x="69" y="79" font-size="28" text-anchor="middle" fill="#999" font-weight="bold">?</text></svg>`,
    start(stage) {
      let locked = false;
      const quad = (c, qi) => {
        const x = qi % 2 ? 50 : 0, y = qi > 1 ? 50 : 0;
        return `<svg viewBox="${x} ${y} 50 50"><circle cx="50" cy="50" r="47" fill="${c.color}" opacity="0.16"/>${c.art}</svg>`;
      };
      function round() {
        locked = false;
        const c = pickFrom(CHARACTERS.filter((x) => !x.imgUrl)); // quadrant trick needs SVG art
        const qi = Math.floor(Math.random() * 4);
        stage.innerHTML = `<div class="puzzle-board"></div><div class="answer-row"></div>`;
        const board = stage.querySelector('.puzzle-board');
        for (let i = 0; i < 4; i++) {
          const cell = document.createElement('div');
          cell.className = 'puzzle-cell';
          cell.innerHTML = i === qi ? '<span class="puzzle-q">?</span>' : quad(c, i);
          board.appendChild(cell);
        }
        const decoys = sample(CHARACTERS.filter((x) => x.id !== c.id && !x.imgUrl), 2);
        const row = stage.querySelector('.answer-row');
        shuffle([c, ...decoys]).forEach((cc) => {
          const el = card(quad(cc, qi), 'char-card piece-card');
          el.onclick = () => {
            if (locked) return;
            if (cc.id === c.id) {
              locked = true;
              board.children[qi].innerHTML = quad(c, qi);
              Voice.charSay(c, `You fixed my picture! I'm ${c.speak}!`);
              winEl(el, 3, round, 2600);
            } else {
              Sound.boing(); wobbleEl(el);
              Voice.say("That piece doesn't fit! Look at the colors!");
            }
          };
          row.appendChild(el);
        });
        setTimeout(() => Voice.say('Uh oh, a piece is missing! Which piece fixes the picture?'), 300);
      }
      round();
    }
  });

  /* ============ 15. MATH — ring addition ============ */
  def({
    id: 'math', label: 'Ring Math', color: '#00897b',
    icon: () => `<svg viewBox="0 0 100 100"><circle cx="26" cy="38" r="13" fill="none" stroke="#f6b73c" stroke-width="8"/><text x="50" y="50" font-size="36" text-anchor="middle" fill="#00695c" font-weight="bold">+</text><circle cx="74" cy="38" r="13" fill="none" stroke="#f6b73c" stroke-width="8"/><text x="50" y="92" font-size="30" text-anchor="middle" fill="#00695c" font-weight="bold">= ?</text></svg>`,
    start(stage) {
      let best = 0, locked = false;
      function round() {
        locked = false;
        const cap = best >= 4 ? 10 : 5;
        const a = 1 + Math.floor(Math.random() * (cap - 2));
        const b = 1 + Math.floor(Math.random() * Math.min(cap - a, 4));
        const sum = a + b;
        const answers = shuffle([sum, ...sample([...Array(cap).keys()].map(i => i + 1).filter(x => x !== sum), 2)]);
        const group = (n) => `<span class="math-group">${[...Array(n)].map(() => Rewards.ringSVG(40)).join('')}</span>`;
        stage.innerHTML = `<div class="math-row">${group(a)}<span class="math-op">+</span>${group(b)}<span class="math-op">=</span><span class="math-op">?</span></div><div class="answer-row"></div>`;
        const row = stage.querySelector('.answer-row');
        answers.forEach((n) => {
          const el = card(`<span class="big-num">${n}</span>`, 'char-card num-card');
          el.onclick = () => {
            if (locked) return;
            Voice.say(`${n}`);
            if (n === sum) {
              locked = true; best++;
              setTimeout(() => Voice.say(`Yes! ${a} plus ${b} is ${sum}! ${pickFrom(PRAISE)}`), 500);
              winEl(el, 3, round, 2600);
            } else {
              Sound.boing(); wobbleEl(el);
              setTimeout(() => Voice.say('Count all the rings together and try again!'), 500);
            }
          };
          row.appendChild(el);
        });
        Voice.say(`${a} ring${a > 1 ? 's' : ''} plus ${b} ring${b > 1 ? 's' : ''}. How many rings altogether?`);
      }
      round();
    }
  });

  /* ---------- tiny shared art ---------- */
  function speakerIcon() {
    return `<svg viewBox="0 0 24 24"><path d="M4 9 H8 L13 4 V20 L8 15 H4 Z" fill="#fff"/><path d="M16 8 Q19 12 16 16 M18.5 5.5 Q23 12 18.5 18.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`;
  }
  function cloudSVG() {
    return `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="36" ry="22" fill="#fff"/><circle cx="32" cy="48" r="16" fill="#fff"/><circle cx="56" cy="42" r="20" fill="#fff"/><circle cx="74" cy="52" r="14" fill="#fff"/></svg>`;
  }
  function badnikSVG(size) {
    const s = size ? `width="${size}" height="${size}"` : '';
    return `<svg viewBox="0 0 100 100" ${s}><ellipse cx="50" cy="52" rx="28" ry="22" fill="#e53935" stroke="#8e1420" stroke-width="3"/><circle cx="40" cy="48" r="7" fill="#fff"/><circle cx="60" cy="48" r="7" fill="#fff"/><circle cx="40" cy="49" r="3" fill="#222"/><circle cx="60" cy="49" r="3" fill="#222"/><path d="M30 30 Q24 16 34 14 M70 30 Q76 16 66 14" fill="none" stroke="#8e1420" stroke-width="4" stroke-linecap="round"/><circle cx="34" cy="13" r="4" fill="#f6b73c"/><circle cx="66" cy="13" r="4" fill="#f6b73c"/><circle cx="36" cy="78" r="9" fill="#444"/><circle cx="64" cy="78" r="9" fill="#444"/><rect x="40" y="60" width="20" height="5" rx="2.5" fill="#8e1420"/></svg>`;
  }
  function flickySVG() {
    return `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="24" fill="#42a5f5" stroke="#1565c0" stroke-width="3"/><circle cx="50" cy="30" r="14" fill="#42a5f5" stroke="#1565c0" stroke-width="3"/><circle cx="45" cy="28" r="3" fill="#222"/><circle cx="55" cy="28" r="3" fill="#222"/><path d="M46 35 L54 35 L50 41 Z" fill="#f6a51c"/><path d="M26 52 Q12 44 16 32 Q26 38 32 46 Z" fill="#64b5f6"/><path d="M74 52 Q88 44 84 32 Q74 38 68 46 Z" fill="#64b5f6"/><path d="M40 14 Q44 4 50 10 Q54 4 60 14" fill="none" stroke="#1565c0" stroke-width="3" stroke-linecap="round"/></svg>`;
  }

  let activeCleanup = null;
  function start(id, stage) {
    if (activeCleanup) { activeCleanup(); activeCleanup = null; }
    const g = list.find((x) => x.id === id);
    if (!g) return;
    const cleanup = g.start(stage);
    if (typeof cleanup === 'function') activeCleanup = cleanup;
  }
  function stop() {
    if (activeCleanup) { activeCleanup(); activeCleanup = null; }
  }

  return { list, start, stop };
})();
