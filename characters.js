/* Sonic Friends — character roster + hand-drawn SVG portraits.
   Every portrait lives in a 100x100 viewBox with the head centred near (50, 55).
   Each character is { id, name, speak, tag, color, art }. */

/* ---------- shared face-part helpers ---------- */

function eyes(iris, opts = {}) {
  const { dx = 10, y = 51, rx = 6.5, ry = 9.5, angry = false, slit = false } = opts;
  const xs = [50 - dx, 50 + dx];
  let s = '';
  for (const x of xs) {
    s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" stroke="#222" stroke-width="1.5"/>`;
    s += `<circle cx="${x}" cy="${y + 3}" r="3.4" fill="${iris}"/>`;
    s += slit
      ? `<rect x="${x - 0.8}" y="${y - 0.5}" width="1.6" height="7" rx="0.8" fill="#111"/>`
      : `<circle cx="${x}" cy="${y + 3}" r="1.6" fill="#111"/>`;
    s += `<circle cx="${x - 1.4}" cy="${y + 1}" r="1" fill="#fff"/>`;
  }
  if (angry) {
    s += `<path d="M${xs[0] - 7},${y - 12} L${xs[0] + 5},${y - 6}" stroke="#222" stroke-width="2.6" stroke-linecap="round"/>`;
    s += `<path d="M${xs[1] + 7},${y - 12} L${xs[1] - 5},${y - 6}" stroke="#222" stroke-width="2.6" stroke-linecap="round"/>`;
  }
  return s;
}

function smile(y = 70, w = 7) {
  return `<path d="M${50 - w},${y} Q50,${y + 6} ${50 + w},${y}" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"/>`;
}

function muzzle(color = '#f8d9a8', opts = {}) {
  const { y = 66, rx = 13, ry = 9, nose = '#222', mouth = true } = opts;
  return `<ellipse cx="50" cy="${y}" rx="${rx}" ry="${ry}" fill="${color}"/>`
    + `<ellipse cx="50" cy="${y - 5.5}" rx="2.6" ry="2" fill="${nose}"/>`
    + (mouth ? smile(y + 3) : '');
}

function head(color, stroke, opts = {}) {
  const { cx = 50, cy = 55, r = 27 } = opts;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" stroke="${stroke}" stroke-width="2"/>`;
}

/* ---------- the roster ---------- */

