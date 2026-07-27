/**
 * GitHub profile hero banner generator.
 * Produces dark.svg + light.svg (identical layout & animation, different palette).
 *
 *   node build.js
 *
 * Edit PROFILE below to change the content. Everything else is derived.
 */
const fs = require('fs');
const path = require('path');

/* ------------------------------------------------------------------ *
 * 1. CONTENT
 * ------------------------------------------------------------------ */
const PROFILE = {
  name: 'Ertuğrul',
  handle: 'likosertugrul',
  roles: [
    'Frontend Engineer',
    'Full Stack Developer',
    'Open Source Contributor',
    'UI Engineer',
    'AI Enthusiast',
  ],
  info: [
    ['Location', 'İstanbul, Türkiye', 'pin'],
    ['Education', 'Computer Engineering', 'cap'],
    ['Focus', 'Next.js · AI-powered products', 'target'],
    ['Portfolio', 'likosertugrul.com', 'globe'],
    ['Email', 'likosertugrul128@gmail.com', 'mail'],
  ],
  skills: [
    ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind', 'Python'],
    ['Docker', 'Postgres', 'AWS', 'Git', 'Figma'],
  ],
  status: 'AVAILABLE FOR WORK',
  links: {
    github: 'https://github.com/likosertugrul',
    linkedin: 'https://www.linkedin.com/in/likosertugrul',
    x: 'https://x.com/likosertugrul',
    site: 'https://likosertugrul.com',
  },
};

/* Portrait, generated from the source photo (see USAGE.md): 60 x 30 cells.
   The background is flood-removed and every cell is a full block whose
   fill-opacity carries the tone, inverted so the photo's dark areas are the
   opaque ones — that reads as ink on the light theme and as light on the dark
   one. Tone from opacity is what makes it a face instead of a silhouette. */
const ART = `
                                                            
                                                            
                     ███████████                            
               ████████████████████                         
            ███████████████████████████                     
           ██████████████████████████████                   
         █████████████████████████████████                  
       ████████████████████████████████████                 
       ████████████████████████████████████                 
      ██████████████████████████████████████                
      ███████████████████████████████████████               
      ███████████████████████████████████████               
      ███████████████████████████████████████               
       █████████████████████████████████████                
       █████████████████████████████████████                
       █████████████████████████████████████                
        ████████████████████████████████████                
        ████████████████████████████████████                
         ████████████████████████████████████               
         ████████████████████████████████████               
          ██████    █████████████████████████               
          ██████     ████████████████████████               
           ███████     ████████████████████████             
           ████████       ███████████████████████           
           █████████      █████████████████████████         
            █████████     ████████████████████████████      
            ██████████    ██████████████████████████████    
            ██████████    ██████████████████████████████████
           ████████████     ████████████████████████████████
          █████████████       ██████████████████████████████
`.replace(/^\n/, '').replace(/\n$/, '').split('\n');

/* per-cell tone, 0 = nothing, 1..8 = dim..full */
const LEV = `
000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000
000000000000000000000346665565330000000000000000000000000000
000000000000000334566667876677766650000000000000000000000000
000000000000367777677778888888887766333000000000000000000000
000000000006677777788888888778877667776530000000000000000000
000000000476677887788888877778888777877555000000000000000000
000000043567888877788888888877888887776543200000000000000000
000000056668887887778788888867888887677666500000000000000000
000000477888787877778888678887888876788777730000000000000000
000000677877787765688888778888778778678877765000000000000000
000000566567888857777887888888888888788878667000000000000000
000000456577788756788887767888888888767878676000000000000000
000000056568778657677765778878888888788877770000000000000000
000000067766778434556543447888887788887788610000000000000000
000000057888886555465564567787766458888887210000000000000000
000000006777856887665654445464445423767887310000000000000000
000000001135773667888842348888888411344887660000000000000000
000000000146753256788611223677653211227878742000000000000000
000000000235871111133123344323422221234887522000000000000000
000000000023685100003247767766763221262887622000000000000000
000000000023461300000566445443332222358888611000000000000000
000000000003554611000002333222222223258888853210000000000000
000000000003678881100000003222223332368888888861100000000000
000000000003687888510000002222344322388888888888654000000000
000000000000355468731000004445443223688888888888878873000000
000000000000312445881100005544323224888888888888878877540000
000000000000665466884100003333322335888888888888888888666411
000000000002256866888110000033333346888888888888888888877643
000000000054566767888510000000223348888888888888888888888876
`.replace(/^\n/, '').replace(/\n$/, '').split('\n');

const COLS = 60;
const ROWS = ART.length;
/* fill-opacity per tone level — this is what carries the photo's tonality;
   the glyph alone cannot, every character reads as roughly the same grey */
const TONE = [0, .16, .28, .4, .52, .64, .76, .88, 1];

/* ------------------------------------------------------------------ *
 * 2. PALETTES
 * ------------------------------------------------------------------ */
