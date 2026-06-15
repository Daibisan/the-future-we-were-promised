// --- DAFTAR CONFIG DATA ESTETIKA (GENRES) ---
const genres = [
  {
    id: 'frutiger-aero',
    name: 'Frutiger Aero',
    tagline: 'The Eco-Optimism Utopia',
    years: 'Circa 2004 – 2013',
    desc: 'A gorgeous, glossy era from the mid-2000s celebrating a brighter future. Defined by rich, saturated sky blues, pristine grass greens, glass textures, floating bubbles, and digital nature, it brings back the comforting, pristine dream of early tech.',
    specs: ['Glass Textures', 'Eco-Optimism', 'Glossy Bubbles', 'Aurora Ribbons'],
    soundType: 'water',
    badge: 'Nostalgia Hub',
    linkText: 'Explore the Online Archive'
  },
  {
    id: 'dorfic',
    name: 'Dorfic',
    tagline: 'The Cozy Translucent Tech',
    years: 'Circa 1999 – 2005',
    desc: 'Warm, glossy, and nostalgic. Dorfic pays homage to friendly translucent orange plastics like the Apple iMac G3, early MSN Messenger interfaces, retro orange soda bubbles, and curvy product styling that made technology feel like home.',
    specs: ['Translucent Plastics', 'Warm Amber Glows', 'Citrus Fruit Accents', 'Friendly Curves'],
    soundType: 'cozy',
    badge: 'Tactile Friendly',
    linkText: 'Explore the Online Archive'
  },
  {
    id: 'dark-aero',
    name: 'Dark Aero',
    tagline: 'The Cyber-Futuristic Abyss',
    years: 'Circa 2005 – 2011',
    desc: 'The rebellious, sci-fi sibling of Frutiger Aero. Shrouded in heavy glossy obsidian plates, dark glass elements, glowing electric green grids, and industrial camera lens designs. Strongly evocative of Xbox dashboards, early gaming computers, and futuristic alien technologies.',
    specs: ['Obsidian Plates', 'Neon Green Glows', 'Cybernetic Grids', 'Sleek Metal Rings'],
    soundType: 'cyber',
    badge: 'Sleek Cyberware',
    linkText: 'Explore the Online Archive'
  },
  {
    id: 'clean-core',
    name: 'Clean Core',
    tagline: 'The Soft Bath & Sanitary Dream',
    years: 'Circa 1998 – 2006',
    desc: 'A gentle, sterile visual sanctuary reminding us of baby shower bubbles, fresh lavender soaps, clean bathroom tiles, and cartoon sun faces. Featuring pale pastel blue-pink gradients, it captures a soft, innocent, and deeply secure domestic dreamscape.',
    specs: ['Soap Foam', 'Gentle Pastel Gradients', 'Clean Tiles', 'Soothing Soft light'],
    soundType: 'bubble',
    badge: 'Sterile Peace',
    linkText: 'Explore the Online Archive'
  },
  {
    id: 'frutiger-metro',
    name: 'Frutiger Metro',
    tagline: 'The Vector & Indie-Pop Pulse',
    years: 'Circa 2004 – 2012',
    desc: 'An energetic explosion of vector arts, flat color block grids, funky dancing silhouettes, exploding flower decals, soundwave splatters, and dynamic star circles. It marks the transition to flat minimalism, driven by urban music and pop energy.',
    specs: ['Bold Silhouettes', 'Retro Pop Stars', 'Splatters & Decals', 'Dynamic Vector Arrows'],
    soundType: 'pop',
    badge: 'Sonic Vibration',
    linkText: 'Explore the Online Archive'
  }
];

// --- STATE MANAGEMENT ---
let currentThemeIndex = 0;
let isHoveringInfoPanel = false;
let isTransitioning = true; // Kunci input selama transisi
const interactiveElements = 'a, button, [data-index], .indicator-dot';

// --- DOM SELECTORS ---
const body = document.body;
const transitionLayer = document.getElementById('transition-layer');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const dots = document.querySelectorAll('.indicator-dot');
const heroTitle = document.getElementById('hero-title');
const tagline = document.getElementById('genre-tagline');
const contentSec = document.getElementById('content-section');
const badge = document.getElementById('genre-badge');
const yearSpan = document.getElementById('genre-year');
const titleName = document.getElementById('genre-name');
const descText = document.getElementById('genre-desc');
const specContainer = document.getElementById('spec-list');
const ctaButton = document.getElementById('cta-button');
const ctaArrow = document.getElementById('cta-arrow');
const orbContent = document.getElementById('orb-content');
const infoPanel = document.getElementById('info-panel');
const githubLink = document.getElementById('github-link');