const CHARACTERS = [
  {
    id: 'sonic', name: 'Sonic', speak: 'Sonic', tag: 'The fastest hedgehog!', color: '#2563d8',
    art: `
      <g fill="#2563d8" stroke="#173f96" stroke-width="2" stroke-linejoin="round">
        <path d="M28,36 L6,24 L27,46 Z"/><path d="M22,50 L0,46 L22,60 Z"/><path d="M25,62 L5,70 L29,72 Z"/>
        <path d="M72,36 L94,24 L73,46 Z"/><path d="M78,50 L100,46 L78,60 Z"/><path d="M75,62 L95,70 L71,72 Z"/>
        <path d="M40,32 L33,9 L50,28 Z"/><path d="M52,28 L63,8 L62,32 Z"/>
      </g>
      <path d="M31,35 L25,16 L43,27 Z" fill="#2563d8" stroke="#173f96" stroke-width="2"/>
      <path d="M69,35 L75,16 L57,27 Z" fill="#2563d8" stroke="#173f96" stroke-width="2"/>
      <path d="M31,31 L28,21 L39,27 Z" fill="#f8d9a8"/>
      <path d="M69,31 L72,21 L61,27 Z" fill="#f8d9a8"/>
      ${head('#2563d8', '#173f96')}
      ${muzzle('#f8d9a8')}
      ${eyes('#14a83b')}`
  },
  {
    id: 'tails', name: 'Tails', speak: 'Tails', tag: 'The flying fox!', color: '#f5a623',
    art: `
      <g stroke="#c07c0e" stroke-width="2" stroke-linejoin="round">
        <path d="M30,86 Q10,80 8,56 Q24,62 34,74 Z" fill="#f5a623"/>
        <path d="M70,86 Q90,80 92,56 Q76,62 66,74 Z" fill="#f5a623"/>
      </g>
      <path d="M9,58 Q18,61 23,66 Q15,67 11,64 Z" fill="#fff"/>
      <path d="M91,58 Q82,61 77,66 Q85,67 89,64 Z" fill="#fff"/>
      <path d="M31,36 L23,6 L48,24 Z" fill="#f5a623" stroke="#c07c0e" stroke-width="2" stroke-linejoin="round"/>
      <path d="M69,36 L77,6 L52,24 Z" fill="#f5a623" stroke="#c07c0e" stroke-width="2" stroke-linejoin="round"/>
      <path d="M31,30 L27,14 L41,24 Z" fill="#fff"/>
      <path d="M69,30 L73,14 L59,24 Z" fill="#fff"/>
      ${head('#f5a623', '#c07c0e')}
      <path d="M40,32 L44,24 L48,32 Z M48,31 L52,23 L56,31 Z" fill="#f5a623" stroke="#c07c0e" stroke-width="1.5"/>
      <ellipse cx="50" cy="66" rx="15" ry="10" fill="#fff"/>
      <ellipse cx="50" cy="60" rx="2.6" ry="2" fill="#222"/>
      ${smile(69)}
      ${eyes('#2e7bd6')}`
  },
  {
    id: 'knuckles', name: 'Knuckles', speak: 'Knuckles', tag: 'The strong echidna!', color: '#d6243c',
    art: `
      <g fill="#d6243c" stroke="#8e1426" stroke-width="2" stroke-linejoin="round">
        <path d="M30,40 Q12,46 11,74 Q23,76 31,58 Z"/>
        <path d="M70,40 Q88,46 89,74 Q77,76 69,58 Z"/>
        <path d="M36,56 Q28,70 31,88 Q42,84 44,66 Z"/>
        <path d="M64,56 Q72,70 69,88 Q58,84 56,66 Z"/>
        <path d="M42,30 L38,10 L52,27 Z"/><path d="M54,27 L62,9 L60,30 Z"/>
      </g>
      ${head('#d6243c', '#8e1426')}
      ${muzzle('#f8d9a8')}
      ${eyes('#7b1fa2')}`
  },
  {
    id: 'amy', name: 'Amy', speak: 'Amy', tag: 'With her piko piko hammer!', color: '#f06292',
    art: `
      <g fill="#f06292" stroke="#c2185b" stroke-width="2" stroke-linejoin="round">
        <path d="M29,42 Q10,50 15,74 Q30,73 34,54 Z"/>
        <path d="M71,42 Q90,50 85,74 Q70,73 66,54 Z"/>
      </g>
      ${head('#f06292', '#c2185b')}
      <path d="M27,40 Q50,15 73,40" fill="none" stroke="#e8334a" stroke-width="8" stroke-linecap="round"/>
      ${muzzle('#f8d9a8')}
      ${eyes('#14a83b')}`
  },
  {
    id: 'shadow', name: 'Shadow', speak: 'Shadow', tag: 'The ultimate life form!', color: '#33333d',
    art: `
      <g fill="#33333d" stroke="#111118" stroke-width="2" stroke-linejoin="round">
        <path d="M32,40 L8,14 L36,48 Z"/><path d="M26,52 L2,38 L26,62 Z"/>
        <path d="M68,40 L92,14 L64,48 Z"/><path d="M74,52 L98,38 L74,62 Z"/>
        <path d="M42,30 L36,8 L52,27 Z"/><path d="M54,27 L64,8 L60,30 Z"/>
      </g>
      <path d="M30,42 L13,20" stroke="#e53935" stroke-width="3" stroke-linecap="round"/>
      <path d="M70,42 L87,20" stroke="#e53935" stroke-width="3" stroke-linecap="round"/>
      <path d="M44,27 L39,12" stroke="#e53935" stroke-width="3" stroke-linecap="round"/>
      <path d="M56,27 L61,12" stroke="#e53935" stroke-width="3" stroke-linecap="round"/>
      ${head('#33333d', '#111118')}
      <path d="M34,80 L42,71 L50,82 L58,71 L66,80 Q50,90 34,80 Z" fill="#fff" stroke="#cfcfcf" stroke-width="1.5"/>
      ${muzzle('#f8d9a8')}
      ${eyes('#e53935', { angry: true })}`
  },
  {
    id: 'rouge', name: 'Rouge', speak: 'Rouge', tag: 'The jewel bat!', color: '#e3b8d4',
    art: `
      <path d="M31,38 L20,2 L49,24 Z" fill="#fff" stroke="#bdbdbd" stroke-width="2" stroke-linejoin="round"/>
      <path d="M69,38 L80,2 L51,24 Z" fill="#fff" stroke="#bdbdbd" stroke-width="2" stroke-linejoin="round"/>
      <path d="M32,32 L25,11 L43,25 Z" fill="#f3b8cf"/>
      <path d="M68,32 L75,11 L57,25 Z" fill="#f3b8cf"/>
      ${head('#f3d9b3', '#cfa468')}
      <path d="M36,32 Q46,20 62,28 Q52,28 46,34 Q42,30 36,32 Z" fill="#fff" stroke="#cfcfcf" stroke-width="1.5"/>
      <path d="M32,43 Q40,37 47,42" fill="none" stroke="#7d8fd8" stroke-width="4" stroke-linecap="round"/>
      <path d="M68,43 Q60,37 53,42" fill="none" stroke="#7d8fd8" stroke-width="4" stroke-linecap="round"/>
      ${eyes('#26a69a')}
      <ellipse cx="50" cy="61" rx="2.4" ry="1.8" fill="#222"/>
      <path d="M43,70 Q50,76 57,70" fill="none" stroke="#d6336c" stroke-width="3" stroke-linecap="round"/>
      <path d="M40,86 Q50,78 60,86 Q50,94 40,86 Z" fill="#e84a8a" stroke="#b03060" stroke-width="1.5"/>`
  },
  {
    id: 'omega', name: 'Omega', speak: 'Omega', tag: 'The powerful robot!', color: '#c0392b',
    art: `
      <line x1="50" y1="22" x2="50" y2="12" stroke="#555" stroke-width="3"/>
      <circle cx="50" cy="10" r="4" fill="#f1c40f" stroke="#9c7b08" stroke-width="1.5"/>
      <rect x="24" y="24" width="52" height="52" rx="10" fill="#c0392b" stroke="#7f1d1d" stroke-width="2.5"/>
      <rect x="18" y="40" width="8" height="20" rx="3" fill="#7f8c8d" stroke="#555" stroke-width="1.5"/>
      <rect x="74" y="40" width="8" height="20" rx="3" fill="#7f8c8d" stroke="#555" stroke-width="1.5"/>
      <rect x="30" y="38" width="40" height="16" rx="7" fill="#1a1a1a"/>
      <circle cx="40" cy="46" r="7" fill="#ff5252" opacity="0.35"/>
      <circle cx="60" cy="46" r="7" fill="#ff5252" opacity="0.35"/>
      <circle cx="40" cy="46" r="4" fill="#ff5252"/><circle cx="60" cy="46" r="4" fill="#ff5252"/>
      <rect x="30" y="60" width="40" height="6" rx="3" fill="#f1c40f"/>
      <g stroke="#7f1d1d" stroke-width="2" stroke-linecap="round">
        <line x1="38" y1="70" x2="38" y2="73"/><line x1="46" y1="70" x2="46" y2="73"/>
        <line x1="54" y1="70" x2="54" y2="73"/><line x1="62" y1="70" x2="62" y2="73"/>
      </g>`
  },
  {
    id: 'silver', name: 'Silver', speak: 'Silver', tag: 'The hedgehog from the future!', color: '#b0bec5',
    art: `
      <g fill="#cfd8dc" stroke="#78909c" stroke-width="2" stroke-linejoin="round">
        <path d="M24,52 L4,42 L25,64 Z"/><path d="M76,52 L96,42 L75,64 Z"/>
        <path d="M40,36 L26,10 L48,31 Z"/>
        <path d="M47,31 L50,2 L56,30 Z"/>
        <path d="M55,31 L74,10 L60,36 Z"/>
      </g>
      ${head('#cfd8dc', '#78909c')}
      <path d="M36,80 L43,72 L50,83 L57,72 L64,80 Q50,89 36,80 Z" fill="#fff" stroke="#cfcfcf" stroke-width="1.5"/>
      ${muzzle('#f8d9a8')}
      ${eyes('#e6a817')}`
  },
  {
    id: 'blaze', name: 'Blaze', speak: 'Blaze', tag: 'The fire princess!', color: '#9575cd',
    art: `
      <circle cx="50" cy="19" r="10" fill="#6a4aa3" stroke="#4a3375" stroke-width="2"/>
      <rect x="42" y="25" width="16" height="5" rx="2.5" fill="#e53935"/>
      <path d="M30,38 L24,16 L44,28 Z" fill="#9575cd" stroke="#5e35b1" stroke-width="2" stroke-linejoin="round"/>
      <path d="M70,38 L76,16 L56,28 Z" fill="#9575cd" stroke="#5e35b1" stroke-width="2" stroke-linejoin="round"/>
      <path d="M31,33 L28,21 L39,27 Z" fill="#6a4aa3"/>
      <path d="M69,33 L72,21 L61,27 Z" fill="#6a4aa3"/>
      ${head('#9575cd', '#5e35b1')}
      <circle cx="50" cy="38" r="3.6" fill="#e53935" stroke="#9c1f1f" stroke-width="1.2"/>
      <ellipse cx="50" cy="66" rx="13" ry="9" fill="#fff"/>
      <ellipse cx="50" cy="60.5" rx="2.4" ry="1.9" fill="#222"/>
      ${smile(69)}
      ${eyes('#e6a817')}`
  },
  {
    id: 'marine', name: 'Marine', speak: 'Marine', tag: 'The raccoon sailor!', color: '#e08840',
    art: `
      <path d="M32,34 L26,10 L46,26 Z" fill="#e08840" stroke="#a85c1d" stroke-width="2" stroke-linejoin="round"/>
      <path d="M68,34 L74,10 L54,26 Z" fill="#e08840" stroke="#a85c1d" stroke-width="2" stroke-linejoin="round"/>
      <path d="M33,30 L29,16 L41,25 Z" fill="#8d5524"/>
      <path d="M67,30 L71,16 L59,25 Z" fill="#8d5524"/>
      ${head('#e08840', '#a85c1d')}
      <path d="M42,31 L46,22 L50,31 Z M50,30 L55,21 L58,30 Z" fill="#c96a28"/>
      <ellipse cx="39" cy="51" rx="10.5" ry="13" fill="#7a4a21"/>
      <ellipse cx="61" cy="51" rx="10.5" ry="13" fill="#7a4a21"/>
      ${muzzle('#f7dcb8')}
      ${eyes('#2e7bd6')}`
  },
  {
    id: 'cream', name: 'Cream & Cheese', speak: 'Cream and Cheese', tag: 'The bunny and her chao!', color: '#f6ddae',
    art: `
      <path d="M37,32 Q26,-2 15,10 Q11,40 33,52 Z" fill="#f8ecd4" stroke="#cfa468" stroke-width="2" stroke-linejoin="round"/>
      <path d="M63,32 Q74,-2 85,10 Q89,40 67,52 Z" fill="#f8ecd4" stroke="#cfa468" stroke-width="2" stroke-linejoin="round"/>
      <path d="M31,30 Q24,10 19,14 Q18,34 30,42 Z" fill="#f5a623"/>
      <path d="M69,30 Q76,10 81,14 Q82,34 70,42 Z" fill="#f5a623"/>
      ${head('#f8ecd4', '#cfa468')}
      <ellipse cx="38" cy="50" rx="7" ry="10" fill="#f5a623" opacity="0.55"/>
      <ellipse cx="62" cy="50" rx="7" ry="10" fill="#f5a623" opacity="0.55"/>
      ${muzzle('#fff', { nose: '#d96a47' })}
      ${eyes('#6d4c41')}
      <g>
        <ellipse cx="85" cy="77" rx="9" ry="8" fill="#8fd8ec" stroke="#4ba3bd" stroke-width="1.5"/>
        <circle cx="85" cy="64" r="3" fill="#fdd835" stroke="#c9a514" stroke-width="1"/>
        <circle cx="82" cy="76" r="1.2" fill="#222"/><circle cx="88" cy="76" r="1.2" fill="#222"/>
        <path d="M82,80 Q85,82 88,80" fill="none" stroke="#222" stroke-width="1.2" stroke-linecap="round"/>
      </g>`
  },
  {
    id: 'big', name: 'Big', speak: 'Big', tag: 'The friendly fisher cat!', color: '#7e57c2',
    art: `
      <path d="M28,36 L20,4 L46,24 Z" fill="#7e57c2" stroke="#4d2d91" stroke-width="2" stroke-linejoin="round"/>
      <path d="M72,36 L80,4 L54,24 Z" fill="#7e57c2" stroke="#4d2d91" stroke-width="2" stroke-linejoin="round"/>
      <path d="M27,26 L23,10 L37,21 Z" fill="#f5a623"/>
      <path d="M73,26 L77,10 L63,21 Z" fill="#f5a623"/>
      <ellipse cx="50" cy="56" rx="31" ry="27" fill="#7e57c2" stroke="#4d2d91" stroke-width="2"/>
      <ellipse cx="50" cy="68" rx="17" ry="12" fill="#f3e0c0"/>
      <ellipse cx="50" cy="61" rx="3.4" ry="2.6" fill="#222"/>
      ${smile(72, 8)}
      ${eyes('#e6a817', { y: 48 })}`
  },
  {
    id: 'vector', name: 'Vector', speak: 'Vector', tag: 'The crocodile detective!', color: '#43a047',
    art: `
      <path d="M50,16 a26,24 0 0 1 26,24 L24,40 a26,24 0 0 1 26,-24 Z" fill="#43a047" stroke="#1d6b21" stroke-width="2"/>
      <rect x="24" y="38" width="52" height="22" rx="8" fill="#43a047" stroke="#1d6b21" stroke-width="2"/>
      <rect x="28" y="58" width="44" height="18" rx="9" fill="#8bc34a" stroke="#557c1f" stroke-width="2"/>
      <path d="M32,58 L36,64 L40,58 L44,64 L48,58 L52,64 L56,58 L60,64 L64,58 L68,64" fill="#fff" stroke="#bdbdbd" stroke-width="0.8"/>
      <circle cx="42" cy="69" r="1.8" fill="#2e5d12"/><circle cx="58" cy="69" r="1.8" fill="#2e5d12"/>
      <circle cx="24" cy="44" r="8" fill="#37474f" stroke="#1c262b" stroke-width="2"/>
      <circle cx="76" cy="44" r="8" fill="#37474f" stroke="#1c262b" stroke-width="2"/>
      <circle cx="24" cy="44" r="3.5" fill="#ffb300"/><circle cx="76" cy="44" r="3.5" fill="#ffb300"/>
      <path d="M26,30 Q50,14 74,30" fill="none" stroke="#37474f" stroke-width="4"/>
      ${eyes('#ff8f00', { y: 42, dx: 11, rx: 6, ry: 8 })}
      <g fill="#f1c40f" stroke="#9c7b08" stroke-width="1">
        <circle cx="34" cy="88" r="3.5"/><circle cx="42" cy="91" r="3.5"/><circle cx="50" cy="92" r="3.5"/>
        <circle cx="58" cy="91" r="3.5"/><circle cx="66" cy="88" r="3.5"/>
      </g>`
  },
  {
    id: 'espio', name: 'Espio', speak: 'Espio', tag: 'The ninja chameleon!', color: '#ab47bc',
    art: `
      <path d="M68,40 L93,26 L72,52 Z" fill="#ab47bc" stroke="#6d1b7b" stroke-width="2" stroke-linejoin="round"/>
      <path d="M32,40 L7,26 L28,52 Z" fill="#ab47bc" stroke="#6d1b7b" stroke-width="2" stroke-linejoin="round"/>
      ${head('#ab47bc', '#6d1b7b')}
      <path d="M43,40 L50,14 L57,40 Z" fill="#f9c22e" stroke="#b3850e" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="50" cy="68" rx="13" ry="9" fill="#d99ce3"/>
      <ellipse cx="50" cy="62" rx="2.4" ry="1.9" fill="#222"/>
      ${smile(71)}
      ${eyes('#e6a817', { y: 52 })}`
  },
  {
    id: 'charmy', name: 'Charmy', speak: 'Charmy', tag: 'The busy bee!', color: '#f9c22e',
    art: `
      <ellipse cx="22" cy="52" rx="12" ry="7" fill="#eef6ff" stroke="#b8d4ea" stroke-width="1.5" opacity="0.9" transform="rotate(-25 22 52)"/>
      <ellipse cx="78" cy="52" rx="12" ry="7" fill="#eef6ff" stroke="#b8d4ea" stroke-width="1.5" opacity="0.9" transform="rotate(25 78 52)"/>
      <path d="M38,14 Q30,2 24,6" fill="none" stroke="#222" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M62,14 Q70,2 76,6" fill="none" stroke="#222" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="24" cy="5" r="4" fill="#222"/><circle cx="76" cy="5" r="4" fill="#222"/>
      ${head('#2b2b2b', '#000')}
      <path d="M23,50 A27,27 0 0 1 77,50 L77,44 A27,27 0 0 0 23,44 Z" fill="#f0821e"/>
      <path d="M23,46 A27,27 0 0 1 77,46" fill="none" stroke="#b35a0a" stroke-width="2"/>
      <path d="M50,28 a22,18 0 0 1 22,17 L28,45 a22,18 0 0 1 22,-17 Z" fill="#f0821e" stroke="#b35a0a" stroke-width="2"/>
      <rect x="30" y="74" width="40" height="7" rx="3.5" fill="#f9c22e" stroke="#b3850e" stroke-width="1.5"/>
      ${muzzle('#f8d9a8', { y: 67, rx: 11, ry: 7.5 })}
      ${eyes('#ff8f00', { y: 53 })}`
  },
  {
    id: 'mighty', name: 'Mighty', speak: 'Mighty', tag: 'The mighty armadillo!', color: '#d8242f',
    art: `
      ${head('#2b2b2b', '#000')}
      <path d="M24,46 A27,27 0 0 1 76,46 L76,40 A28,28 0 0 0 24,40 Z" fill="#d8242f"/>
      <path d="M50,27 a24,20 0 0 1 24,19 L26,46 a24,20 0 0 1 24,-19 Z" fill="#d8242f" stroke="#8e1420" stroke-width="2"/>
      <path d="M34,34 Q50,26 66,34" fill="none" stroke="#8e1420" stroke-width="1.6"/>
      ${muzzle('#f8d9a8')}
      ${eyes('#2e7bd6')}`
  },
  {
    id: 'ray', name: 'Ray', speak: 'Ray', tag: 'The flying squirrel!', color: '#ffd54f',
    art: `
      <path d="M20,64 Q4,58 6,42 Q18,48 26,58 Z" fill="#ffd54f" stroke="#d8a014" stroke-width="2" stroke-linejoin="round"/>
      <path d="M80,64 Q96,58 94,42 Q82,48 74,58 Z" fill="#ffd54f" stroke="#d8a014" stroke-width="2" stroke-linejoin="round"/>
      <path d="M34,32 Q36,6 66,8 Q54,14 60,28 Q46,20 34,32 Z" fill="#ffd54f" stroke="#d8a014" stroke-width="2" stroke-linejoin="round"/>
      <path d="M30,36 L26,18 L42,28 Z" fill="#ffd54f" stroke="#d8a014" stroke-width="2"/>
      <path d="M70,36 L74,18 L58,28 Z" fill="#ffd54f" stroke="#d8a014" stroke-width="2"/>
      ${head('#ffd54f', '#d8a014')}
      ${muzzle('#fbe9c4')}
      ${eyes('#2e7bd6')}`
  },
  {
    id: 'fang', name: 'Fang', speak: 'Fang', tag: 'The sneaky sniper!', color: '#9a7bd0',
    art: `
      <path d="M33,34 L26,2 L46,26 Z" fill="#9a7bd0" stroke="#5e4494" stroke-width="2" stroke-linejoin="round"/>
      <path d="M67,34 L74,2 L54,26 Z" fill="#9a7bd0" stroke="#5e4494" stroke-width="2" stroke-linejoin="round"/>
      <path d="M34,28 L29,10 L42,24 Z" fill="#d9c8f0"/>
      <path d="M66,28 L71,10 L58,24 Z" fill="#d9c8f0"/>
      ${head('#9a7bd0', '#5e4494')}
      <path d="M34,30 A17,13 0 0 1 66,30 L66,33 L34,33 Z" fill="#8d5a2b" stroke="#5e3a17" stroke-width="2"/>
      <ellipse cx="50" cy="32" rx="23" ry="5.5" fill="#7a4a21" stroke="#5e3a17" stroke-width="2"/>
      <ellipse cx="50" cy="67" rx="13" ry="9" fill="#fff"/>
      <ellipse cx="50" cy="61" rx="2.6" ry="2" fill="#222"/>
      ${smile(70)}
      <path d="M52.5,73 L56,73 L54.2,79 Z" fill="#fff" stroke="#bbb" stroke-width="0.8"/>
      ${eyes('#7b1fa2', { y: 50 })}`
  },
  {
    id: 'bean', name: 'Bean', speak: 'Bean', tag: 'The silly duck!', color: '#58b765',
    art: `
      <g fill="#58b765" stroke="#2c7a38" stroke-width="2" stroke-linejoin="round">
        <path d="M40,32 L32,8 L50,28 Z"/><path d="M48,28 L54,4 L58,28 Z"/><path d="M56,30 L70,12 L62,33 Z"/>
      </g>
      ${head('#58b765', '#2c7a38')}
      <ellipse cx="50" cy="67" rx="16" ry="9" fill="#f6c623" stroke="#b3850e" stroke-width="2"/>
      <path d="M34,67 L66,67" stroke="#b3850e" stroke-width="1.8"/>
      <circle cx="45" cy="63.5" r="1.2" fill="#7a5c0a"/><circle cx="55" cy="63.5" r="1.2" fill="#7a5c0a"/>
      ${eyes('#5d4037', { y: 48 })}`
  },
  {
    id: 'bark', name: 'Bark', speak: 'Bark', tag: 'The big polar bear!', color: '#e0b97d',
    art: `
      <circle cx="30" cy="28" r="9" fill="#e0b97d" stroke="#a8854a" stroke-width="2"/>
      <circle cx="70" cy="28" r="9" fill="#e0b97d" stroke="#a8854a" stroke-width="2"/>
      <circle cx="30" cy="28" r="4" fill="#f6e7c8"/><circle cx="70" cy="28" r="4" fill="#f6e7c8"/>
      <ellipse cx="50" cy="56" rx="30" ry="27" fill="#e0b97d" stroke="#a8854a" stroke-width="2"/>
      <path d="M40,28 Q50,22 60,28" fill="none" stroke="#a8854a" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="50" cy="68" rx="16" ry="11" fill="#f6e7c8"/>
      <ellipse cx="50" cy="62" rx="4" ry="3" fill="#3e2723"/>
      ${smile(73, 8)}
      ${eyes('#5d4037', { y: 48 })}`
  },
  {
    id: 'jet', name: 'Jet', speak: 'Jet', tag: 'The speedy hawk!', color: '#2fa050',
    art: `
      <g fill="#2fa050" stroke="#176b30" stroke-width="2" stroke-linejoin="round">
        <path d="M60,26 Q84,6 94,16 Q80,22 70,34 Z"/>
        <path d="M64,34 Q90,24 96,34 Q82,38 72,44 Z"/>
        <path d="M40,26 Q16,6 6,16 Q20,22 30,34 Z"/>
      </g>
      ${head('#2fa050', '#176b30')}
      <rect x="27" y="33" width="46" height="7" rx="3.5" fill="#c62828" stroke="#7f1616" stroke-width="1.5"/>
      <circle cx="40" cy="36.5" r="4.5" fill="#90a4ae" stroke="#546e7a" stroke-width="1.5"/>
      <circle cx="60" cy="36.5" r="4.5" fill="#90a4ae" stroke="#546e7a" stroke-width="1.5"/>
      <path d="M41,58 L59,58 L50,76 Z" fill="#f6a51c" stroke="#b3700e" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="47" cy="62" r="1" fill="#7a4d08"/><circle cx="53" cy="62" r="1" fill="#7a4d08"/>
      ${eyes('#2e7bd6', { y: 50 })}`
  },
  {
    id: 'wave', name: 'Wave', speak: 'Wave', tag: 'The clever swallow!', color: '#9b59b6',
    art: `
      <g fill="#9b59b6" stroke="#62317a" stroke-width="2" stroke-linejoin="round">
        <path d="M58,24 Q76,2 90,8 Q78,16 68,30 Z"/>
        <path d="M42,24 Q24,2 10,8 Q22,16 32,30 Z"/>
        <path d="M50,24 Q50,4 58,2 Q56,14 56,24 Z"/>
      </g>
      ${head('#9b59b6', '#62317a')}
      <path d="M32,43 Q40,38 47,42" fill="none" stroke="#d1a3e0" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M68,43 Q60,38 53,42" fill="none" stroke="#d1a3e0" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M43,58 L57,58 L50,72 Z" fill="#f6a51c" stroke="#b3700e" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="47.5" cy="61" r="0.9" fill="#7a4d08"/><circle cx="52.5" cy="61" r="0.9" fill="#7a4d08"/>
      ${eyes('#2e7bd6', { y: 49 })}`
  },
  {
    id: 'storm', name: 'Storm', speak: 'Storm', tag: 'The strong albatross!', color: '#9aa3a8',
    art: `
      <path d="M44,28 L40,8 L54,26 Z" fill="#9aa3a8" stroke="#5f686d" stroke-width="2" stroke-linejoin="round"/>
      <path d="M54,26 L64,10 L62,29 Z" fill="#9aa3a8" stroke="#5f686d" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="50" cy="56" rx="31" ry="27" fill="#9aa3a8" stroke="#5f686d" stroke-width="2"/>
      <path d="M38,60 L62,60 L50,80 Z" fill="#f6a51c" stroke="#b3700e" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="46" cy="64" r="1.2" fill="#7a4d08"/><circle cx="54" cy="64" r="1.2" fill="#7a4d08"/>
      ${eyes('#2e7bd6', { y: 48, dx: 13 })}`
  },
  {
    id: 'tikal', name: 'Tikal', speak: 'Tikal', tag: 'The kind echidna!', color: '#ef8b4e',
    art: `
      <g fill="#ef8b4e" stroke="#b85a22" stroke-width="2" stroke-linejoin="round">
        <path d="M30,40 Q14,48 13,74 Q25,76 32,58 Z"/>
        <path d="M70,40 Q86,48 87,74 Q75,76 68,58 Z"/>
        <path d="M37,56 Q30,70 33,86 Q43,82 45,66 Z"/>
        <path d="M63,56 Q70,70 67,86 Q57,82 55,66 Z"/>
      </g>
      <rect x="16" y="62" width="9" height="6" rx="2" fill="#fff" stroke="#cfa468" stroke-width="1"/>
      <rect x="75" y="62" width="9" height="6" rx="2" fill="#fff" stroke="#cfa468" stroke-width="1"/>
      ${head('#ef8b4e', '#b85a22')}
      <path d="M25,44 Q50,26 75,44 L75,38 Q50,20 25,38 Z" fill="#3056b0" stroke="#1d3a80" stroke-width="1.5"/>
      <circle cx="38" cy="37" r="1.6" fill="#fff"/><circle cx="50" cy="33.5" r="1.6" fill="#fff"/><circle cx="62" cy="37" r="1.6" fill="#fff"/>
      ${muzzle('#f8d9a8')}
      ${eyes('#2e7bd6')}`
  },
  {
    id: 'chaos', name: 'Chaos', speak: 'Chaos', tag: 'The water creature!', color: '#4dd0e1',
    art: `
      <defs>
        <linearGradient id="chaosGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#9be8f2"/><stop offset="1" stop-color="#36b6cc"/>
        </linearGradient>
      </defs>
      <path d="M36,24 Q28,4 42,8 Q40,16 46,22 Z" fill="#6edceb" stroke="#2b96aa" stroke-width="2" stroke-linejoin="round"/>
      <path d="M64,24 Q72,4 58,8 Q60,16 54,22 Z" fill="#6edceb" stroke="#2b96aa" stroke-width="2" stroke-linejoin="round"/>
      <path d="M50,16 Q79,20 81,52 Q83,80 50,86 Q17,80 19,52 Q21,20 50,16 Z" fill="url(#chaosGrad)" stroke="#2b96aa" stroke-width="2.5"/>
      <path d="M30,36 Q44,28 60,34" fill="none" stroke="#c8f4fa" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
      <ellipse cx="39" cy="52" rx="7.5" ry="10" fill="#35d07a" stroke="#1d8a4d" stroke-width="1.5"/>
      <ellipse cx="61" cy="52" rx="7.5" ry="10" fill="#35d07a" stroke="#1d8a4d" stroke-width="1.5"/>
      <rect x="38" y="47" width="2" height="10" rx="1" fill="#0d3b22"/>
      <rect x="60" y="47" width="2" height="10" rx="1" fill="#0d3b22"/>
      <circle cx="36.5" cy="48" r="1.4" fill="#fff"/><circle cx="58.5" cy="48" r="1.4" fill="#fff"/>`
  },
  {
    id: 'gamma', name: 'Gamma', speak: 'Gamma', tag: 'The brave robot!', color: '#c62828',
    art: `
      <ellipse cx="50" cy="24" rx="11" ry="4.5" fill="#9e9e9e" stroke="#616161" stroke-width="1.5"/>
      <line x1="50" y1="20" x2="50" y2="10" stroke="#616161" stroke-width="2.5"/>
      <circle cx="50" cy="9" r="3" fill="#ffb300" stroke="#9c7b08" stroke-width="1.2"/>
      <rect x="28" y="26" width="44" height="48" rx="14" fill="#c62828" stroke="#7f1616" stroke-width="2.5"/>
      <rect x="33" y="40" width="34" height="14" rx="7" fill="#222"/>
      <circle cx="42" cy="47" r="6" fill="#4caf50" opacity="0.35"/>
      <circle cx="58" cy="47" r="6" fill="#4caf50" opacity="0.35"/>
      <circle cx="42" cy="47" r="3.5" fill="#4caf50"/><circle cx="58" cy="47" r="3.5" fill="#4caf50"/>
      <rect x="38" y="60" width="24" height="8" rx="4" fill="#9e9e9e" stroke="#616161" stroke-width="1.5"/>
      <g stroke="#616161" stroke-width="1.5"><line x1="44" y1="61.5" x2="44" y2="66.5"/><line x1="50" y1="61.5" x2="50" y2="66.5"/><line x1="56" y1="61.5" x2="56" y2="66.5"/></g>`
  },
  {
    id: 'emerl', name: 'Emerl', speak: 'Emerl', tag: 'The copycat robot!', color: '#d9a441',
    art: `
      <path d="M28,44 L8,18 L36,32 Z" fill="#b3812f" stroke="#7a5518" stroke-width="2" stroke-linejoin="round"/>
      <path d="M72,44 L92,18 L64,32 Z" fill="#b3812f" stroke="#7a5518" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="50" cy="24" r="6" fill="#b3812f" stroke="#7a5518" stroke-width="2"/>
      ${head('#d9a441', '#9c732a')}
      <rect x="32" y="44" width="36" height="14" rx="7" fill="#33302a"/>
      <circle cx="42" cy="51" r="6" fill="#42a5f5" opacity="0.35"/>
      <circle cx="58" cy="51" r="6" fill="#42a5f5" opacity="0.35"/>
      <circle cx="42" cy="51" r="3.5" fill="#42a5f5"/><circle cx="58" cy="51" r="3.5" fill="#42a5f5"/>
      <path d="M36,68 Q50,74 64,68" fill="none" stroke="#9c732a" stroke-width="2" stroke-linecap="round"/>
      <circle cx="32" cy="66" r="1.6" fill="#9c732a"/><circle cx="68" cy="66" r="1.6" fill="#9c732a"/>`
  },
  {
    id: 'shade', name: 'Shade', speak: 'Shade', tag: 'The mysterious echidna!', color: '#6650a3',
    art: `
      <g fill="#6650a3" stroke="#3f3070" stroke-width="2" stroke-linejoin="round">
        <path d="M30,40 Q14,48 13,72 Q25,74 32,56 Z"/>
        <path d="M70,40 Q86,48 87,72 Q75,74 68,56 Z"/>
        <path d="M38,54 Q31,68 34,84 Q44,80 45,64 Z"/>
        <path d="M62,54 Q69,68 66,84 Q56,80 55,64 Z"/>
      </g>
      <path d="M18,62 L26,58" stroke="#ff8f00" stroke-width="2" stroke-linecap="round"/>
      <path d="M82,62 L74,58" stroke="#ff8f00" stroke-width="2" stroke-linecap="round"/>
      ${head('#6650a3', '#3f3070')}
      <rect x="33" y="59" width="34" height="15" rx="7" fill="#37474f" stroke="#1c262b" stroke-width="2"/>
      <line x1="36" y1="66.5" x2="64" y2="66.5" stroke="#ff8f00" stroke-width="2"/>
      ${eyes('#ffa726', { y: 48 })}`
  },
  {
    id: 'honey', name: 'Honey', speak: 'Honey', tag: 'The fashionable cat!', color: '#fdd835',
    art: `
      <circle cx="27" cy="36" r="9" fill="#2b2b2b"/>
      <circle cx="73" cy="36" r="9" fill="#2b2b2b"/>
      <path d="M32,32 L28,12 L46,24 Z" fill="#fdd835" stroke="#b89a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M68,32 L72,12 L54,24 Z" fill="#fdd835" stroke="#b89a10" stroke-width="2" stroke-linejoin="round"/>
      <path d="M34,29 L31,17 L42,24 Z" fill="#2b2b2b"/>
      <path d="M66,29 L69,17 L58,24 Z" fill="#2b2b2b"/>
      ${head('#fdd835', '#b89a10')}
      <path d="M30,36 Q38,28 48,32 Q40,34 36,40 Z" fill="#2b2b2b"/>
      <path d="M70,36 Q62,28 52,32 Q60,34 64,40 Z" fill="#2b2b2b"/>
      ${muzzle('#fdf3cf', { nose: '#d96a47' })}
      ${eyes('#6d4c41')}
      <g>
        <path d="M40,88 L48,83 L48,93 Z" fill="#e53935" stroke="#9c1f1f" stroke-width="1.5"/>
        <path d="M60,88 L52,83 L52,93 Z" fill="#e53935" stroke="#9c1f1f" stroke-width="1.5"/>
        <circle cx="50" cy="88" r="3" fill="#ff7043" stroke="#9c1f1f" stroke-width="1.2"/>
      </g>`
  },
  {
    id: 'tiara', name: 'Tiara', speak: 'Tiara', tag: 'The brave manx cat!', color: '#f3c98b',
    art: `
      <ellipse cx="64" cy="16" rx="10" ry="7" fill="#b3552e" stroke="#7a3517" stroke-width="2" transform="rotate(20 64 16)"/>
      <path d="M33,34 L28,14 L45,26 Z" fill="#f3c98b" stroke="#bd8c4a" stroke-width="2" stroke-linejoin="round"/>
      <path d="M67,34 L72,14 L55,26 Z" fill="#f3c98b" stroke="#bd8c4a" stroke-width="2" stroke-linejoin="round"/>
      ${head('#f3c98b', '#bd8c4a')}
      <path d="M26,44 Q34,26 50,28 Q66,26 74,44 Q62,34 50,36 Q38,34 26,44 Z" fill="#b3552e" stroke="#7a3517" stroke-width="1.5"/>
      <path d="M36,32 L40,24 L44,31 M48,30 L52,23 L56,30" fill="none" stroke="#f1c40f" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="46" cy="27" r="1.8" fill="#4fc3f7" stroke="#1d7aa8" stroke-width="0.8"/>
      ${muzzle('#fbe9cf', { nose: '#d96a47' })}
      ${eyes('#2e7bd6')}`
  },
  {
    id: 'sticks', name: 'Sticks', speak: 'Sticks', tag: 'The wild badger!', color: '#e0813c',
    art: `
      <path d="M36,32 L28,0 L48,24 Z" fill="#e0813c" stroke="#a8551d" stroke-width="2" stroke-linejoin="round"/>
      <path d="M64,32 L72,0 L52,24 Z" fill="#e0813c" stroke="#a8551d" stroke-width="2" stroke-linejoin="round"/>
      <g fill="#c96a28" stroke="#a8551d" stroke-width="2" stroke-linejoin="round">
        <path d="M30,38 Q14,44 12,64 L24,58 Q18,70 22,80 L34,68 Q32,78 40,84 L42,66 Z"/>
        <path d="M70,38 Q86,44 88,64 L76,58 Q82,70 78,80 L66,68 Q68,78 60,84 L58,66 Z"/>
      </g>
      ${head('#e0813c', '#a8551d')}
      ${muzzle('#f7dcb8')}
      ${eyes('#2e7bd6')}`
  },
  {
    id: 'chip', name: 'Chip', speak: 'Chip', tag: 'The little hero with a sweet tooth!', color: '#a14a52',
    art: `
      <ellipse cx="20" cy="48" rx="10" ry="6" fill="#eef6ff" stroke="#b8d4ea" stroke-width="1.5" opacity="0.9" transform="rotate(-30 20 48)"/>
      <ellipse cx="80" cy="48" rx="10" ry="6" fill="#eef6ff" stroke="#b8d4ea" stroke-width="1.5" opacity="0.9" transform="rotate(30 80 48)"/>
      <circle cx="32" cy="32" r="7" fill="#a14a52" stroke="#6e2e35" stroke-width="2"/>
      <circle cx="68" cy="32" r="7" fill="#a14a52" stroke="#6e2e35" stroke-width="2"/>
      <circle cx="50" cy="54" r="24" fill="#a14a52" stroke="#6e2e35" stroke-width="2"/>
      <path d="M38,20 Q50,8 64,18 Q54,18 52,26 Q44,20 38,20 Z" fill="#fff" stroke="#cfcfcf" stroke-width="1.5"/>
      <ellipse cx="50" cy="62" rx="14" ry="11" fill="#f6e3c5"/>
      <ellipse cx="50" cy="56" rx="2.4" ry="1.9" fill="#222"/>
      ${smile(65)}
      ${eyes('#35d07a', { y: 46, rx: 6, ry: 8.5 })}
      <path d="M36,84 Q50,92 64,84" fill="none" stroke="#8d6e63" stroke-width="2.5"/>
      <path d="M46,88 L50,84 L54,88 L50,93 Z" fill="#4caf50" stroke="#1d6b21" stroke-width="1.5"/>`
  },
  {
    id: 'metal-sonic', name: 'Metal Sonic', speak: 'Metal Sonic', tag: 'The robot copy of Sonic!', color: '#3d6fe0',
    art: `
      <g fill="#3d6fe0" stroke="#1b3a8c" stroke-width="2" stroke-linejoin="round">
        <path d="M28,36 L6,24 L27,46 Z"/><path d="M22,50 L0,46 L22,60 Z"/><path d="M25,62 L5,70 L29,72 Z"/>
        <path d="M72,36 L94,24 L73,46 Z"/><path d="M78,50 L100,46 L78,60 Z"/><path d="M75,62 L95,70 L71,72 Z"/>
        <path d="M40,32 L33,9 L50,28 Z"/><path d="M52,28 L63,8 L62,32 Z"/>
      </g>
      ${head('#3d6fe0', '#1b3a8c')}
      <ellipse cx="50" cy="51" rx="19" ry="13" fill="#15151c"/>
      <ellipse cx="42" cy="51" rx="5" ry="7" fill="#ff1744" transform="rotate(-12 42 51)"/>
      <ellipse cx="58" cy="51" rx="5" ry="7" fill="#ff1744" transform="rotate(12 58 51)"/>
      <circle cx="41" cy="48" r="1.4" fill="#fff"/><circle cx="57" cy="48" r="1.4" fill="#fff"/>
      <ellipse cx="50" cy="69" rx="12" ry="8" fill="#cfd8dc" stroke="#78909c" stroke-width="1.5"/>
      <circle cx="44" cy="69" r="1.2" fill="#78909c"/><circle cx="50" cy="71" r="1.2" fill="#78909c"/><circle cx="56" cy="69" r="1.2" fill="#78909c"/>`
  },
  {
    id: 'mephiles', name: 'Mephiles', speak: 'Mephiles', tag: 'The dark mystery!', color: '#4a5e6a',
    art: `
      <g fill="#4a5e6a" stroke="#2c3a42" stroke-width="2" stroke-linejoin="round">
        <path d="M32,40 L8,14 L36,48 Z"/><path d="M26,52 L2,38 L26,62 Z"/>
        <path d="M68,40 L92,14 L64,48 Z"/><path d="M74,52 L98,38 L74,62 Z"/>
        <path d="M42,30 L36,8 L52,27 Z"/><path d="M54,27 L64,8 L60,30 Z"/>
      </g>
      <path d="M30,42 L13,20" stroke="#9fd8e8" stroke-width="3" stroke-linecap="round"/>
      <path d="M70,42 L87,20" stroke="#9fd8e8" stroke-width="3" stroke-linecap="round"/>
      ${head('#4a5e6a', '#2c3a42')}
      <path d="M34,66 L46,60 L58,68 L66,62" fill="none" stroke="#7e99a8" stroke-width="1.5" opacity="0.8"/>
      <path d="M36,74 L50,70 L62,76" fill="none" stroke="#7e99a8" stroke-width="1.5" opacity="0.8"/>
      ${eyes('#35d07a', { angry: true, slit: true })}`
  },
  {
    id: 'infinite', name: 'Infinite', speak: 'Infinite', tag: 'The masked jackal!', color: '#37474f',
    art: `
      <g fill="#eceff1" stroke="#90a4ae" stroke-width="2" stroke-linejoin="round">
        <path d="M36,34 L22,8 L46,28 Z"/>
        <path d="M46,28 L50,2 L57,28 Z"/>
        <path d="M56,28 L76,10 L63,32 Z"/>
        <path d="M28,44 Q16,54 19,74 Q30,71 34,56 Z"/>
        <path d="M72,44 Q84,54 81,74 Q70,71 66,56 Z"/>
      </g>
      ${head('#37474f', '#1c262b')}
      <path d="M50,34 L73,40 L71,60 L56,66 L50,58 Z" fill="#78909c" stroke="#455a64" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="62" cy="50" rx="4" ry="6.5" fill="#42c8f5" opacity="0.9"/>
      <ellipse cx="38" cy="51" rx="6.5" ry="9.5" fill="#fff" stroke="#222" stroke-width="1.5"/>
      <circle cx="38" cy="54" r="3.4" fill="#ffb300"/><circle cx="38" cy="54" r="1.6" fill="#111"/>
      <circle cx="36.6" cy="52" r="1" fill="#fff"/>
      <path d="M31,40 L43,45" stroke="#111" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M46,86 L50,80 L54,86 L50,92 Z" fill="#ff1744" stroke="#9c0f2e" stroke-width="1.5"/>
      <path d="M46,86 L50,80 L54,86 L50,92 Z" fill="#ff1744" opacity="0.4" transform="scale(1.4) translate(-14.3,-25)"/>`
  },
  {
    id: 'eggman', name: 'Dr. Eggman', speak: 'Doctor Eggman', tag: 'The silly scientist!', color: '#e64a19',
    art: `
      <path d="M26,90 L50,76 L74,90 Q50,98 26,90 Z" fill="#c62828" stroke="#7f1616" stroke-width="2"/>
      ${head('#f4c08e', '#c98e54', { cy: 52, r: 28 })}
      <path d="M32,33 Q50,22 68,33" fill="none" stroke="#fff" stroke-width="2" opacity="0.6"/>
      <circle cx="39" cy="45" r="8.5" fill="#aee3f7" stroke="#1565c0" stroke-width="2.5"/>
      <circle cx="61" cy="45" r="8.5" fill="#aee3f7" stroke="#1565c0" stroke-width="2.5"/>
      <line x1="47.5" y1="45" x2="52.5" y2="45" stroke="#1565c0" stroke-width="2.5"/>
      <ellipse cx="50" cy="57" rx="5" ry="4" fill="#e57373" stroke="#c1564f" stroke-width="1.2"/>
      <path d="M49,60 Q30,54 18,64 Q28,74 48,66 Z" fill="#d35400" stroke="#8e3a07" stroke-width="2" stroke-linejoin="round"/>
      <path d="M51,60 Q70,54 82,64 Q72,74 52,66 Z" fill="#d35400" stroke="#8e3a07" stroke-width="2" stroke-linejoin="round"/>
      ${smile(76, 8)}`
  }
];

/* Wrap a character's art in a full SVG card image. */
function charSVG(c) {
  return `<svg viewBox="0 0 100 100" role="img" aria-label="${c.name}">
    <circle cx="50" cy="50" r="47" fill="${c.color}" opacity="0.16"/>
    ${c.art}
  </svg>`;
}