const THEMES = {
  dark: {
    name: 'dark',
    bg: '#030712',
    bg2: '#070d1c',
    panel: '#0F172A',
    panelTo: '#0b1222',
    panelOp: 0.72,
    border: 'rgba(255,255,255,.08)',
    borderStrong: 'rgba(255,255,255,.16)',
    text: '#F8FAFC',
    muted: '#94A3B8',
    faint: 'rgba(148,163,184,.55)',
    a1: '#7C3AED',
    a2: '#22D3EE',
    a3: '#10B981',
    ascii1: '#22D3EE',
    ascii2: '#7C3AED',
    ascii3: '#38BDF8',
    glow: '#22D3EE',
    glow2: '#7C3AED',
    blobA: '#2563EB',
    blobB: '#7C3AED',
    blobC: '#10B981',
    blobOp: 0.3,
    glass: '#ffffff',
    glassOp: 0.055,
    noiseOp: 0.05,
    shadow: 'rgba(0,0,0,.55)',
    pillBg: 'rgba(255,255,255,.045)',
    pillStroke: 'rgba(255,255,255,.12)',
    scanOp: 0.13,
    gridOp: 0.05,
    toneMin: 0.12,
  },
  light: {
    name: 'light',
    bg: '#FFFFFF',
    bg2: '#F4F7FB',
    panel: '#F8FAFC',
    panelTo: '#eef2f8',
    panelOp: 0.92,
    border: 'rgba(15,23,42,.08)',
    borderStrong: 'rgba(15,23,42,.16)',
    text: '#0F172A',
    muted: '#475569',
    faint: 'rgba(71,85,105,.6)',
    a1: '#2563EB',
    a2: '#06B6D4',
    a3: '#10B981',
    ascii1: '#0891B2',
    ascii2: '#1D4ED8',
    ascii3: '#0EA5E9',
    glow: '#06B6D4',
    glow2: '#2563EB',
    blobA: '#2563EB',
    blobB: '#06B6D4',
    blobC: '#10B981',
    blobOp: 0.16,
    glass: '#ffffff',
    glassOp: 0.5,
    noiseOp: 0.035,
    shadow: 'rgba(15,23,42,.14)',
    pillBg: 'rgba(15,23,42,.035)',
    pillStroke: 'rgba(15,23,42,.1)',
    scanOp: 0.07,
    gridOp: 0.045,
    toneMin: 0.1,
  },
};

/* ------------------------------------------------------------------ *
 * 3. GEOMETRY
 * ------------------------------------------------------------------ */
const W = 1180, H = 610, R = 26;
const PAD = 26;

const L = { x: PAD, y: PAD, w: 440, h: H - PAD * 2, r: 20 };            // left panel
const Rt = { x: L.x + L.w + 16, y: PAD, w: W - (L.x + L.w + 16) - PAD, h: H - PAD * 2, r: 20 };

const ART_W = 392, ART_X = L.x + (L.w - ART_W) / 2, ART_Y0 = 150, ART_LH = 10.9, ART_FS = 11.2;
const ART_Y1 = ART_Y0 + (ROWS - 1) * ART_LH;

const CX = Rt.x + 30;            // content left edge of terminal
const CR = Rt.x + Rt.w - 30;     // content right edge

/* timing */
const T_CYCLE = 24;              // master loop for the role typewriter
const SLOT = T_CYCLE / PROFILE.roles.length;

/* ------------------------------------------------------------------ *
 * 4. HELPERS
 * ------------------------------------------------------------------ */
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n = (v) => Math.round(v * 100) / 100;
const mono = `ui-monospace,'SF Mono',SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace`;
const sans = `-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,'Helvetica Neue',Arial,sans-serif`;
const cw = (fs) => fs * 0.6;   // monospace advance

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** closed elliptic loop starting at 0,0 (for animateMotion) */
function loopPath(rx, ry) {
  const k = 0.5523;
  return `M0,0 C${n(k * rx)},0 ${n(rx)},${n(ry - k * ry)} ${n(rx)},${n(ry)} ` +
    `C${n(rx)},${n(ry + k * ry)} ${n(k * rx)},${n(2 * ry)} 0,${n(2 * ry)} ` +
    `C${n(-k * rx)},${n(2 * ry)} ${n(-rx)},${n(ry + k * ry)} ${n(-rx)},${n(ry)} ` +
    `C${n(-rx)},${n(ry - k * ry)} ${n(-k * rx)},0 0,0 Z`;
}

/** char-by-char typewriter keyframes for a clip rect width, inside a T_CYCLE loop */
function typeKeys(len, charW, slotStart, typeDur, holdDur, delDur) {
  const vals = [], keys = [];
  const push = (v, t) => { vals.push(n(v)); keys.push(n(t / T_CYCLE * 10000) / 10000); };
  push(0, 0);
  push(0, slotStart);
  for (let i = 1; i <= len; i++) push(i * charW, slotStart + (i - 1) / len * typeDur);
  push(len * charW, slotStart + typeDur + holdDur);
  for (let i = len - 1; i >= 0; i--) push(i * charW, slotStart + typeDur + holdDur + (len - 1 - i) / len * delDur);
  push(0, T_CYCLE);
  return { values: vals.join(';'), keyTimes: keys.join(';') };
}

/** one continuous keyframe track (all phrases) — used by the caret */
function caretTrack(items, charW, x0, typeDur, holdDur, delDur) {
  const vals = [], keys = [];
  const push = (v, t) => { vals.push(n(x0 + v)); keys.push(n(t / T_CYCLE * 10000) / 10000); };
  items.forEach((s, i) => {
    const len = s.length, st = i * SLOT;
    push(0, st);
    for (let c = 1; c <= len; c++) push(c * charW, st + (c - 1) / len * typeDur);
    push(len * charW, st + typeDur + holdDur);
    for (let c = len - 1; c >= 0; c--) push(c * charW, st + typeDur + holdDur + (len - 1 - c) / len * delDur);
  });
  push(0, T_CYCLE);
  return { values: vals.join(';'), keyTimes: keys.join(';') };
}

/* Reveal helpers.
 * The *base* attribute value is always the finished state, and the intro
 * animation runs from t=0 while holding the hidden value for `delay`.
 * That way a renderer that ignores SMIL still shows the finished banner
 * instead of an empty card. */
function fadeIn(delay, dur) {
  const total = delay + dur, k = n(delay / total);
  return `<animate attributeName="opacity" values="0;0;1" keyTimes="0;${k};1" dur="${n(total)}s" fill="freeze" calcMode="spline" keySplines="0 0 1 1;.2 .8 .2 1"/>`;
}
function slideIn(delay, dur, from) {
  const total = delay + dur, k = n(delay / total);
  return `<animateTransform attributeName="transform" type="translate" values="${from};${from};0 0" keyTimes="0;${k};1" dur="${n(total)}s" fill="freeze" calcMode="spline" keySplines="0 0 1 1;.2 .8 .2 1"/>`;
}
function popIn(delay, dur, s0) {
  const total = delay + dur, k = delay / total, k2 = k + (1 - k) * 0.62;
  return `<animateTransform attributeName="transform" type="scale" additive="sum" values="${s0};${s0};1.06;1" keyTimes="0;${n(k)};${n(k2)};1" dur="${n(total)}s" fill="freeze" calcMode="spline" keySplines="0 0 1 1;.2 .8 .2 1;.3 0 .3 1"/>`;
}
function wipeIn(delay, dur, to) {
  const total = delay + dur, k = n(delay / total);
  return `<animate attributeName="width" values="0;0;${to}" keyTimes="0;${k};1" dur="${n(total)}s" fill="freeze" calcMode="spline" keySplines="0 0 1 1;.2 .6 .3 1"/>`;
}

/* ------------------------------------------------------------------ *
 * 5. ICONS (16x16 view space)
 * ------------------------------------------------------------------ */
const ICONS = {
  pin: `<path d="M8 1.6c-2.4 0-4.3 1.9-4.3 4.3C3.7 9.1 8 14.4 8 14.4s4.3-5.3 4.3-8.5c0-2.4-1.9-4.3-4.3-4.3z"/><circle cx="8" cy="5.9" r="1.6"/>`,
  cap: `<path d="M1.6 6.2 8 3.2l6.4 3-6.4 3-6.4-3z"/><path d="M4.2 7.6v3.6c0 1 1.7 1.9 3.8 1.9s3.8-.9 3.8-1.9V7.6"/><path d="M13.6 6.6v4"/>`,
  target: `<circle cx="8" cy="8" r="5.9"/><circle cx="8" cy="8" r="2.6"/><path d="M8 .8v2.2M8 13v2.2M.8 8h2.2M13 8h2.2"/>`,
  globe: `<circle cx="8" cy="8" r="6.2"/><path d="M1.8 8h12.4"/><path d="M8 1.8c1.7 1.8 2.6 3.9 2.6 6.2S9.7 12.4 8 14.2C6.3 12.4 5.4 10.3 5.4 8s.9-4.4 2.6-6.2z"/>`,
  mail: `<rect x="1.7" y="3.4" width="12.6" height="9.2" rx="1.8"/><path d="m2.4 4.8 5.6 4 5.6-4"/>`,
};

const SOCIALS = [
  { id: 'github', label: 'GitHub', scale: 16, path: `<path fill="currentColor" stroke="none" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>` },
  { id: 'linkedin', label: 'LinkedIn', scale: 16, path: `<path fill="currentColor" stroke="none" d="M3.6 5.9h2.3v8.1H3.6zM4.75 2.1a1.36 1.36 0 1 1 0 2.72 1.36 1.36 0 0 1 0-2.72zM7.6 5.9h2.2v1.11h.03c.31-.58 1.06-1.2 2.18-1.2 2.33 0 2.76 1.5 2.76 3.46V14h-2.3v-3.84c0-.92-.02-2.1-1.29-2.1-1.29 0-1.49 1-1.49 2.03V14H7.6z"/>` },
  { id: 'x', label: 'X', scale: 24, path: `<path fill="currentColor" stroke="none" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>` },
  { id: 'site', label: 'Portfolio', scale: 16, path: `<circle cx="8" cy="8" r="6.3"/><path d="M1.7 8h12.6"/><path d="M8 1.7c1.75 1.8 2.7 3.95 2.7 6.3S9.75 12.5 8 14.3C6.25 12.5 5.3 10.35 5.3 8s.95-4.5 2.7-6.3z"/>` },
];

/* ------------------------------------------------------------------ *
 * 6. RENDER
 * ------------------------------------------------------------------ */
function render(t) {
  const out = [];
  const p = (s) => out.push(s);

  /* ---------- defs ---------- */
  const defs = [];

  defs.push(`
  <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${t.bg}"/><stop offset=".55" stop-color="${t.bg2}"/><stop offset="1" stop-color="${t.bg}"/>
  </linearGradient>

  <linearGradient id="panelGrad" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0" stop-color="${t.panel}"/><stop offset="1" stop-color="${t.panelTo}"/>
  </linearGradient>

  <linearGradient id="accent" gradientUnits="userSpaceOnUse" x1="${CX}" y1="0" x2="${CR}" y2="0">
    <stop offset="0" stop-color="${t.a1}"><animate attributeName="stop-color" values="${t.a1};${t.a2};${t.a3};${t.a1}" dur="12s" repeatCount="indefinite"/></stop>
    <stop offset=".5" stop-color="${t.a2}"><animate attributeName="stop-color" values="${t.a2};${t.a3};${t.a1};${t.a2}" dur="12s" repeatCount="indefinite"/></stop>
    <stop offset="1" stop-color="${t.a3}"><animate attributeName="stop-color" values="${t.a3};${t.a1};${t.a2};${t.a3}" dur="12s" repeatCount="indefinite"/></stop>
  </linearGradient>

  <linearGradient id="accentLine" gradientUnits="userSpaceOnUse" x1="${CX}" y1="0" x2="${CR}" y2="0">
    <stop offset="0" stop-color="${t.a1}" stop-opacity="0"/>
    <stop offset=".45" stop-color="${t.a2}" stop-opacity=".55"/>
    <stop offset="1" stop-color="${t.a3}" stop-opacity="0"/>
  </linearGradient>

  <!-- ASCII gradient: shifts continuously across the portrait -->
  <linearGradient id="asciiGrad" gradientUnits="userSpaceOnUse"
      x1="${ART_X}" y1="${ART_Y0 - 20}" x2="${ART_X + ART_W}" y2="${ART_Y1}">
    <stop offset="0" stop-color="${t.ascii1}"/>
    <stop offset=".52" stop-color="${t.ascii3}"/>
    <stop offset="1" stop-color="${t.ascii2}"/>
  </linearGradient>

  <linearGradient id="asciiGlow" gradientUnits="userSpaceOnUse"
      x1="${ART_X}" y1="${ART_Y0 - 20}" x2="${ART_X + ART_W}" y2="${ART_Y1}">
    <stop offset="0" stop-color="${t.ascii1}"/>
    <stop offset=".5" stop-color="${t.ascii3}"/>
    <stop offset="1" stop-color="${t.ascii2}"/>
  </linearGradient>

  <linearGradient id="shimmer" gradientUnits="userSpaceOnUse" x1="-420" y1="0" x2="0" y2="610">
    <stop offset="0" stop-color="${t.a2}" stop-opacity="0"/>
    <stop offset=".42" stop-color="${t.a2}" stop-opacity=".85"/>
    <stop offset=".5" stop-color="${t.text}" stop-opacity=".9"/>
    <stop offset=".58" stop-color="${t.a1}" stop-opacity=".85"/>
    <stop offset="1" stop-color="${t.a1}" stop-opacity="0"/>
  </linearGradient>

  <linearGradient id="glassSweep" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${t.glass}" stop-opacity="0"/>
    <stop offset=".5" stop-color="${t.glass}" stop-opacity="${t.glassOp}"/>
    <stop offset="1" stop-color="${t.glass}" stop-opacity="0"/>
  </linearGradient>

  <linearGradient id="glassTop" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${t.glass}" stop-opacity="${n(t.glassOp * 1.6)}"/>
    <stop offset="1" stop-color="${t.glass}" stop-opacity="0"/>
  </linearGradient>

  <linearGradient id="scan" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${t.glow}" stop-opacity="0"/>
    <stop offset=".5" stop-color="${t.glow}" stop-opacity="1"/>
    <stop offset="1" stop-color="${t.glow}" stop-opacity="0"/>
  </linearGradient>

  <radialGradient id="blobA"><stop offset="0" stop-color="${t.blobA}" stop-opacity="${t.blobOp}"/><stop offset="1" stop-color="${t.blobA}" stop-opacity="0"/></radialGradient>
  <radialGradient id="blobB"><stop offset="0" stop-color="${t.blobB}" stop-opacity="${t.blobOp}"/><stop offset="1" stop-color="${t.blobB}" stop-opacity="0"/></radialGradient>
  <radialGradient id="blobC"><stop offset="0" stop-color="${t.blobC}" stop-opacity="${n(t.blobOp * 0.8)}"/><stop offset="1" stop-color="${t.blobC}" stop-opacity="0"/></radialGradient>
  <radialGradient id="vignette" cx=".5" cy=".5" r=".72">
    <stop offset=".55" stop-color="${t.bg}" stop-opacity="0"/><stop offset="1" stop-color="${t.bg}" stop-opacity="${t.name === 'dark' ? '.55' : '.12'}"/>
  </radialGradient>

  <filter id="fBlobs" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="55"/></filter>
  <filter id="fGlow" x="-70%" y="-70%" width="240%" height="240%">
    <feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="fGlowSm" x="-90%" y="-90%" width="280%" height="280%">
    <feGaussianBlur stdDeviation="1.7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="fPill" x="-60%" y="-180%" width="220%" height="460%">
    <feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="fShadow" x="-20%" y="-20%" width="140%" height="150%">
    <feDropShadow dx="0" dy="18" stdDeviation="26" flood-color="${t.shadow}" flood-opacity="1"/>
  </filter>
  <filter id="fNoise" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>

  <pattern id="noisePat" width="180" height="180" patternUnits="userSpaceOnUse">
    <rect width="180" height="180" filter="url(#fNoise)"/>
  </pattern>
  <pattern id="gridPat" width="34" height="34" patternUnits="userSpaceOnUse">
    <path d="M34 0H0v34" fill="none" stroke="${t.muted}" stroke-width=".5" stroke-opacity="${t.gridOp}"/>
  </pattern>

  <clipPath id="cardClip"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${R}"/></clipPath>
  <clipPath id="leftClip"><rect x="${L.x}" y="${L.y}" width="${L.w}" height="${L.h}" rx="${L.r}"/></clipPath>
  <clipPath id="rightClip"><rect x="${Rt.x}" y="${Rt.y}" width="${Rt.w}" height="${Rt.h}" rx="${Rt.r}"/></clipPath>
  <clipPath id="artClip"><rect x="${ART_X - 4}" y="${ART_Y0 - 16}" width="${ART_W + 8}" height="${ROWS * ART_LH + 8}"/></clipPath>`);

  /* per-line typing clips for the ASCII art */
  ART.forEach((_, i) => {
    const y = ART_Y0 + i * ART_LH;
    defs.push(`  <clipPath id="ln${i}"><rect x="${ART_X}" y="${n(y - ART_FS * 0.86)}" width="${ART_W}" height="${n(ART_LH + 2)}">` +
      wipeIn(0.35 + i * 0.12, 0.34, ART_W) + `</rect></clipPath>`);
  });

  /* The glyphs live once in <defs> and are drawn twice. The glow copy takes a
     *static* gradient so WebKit can cache the blurred layer instead of
     re-running the filter every frame; the sharp copy on top carries the
     animated gradient and no filter at all. Every glyph gets an explicit x so
     the grid is exact in any monospace font, and spaces are NBSP so no
     whitespace collapsing can shift a column. */
  const artLines = [`  <g id="artLines" class="m" font-size="${ART_FS}" xml:space="preserve">`];
  ART.forEach((line, r) => {
    const lv = (LEV[r] || '').padEnd(COLS, '0');
    const y = n(ART_Y0 + r * ART_LH);
    for (let L = 1; L < TONE.length; L++) {
      const xs = [], gs = [];
      for (let c = 0; c < COLS; c++) {
        const ch = line[c] || ' ';
        if (lv[c] !== String(L) || ch === ' ') continue;
        xs.push(n(ART_X + c * (ART_W / COLS)));
        gs.push(ch);
      }
      if (!xs.length) continue;
      const op = n(t.toneMin + (1 - t.toneMin) * (L - 1) / (TONE.length - 2));
      artLines.push(`   <text x="${xs.join(' ')}" y="${y}" fill-opacity="${op}" clip-path="url(#ln${r})">${esc(gs.join(''))}</text>`);
    }
  });
  artLines.push('  </g>');
  defs.push(artLines.join('\n'));

  /* role typewriter clips */
  const roleFS = 20, roleCW = cw(roleFS), ROLE_X = CX, ROLE_Y = 182;
  const roleBase = 1.9;
  PROFILE.roles.forEach((r, i) => {
    const k = typeKeys(r.length, roleCW, i * SLOT, 1.7, 1.75, 0.85);
    defs.push(`  <clipPath id="role${i}"><rect x="${ROLE_X}" y="${ROLE_Y - 18}" width="${i === 0 ? n(r.length * roleCW) : 0}" height="26">` +
      `<animate attributeName="width" values="${k.values}" keyTimes="${k.keyTimes}" dur="${T_CYCLE}s" begin="${roleBase}s" repeatCount="indefinite" calcMode="discrete"/>` +
      `</rect></clipPath>`);
  });

  /* prompt line typing clip */
  const promptTxt = '$ whoami --profile';
  const pFS = 13.5, pCW = cw(pFS);
  const pTotal = 1.25, pK = n(0.35 / pTotal);
  const pVals = ['0', ...Array.from({ length: promptTxt.length + 1 }, (_, i) => n(i * pCW))];
  const pKeys = pVals.map((_, i) => i === 0 ? 0 : n(pK + (1 - pK) * ((i - 1) / (pVals.length - 2))));
  defs.push(`  <clipPath id="promptClip"><rect x="${CX}" y="84" width="${n(promptTxt.length * pCW)}" height="20">` +
    `<animate attributeName="width" values="${pVals.join(';')}" keyTimes="${pKeys.join(';')}" ` +
    `dur="${pTotal}s" fill="freeze" calcMode="discrete"/></rect></clipPath>`);

  p(`<defs>${defs.join('\n')}\n</defs>`);

  /* ---------- style ---------- */
  p(`<style>
    .t{font-family:${sans}}
    .m{font-family:${mono}}
    .pill,.soc{transform-box:fill-box;transform-origin:center;transition:transform .28s cubic-bezier(.2,.8,.2,1),filter .28s ease}
    .pill:hover{transform:scale(1.09)}
    .pill:hover .pbg{stroke:${t.a2};stroke-opacity:.85;filter:url(#fPill)}
    .pill:hover .ptx{fill:${t.text}}
    .soc:hover{transform:translateY(-3px) scale(1.1)}
    .soc:hover .sbg{stroke:${t.a2};stroke-opacity:.8;filter:url(#fPill)}
    .soc:hover .sic{color:${t.a2}}
  </style>`);

  /* ---------- background ---------- */
  p(`<g clip-path="url(#cardClip)">`);
  p(`  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>`);
  p(`  <rect width="${W}" height="${H}" fill="url(#gridPat)"/>`);

  /* floating radial glows */
  p(`  <g opacity=".95">
    <ellipse cx="210" cy="120" rx="260" ry="190" fill="url(#blobA)">
    </ellipse>
    <ellipse cx="880" cy="90" rx="300" ry="200" fill="url(#blobB)">
    </ellipse>
  </g>`);

  /* particles */
  const rnd = mulberry32(20260725);
  const parts = [];
  for (let i = 0; i < 8; i++) {
    const x = 40 + rnd() * (W - 80);
    const y = 40 + rnd() * (H - 80);
    const r = 0.8 + rnd() * 1.6;
    const rx = 12 + rnd() * 26, ry = 16 + rnd() * 34;
    const dur = 16 + rnd() * 16;
    const col = [t.a2, t.a1, t.a3, t.text][i % 4];
    const op = 0.18 + rnd() * 0.4;
    parts.push(`  <g transform="translate(${n(x)},${n(y)})"><circle r="${n(r)}" fill="${col}" opacity="${n(op)}">
      <animate attributeName="opacity" values="${n(op)};${n(op * 0.15)};${n(op)}" dur="${n(4 + rnd() * 6)}s" repeatCount="indefinite"/>
      <animateMotion dur="${n(dur)}s" repeatCount="indefinite" begin="-${n(rnd() * dur)}s" path="${loopPath(n(rx), n(ry))}"/>
    </circle></g>`);
  }
  p(parts.join('\n'));


  p(`  <rect width="${W}" height="${H}" fill="url(#vignette)"/>`);
  p(`</g>`);

  /* =================== LEFT PANEL =================== */
  p(`<g filter="url(#fShadow)"><rect x="${L.x}" y="${L.y}" width="${L.w}" height="${L.h}" rx="${L.r}" fill="url(#panelGrad)" fill-opacity="${t.panelOp}"/></g>`);
  p(`<g clip-path="url(#leftClip)">`);
  p(`  <rect x="${L.x}" y="${L.y}" width="${L.w}" height="90" fill="url(#glassTop)"/>`);
  /* glass sweep */

  /* left header */
  p(`  <g class="m" font-size="11.5" letter-spacing="1.6">
    <circle cx="${L.x + 26}" cy="${L.y + 30}" r="3.4" fill="${t.a3}">
      <animate attributeName="opacity" values="1;.25;1" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    <text x="${L.x + 38}" y="${L.y + 34}" fill="${t.muted}">portrait.ascii</text>
    <text x="${L.x + L.w - 24}" y="${L.y + 34}" text-anchor="end" fill="${t.faint}">${COLS}×${ROWS}</text>
  </g>`);
  p(`  <path d="M${L.x + 24} ${L.y + 52}H${L.x + L.w - 24}" stroke="${t.borderStrong}" stroke-width="1" stroke-opacity=".5"/>`);

  /* ASCII art */
  p(`  <g clip-path="url(#artClip)">`);
  p(`   <use href="#artLines" xlink:href="#artLines" fill="url(#asciiGlow)" opacity=".22" filter="url(#fGlow)"/>`);
  p(`   <g>
     <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="7s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>`);
  /* every glyph gets an explicit x so the grid is exact in any monospace font,
     and spaces are NBSP so no whitespace collapsing can shift a column */
  p(`    <use href="#artLines" xlink:href="#artLines" fill="url(#asciiGrad)"/>`);

  /* typing cursor that follows the reveal */
  const curAnims = ART.map((_, i) => {
    const b = n(0.35 + i * 0.12);
    return `     <animate attributeName="x" from="${ART_X}" to="${ART_X + ART_W}" begin="${b}s" dur=".34s" fill="freeze" calcMode="spline" keySplines=".2 .6 .3 1"/>\n` +
      `     <animate attributeName="y" to="${n(ART_Y0 + i * ART_LH - 10)}" begin="${b}s" dur=".01s" fill="freeze"/>`;
  }).join('\n');
  p(`    <rect x="${ART_X}" y="${ART_Y0 - 10}" width="7.6" height="12" fill="${t.a2}" opacity=".9" filter="url(#fGlowSm)">
${curAnims}
     <animate attributeName="opacity" values=".95;0;.95" dur="1.05s" begin="${n(0.35 + ROWS * 0.12 + 0.3)}s" repeatCount="indefinite"/>
    </rect>`);
  p(`   </g>`);
  /* scanline inside the portrait */
  p(`   <rect x="${ART_X - 4}" y="${ART_Y0 - 16}" width="${ART_W + 8}" height="26" fill="url(#scan)" opacity=".16">
     <animate attributeName="y" values="${ART_Y0 - 26};${ART_Y1 + 10}" dur="3.6s" repeatCount="indefinite"/>
   </rect>`);
  p(`  </g>`);

  /* left footer */
  const lfY = 546;
  p(`  <path d="M${L.x + 24} ${lfY - 26}H${L.x + L.w - 24}" stroke="${t.borderStrong}" stroke-width="1" stroke-opacity=".45"/>`);
  p(`  <g class="m" font-size="11.5">
    ${fadeIn(4.1, .7)}
    <text x="${L.x + 24}" y="${lfY}" fill="${t.a3}">❯</text>
    <text x="${L.x + 40}" y="${lfY}" fill="${t.muted}" letter-spacing=".6">render complete</text>
    <rect x="${L.x + 148}" y="${lfY - 9}" width="7" height="11" fill="${t.a2}">
      <animate attributeName="opacity" values="1;0;1" dur="1.05s" repeatCount="indefinite"/>
    </rect>
    <text x="${L.x + L.w - 24}" y="${lfY}" text-anchor="end" fill="${t.faint}" letter-spacing="1">60 FPS</text>
  </g>`);

  p(`  <rect x="${L.x + .5}" y="${L.y + .5}" width="${L.w - 1}" height="${L.h - 1}" rx="${L.r}" fill="none" stroke="${t.border}"/>`);
  p(`</g>`);

  /* =================== RIGHT PANEL =================== */
  p(`<g filter="url(#fShadow)"><rect x="${Rt.x}" y="${Rt.y}" width="${Rt.w}" height="${Rt.h}" rx="${Rt.r}" fill="url(#panelGrad)" fill-opacity="${t.panelOp}"/></g>`);
  p(`<g clip-path="url(#rightClip)">`);
  p(`  <rect x="${Rt.x}" y="${Rt.y}" width="${Rt.w}" height="120" fill="url(#glassTop)"/>`);

  /* title bar */
  p(`  <path d="M${Rt.x} ${Rt.y + 40}H${Rt.x + Rt.w}" stroke="${t.borderStrong}" stroke-width="1" stroke-opacity=".45"/>`);
  ['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, i) => {
    p(`  <circle cx="${Rt.x + 24 + i * 18}" cy="${Rt.y + 20}" r="5" fill="${c}" opacity="${t.name === 'dark' ? '.9' : '.95'}"/>`);
  });
  p(`  <text class="m" x="${Rt.x + Rt.w / 2}" y="${Rt.y + 24}" text-anchor="middle" font-size="11.5" fill="${t.faint}" letter-spacing=".8">${esc(PROFILE.handle)} — zsh — 132×40</text>`);

  /* prompt */
  p(`  <g class="m" font-size="${pFS}" clip-path="url(#promptClip)">
    <text x="${CX}" y="98" fill="${t.a3}">$</text>
    <text x="${CX + pCW * 2}" y="98" fill="${t.muted}">${esc(promptTxt.slice(2))}</text>
  </g>`);

  /* greeting */
  p(`  <g>
    ${fadeIn(1.15, .65)}
    ${slideIn(1.15, .65, '0 10')}
    <text class="t" x="${CX}" y="140" font-size="34" font-weight="700" fill="${t.text}" letter-spacing="-.6" xml:space="preserve">Hi&#160;<tspan font-size="30">👋</tspan>&#160;I'm&#160;<tspan fill="url(#accent)" filter="url(#fGlowSm)">${esc(PROFILE.name)}</tspan></text>
  </g>`);

  /* role typewriter */
  const longest = Math.max(...PROFILE.roles.map((r) => r.length));
  p(`  <g>
    ${fadeIn(roleBase, .45)}
    <g class="m" font-size="${roleFS}" font-weight="500">`);
  PROFILE.roles.forEach((r, i) => {
    p(`      <text x="${ROLE_X}" y="${ROLE_Y}" fill="url(#accent)" clip-path="url(#role${i})" xml:space="preserve" textLength="${n(r.length * roleCW)}" lengthAdjust="spacing">${esc(r).replace(/ /g, '&#160;')}</text>`);
  });
  /* caret: one continuous keyframe track across the whole cycle */
  const ct = caretTrack(PROFILE.roles, roleCW, ROLE_X, 1.7, 1.75, 0.85);
  p(`      <rect x="${ROLE_X}" y="${ROLE_Y - 16}" width="9" height="21" fill="${t.a2}" opacity=".85" filter="url(#fGlowSm)">
        <animate attributeName="x" values="${ct.values}" keyTimes="${ct.keyTimes}" dur="${T_CYCLE}s" begin="${roleBase}s" repeatCount="indefinite" calcMode="discrete"/>
        <animate attributeName="opacity" values=".9;.15;.9" dur="1.05s" repeatCount="indefinite"/>
      </rect>
    </g>
  </g>`);

  /* divider */
  p(`  <path d="M${CX} 206H${CR}" stroke="url(#accentLine)" stroke-width="1"/>`);

  /* info rows */
  const infoY0 = 240, infoLH = 32;
  PROFILE.info.forEach(([label, value, icon], i) => {
    const y = infoY0 + i * infoLH;
    const b = n(2.35 + i * 0.3);
    p(`  <g>
    ${fadeIn(b, .55)}
    ${slideIn(b, .55, '-16 0')}
    <g transform="translate(${CX},${y - 12}) scale(.88)" fill="none" stroke="${t.a2}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity=".9">${ICONS[icon]}</g>
    <text class="m" x="${CX + 26}" y="${y}" font-size="12.5" fill="${t.faint}" letter-spacing="1.1">${esc(label.toUpperCase())}</text>
    <text class="m" x="${CX + 132}" y="${y}" font-size="13.5" fill="${t.text}">${esc(value)}</text>
  </g>`);
  });

  /* skills */
  p(`  <g>${fadeIn(4.05, .5)}
    <text class="m" x="${CX}" y="424" font-size="12.5" fill="${t.faint}" letter-spacing="1.1">$ ls ~/stack</text>
  </g>`);

  const pillFS = 13, pillH = 30;
  let pi = 0;
  PROFILE.skills.forEach((row, ri) => {
    let x = CX;
    const cy = 452 + ri * 40;
    row.forEach((s) => {
      const w = Math.round(s.length * cw(pillFS) + 28);
      const b = n(4.25 + pi * 0.075);
      p(`  <g transform="translate(${n(x + w / 2)},${cy})">
    ${fadeIn(b, .45)}
    ${popIn(b, .55, '.7')}
    <g class="pill">
      <rect class="pbg" x="${-w / 2}" y="${-pillH / 2}" width="${w}" height="${pillH}" rx="${pillH / 2}" fill="${t.pillBg}" stroke="${t.pillStroke}">
        <animate attributeName="stroke" values="${t.pillStroke};${t.a2};${t.pillStroke}" dur="6s" begin="${n(b + pi * 0.25)}s" repeatCount="indefinite"/>
        <animate attributeName="stroke-opacity" values=".35;.9;.35" dur="6s" begin="${n(b + pi * 0.25)}s" repeatCount="indefinite"/>
      </rect>
      <text class="m ptx" x="0" y="4.5" text-anchor="middle" font-size="${pillFS}" fill="${t.muted}">${esc(s)}</text>
    </g>
  </g>`);
      x += w + 11;
      pi++;
    });
  });

  /* divider + socials */
  p(`  <path d="M${CX} 516H${CR}" stroke="url(#accentLine)" stroke-width="1" opacity=".8"/>`);
  SOCIALS.forEach((s, i) => {
    const cx = CX + 20 + i * 52, cy = 549, b = n(5.05 + i * 0.12);
    const k = 26 / s.scale * 0.62;
    const href = PROFILE.links[s.id] || '#';
    p(`  <g transform="translate(${cx},${cy})">
    ${fadeIn(b, .5)}
    ${popIn(b, .6, '.6')}
    <a href="${esc(href)}" xlink:href="${esc(href)}" target="_blank" rel="noopener noreferrer"><title>${esc(s.label)}</title>
    <g class="soc">
      <circle class="sbg" r="18" fill="${t.pillBg}" stroke="${t.pillStroke}"/>
      <g class="sic" color="${t.muted}" transform="translate(${n(-s.scale * k / 2)},${n(-s.scale * k / 2)}) scale(${n(k)})" fill="none" stroke="currentColor" stroke-width="1.4">${s.path}</g>
      <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -3;0 0" dur="${n(5 + i * 0.7)}s" begin="${n(b + 0.6)}s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>
    </g></a>
  </g>`);
  });

  /* status */
  p(`  <g>${fadeIn(5.6, .6)}
    <text class="m" x="${CR}" y="553" text-anchor="end" font-size="11.5" fill="${t.muted}" letter-spacing="1.4">${esc(PROFILE.status)}</text>
    <circle cx="${CR - PROFILE.status.length * cw(11.5) - PROFILE.status.length * 1.4 - 14}" cy="549" r="4" fill="${t.a3}">
      <animate attributeName="opacity" values="1;.2;1" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="r" values="4;4.8;4" dur="2s" repeatCount="indefinite"/>
    </circle>
  </g>`);

  p(`  <rect x="${Rt.x + .5}" y="${Rt.y + .5}" width="${Rt.w - 1}" height="${Rt.h - 1}" rx="${Rt.r}" fill="none" stroke="${t.border}"/>`);
  p(`</g>`);

  /* =================== CARD BORDER + SHIMMER =================== */
  p(`<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${R}" fill="none" stroke="${t.borderStrong}" stroke-width="1"/>`);
  p(`<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${R}" fill="none" stroke="url(#shimmer)" stroke-width="1.4" opacity=".9"/>`);
  p(`<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${R}" fill="none" stroke="${t.a2}" stroke-width="1.6" stroke-opacity=".9" stroke-linecap="round" stroke-dasharray="180 3400">
    <animate attributeName="stroke-dashoffset" values="0;-3580" dur="9s" repeatCount="indefinite"/>
  </rect>`);

  /* noise on top of everything */
  p(`<g clip-path="url(#cardClip)" opacity="${t.noiseOp}">
    <rect width="${W}" height="${H}" fill="url(#noisePat)"/>
  </g>`);

  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" `
    + `width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" role="img" `
    + `aria-label="${esc(PROFILE.name)} — ${esc(PROFILE.roles.join(', '))}">\n`
    + `<title>${esc(PROFILE.name)} · GitHub profile banner (${t.name})</title>\n`
    + out.join('\n') + `\n</svg>\n`;
}

/* ------------------------------------------------------------------ *
 * 7. LINKABLE SOCIAL BUTTONS
 * Inside a README the banner is an <img>, so an <a> inside it can never be
 * clicked. These are separate small images: each one gets wrapped in a normal
 * markdown link, which is the only thing GitHub actually makes clickable.
 * Colors are picked to read on both the light and the dark GitHub theme.
 * ------------------------------------------------------------------ */
function renderButton(s) {
  const P = s.id + '-';   // unique ids so several buttons can be inlined side by side
  const fs_ = 13, bw = Math.round(52 + s.label.length * cw(fs_) + 20), bh = 44;
  const k = 26 / s.scale * 0.62;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${bw}" height="${bh}" viewBox="0 0 ${bw} ${bh}" fill="none" role="img" aria-label="${esc(s.label)}">
<title>${esc(s.label)}</title>
<defs>
  <linearGradient id="${P}bs" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${bw}" y2="${bh}">
    <stop offset="0" stop-color="#7C3AED" stop-opacity=".75"><animate attributeName="stop-color" values="#7C3AED;#22D3EE;#10B981;#7C3AED" dur="9s" repeatCount="indefinite"/></stop>
    <stop offset="1" stop-color="#0EA5E9" stop-opacity=".75"><animate attributeName="stop-color" values="#22D3EE;#10B981;#7C3AED;#22D3EE" dur="9s" repeatCount="indefinite"/></stop>
  </linearGradient>
  <linearGradient id="${P}bi" gradientUnits="userSpaceOnUse" x1="16" y1="12" x2="40" y2="34">
    <stop offset="0" stop-color="#3B82F6"><animate attributeName="stop-color" values="#3B82F6;#06B6D4;#3B82F6" dur="7s" repeatCount="indefinite"/></stop>
    <stop offset="1" stop-color="#06B6D4"><animate attributeName="stop-color" values="#06B6D4;#7C3AED;#06B6D4" dur="7s" repeatCount="indefinite"/></stop>
  </linearGradient>
  <linearGradient id="${P}sw" gradientUnits="userSpaceOnUse" x1="-90" y1="0" x2="0" y2="44">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset=".5" stop-color="#ffffff" stop-opacity=".16"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="${bw + 180} 0" dur="5s" repeatCount="indefinite"/>
  </linearGradient>
  <filter id="${P}bg" x="-40%" y="-90%" width="180%" height="280%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="${P}bc"><rect x="1" y="1" width="${bw - 2}" height="${bh - 2}" rx="${(bh - 2) / 2}"/></clipPath>
</defs>
<rect x="1" y="1" width="${bw - 2}" height="${bh - 2}" rx="${(bh - 2) / 2}" fill="#8AA0BE" fill-opacity=".08"/>
<g clip-path="url(#${P}bc)"><rect x="0" y="0" width="${bw}" height="${bh}" fill="url(#${P}sw)"/></g>
<rect x="1" y="1" width="${bw - 2}" height="${bh - 2}" rx="${(bh - 2) / 2}" fill="none" stroke="url(#${P}bs)" stroke-width="1.2">
  <animate attributeName="stroke-opacity" values=".6;1;.6" dur="4s" repeatCount="indefinite"/>
</rect>
<g transform="translate(${n(22 - s.scale * k / 2)},${n(bh / 2 - s.scale * k / 2)}) scale(${n(k)})" fill="none" stroke="url(#${P}bi)" stroke-width="1.4" filter="url(#${P}bg)">${s.path.replace(/currentColor/g, `url(#${P}bi)`)}</g>
<text x="44" y="${bh / 2 + 4.5}" font-family="${mono}" font-size="${fs_}" fill="#64748B" letter-spacing=".3">${esc(s.label)}</text>
</svg>
`;
}

/* ------------------------------------------------------------------ */
for (const key of ['dark', 'light']) {
  const file = path.join(__dirname, `${key}.svg`);
  fs.writeFileSync(file, render(THEMES[key]));
  console.log(`✓ ${file}  (${(fs.statSync(file).size / 1024).toFixed(1)} KB)`);
}
for (const s of SOCIALS) {
  const file = path.join(__dirname, `btn-${s.id}.svg`);
  fs.writeFileSync(file, renderButton(s));
  console.log(`✓ ${file}  (${(fs.statSync(file).size / 1024).toFixed(1)} KB)`);
}
