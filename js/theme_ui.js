// --- LOGIKA PENGATUR TAMPILAN ELEMEN TEMA (THEME UI) ---

// Menerapkan dinamika gaya visual CTA & Badge
function updateTheme(index, playSoundEnabled) {
  currentThemeIndex = index;
  const theme = genres[index];

  body.setAttribute('data-theme', theme.id);

  if (playSoundEnabled) {
    playThemeSound(theme.soundType);
  }

  heroTitle.innerHTML = `This is ${theme.name}`;
  tagline.innerText = theme.tagline;
  badge.innerText = theme.badge;
  yearSpan.innerText = theme.years;
  titleName.innerText = theme.name;
  descText.innerText = theme.desc;

  // Konfigurasi ulang bullet point karakteristik
  specContainer.innerHTML = '';
  theme.specs.forEach(spec => {
    const item = document.createElement('div');
    item.className = 'flex items-center gap-2 font-semibold transition-all duration-500';

    let bulletSvg = '';
    if (theme.id === 'frutiger-aero' || theme.id === 'dorfic') {
      bulletSvg = `<svg class="w-4 h-4 text-[var(--accent-text,var(--accent))] drop-shadow" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`;
    } else if (theme.id === 'dark-aero') {
      bulletSvg = `<svg class="w-4 h-4 text-emerald-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`;
    } else if (theme.id === 'clean-core') {
      bulletSvg = `<span class="w-3.5 h-3.5 rounded-full bg-sky-200 border border-sky-400 shadow-sm block flex-shrink-0"></span>`;
    } else {
      bulletSvg = `<svg class="w-4 h-4 text-pink-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }

    item.innerHTML = `${bulletSvg} <span>${spec}</span>`;
    specContainer.appendChild(item);
  });

  dots.forEach((dot, dIdx) => {
    if (dIdx === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  customizeSpecifcThemeUI(theme.id);
  resetCanvasParticles(theme.id);
}

// Detail logika penyesuai gaya ornamen visual di luar parameter CSS Tailwind
function customizeSpecifcThemeUI(themeId) {
  const orb = document.getElementById('genre-orb');

  orb.className = "w-36 h-36 md:w-44 md:h-44 rounded-full relative flex items-center justify-center transition-all duration-700 shadow-inner overflow-hidden";
  ctaButton.className = "glossy-shimmer inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer";

  const badge = document.getElementById('genre-badge');
  badge.className = "px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border backdrop-blur-sm transition-all duration-500";

  if (themeId === 'frutiger-aero') {
    orb.classList.add('bg-gradient-to-tr', 'from-blue-500/80', 'to-cyan-200/90', 'border-2', 'border-white/50', 'shadow-[inset_0_4px_12px_rgba(255,255,255,0.8),0_10px_20px_rgba(0,180,216,0.3)]');
    orbContent.innerHTML = `
      <div class="water-wrapper">
        <div class="water-wave wave-behind"></div>
        <div class="water-wave"></div>
      </div>
      <div class="absolute inset-2 rounded-full bg-gradient-to-b from-white/60 to-transparent h-[45%] opacity-80 blur-[1px] z-10 pointer-events-none"></div>
    `;

    ctaButton.className = "glossy-shimmer inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-blue-700 to-sky-500 text-white border border-white/30 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer";
    badge.classList.add('bg-sky-100/80', 'text-sky-700', 'border-sky-300');

    body.style.setProperty('--cursor-dot-color', '#00e5ff');
    body.style.setProperty('--cursor-dot-border', 'rgba(255, 255, 255, 0.8)');
    body.style.setProperty('--cursor-ring-color', 'rgba(0, 229, 255, 0.5)');
    body.style.setProperty('--cursor-radius', '50%');

  } else if (themeId === 'dorfic') {
    orb.classList.add('bg-gradient-to-br', 'from-orange-500/80', 'to-amber-300/90', 'border-2', 'border-white/60', 'shadow-[inset_0_5px_15px_rgba(255,255,255,0.7),0_10px_22px_rgba(230,81,0,0.35)]');
    orbContent.innerHTML = `
      <div class="absolute w-[85%] h-[85%] rounded-full border border-orange-200/40 bg-white/10 flex items-center justify-center font-bold text-white text-3xl">
        <span class="animate-orb-float select-none">🍊</span>
      </div>
    `;

    ctaButton.className = "glossy-shimmer inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-orange-500 to-amber-400 text-white border border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer";
    badge.classList.add('bg-white/20', 'text-white', 'border-white/30');

    body.style.setProperty('--cursor-dot-color', '#4e1d00');
    body.style.setProperty('--cursor-dot-border', '#ffffff');
    body.style.setProperty('--cursor-ring-color', '#4e1d00');
    body.style.setProperty('--cursor-radius', '40% 60% 70% 30% / 40% 50% 60% 50%');

  } else if (themeId === 'dark-aero') {
    orb.classList.add('bg-zinc-950', 'border-2', 'border-emerald-500/50', 'shadow-[0_0_20px_rgba(0,255,102,0.4)]');
    orbContent.innerHTML = `
      <div class="w-full h-full p-2 flex items-center justify-center">
        <div class="w-16 h-16 rounded-full border-4 border-dashed border-emerald-500/75 animate-spin flex items-center justify-center">
          <span class="text-xs text-emerald-400 font-bold font-mono">ON</span>
        </div>
      </div>
    `;

    ctaButton.className = "glossy-shimmer inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-zinc-950 text-emerald-400 border-2 border-emerald-500/60 hover:bg-emerald-950/20 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer";
    badge.classList.add('bg-emerald-950/40', 'text-emerald-400', 'border-emerald-500/40');

    body.style.setProperty('--cursor-dot-color', '#00ff66');
    body.style.setProperty('--cursor-dot-border', 'rgba(255, 255, 255, 0.8)');
    body.style.setProperty('--cursor-ring-color', 'rgba(0, 255, 102, 0.5)');
    body.style.setProperty('--cursor-radius', '0%');

  } else if (themeId === 'clean-core') {
    orb.classList.add('bg-gradient-to-tr', 'from-pink-100', 'to-sky-200', 'border', 'border-white/80', 'shadow-[inset_0_4px_10px_rgba(255,255,255,0.8),0_10px_20px_rgba(186,230,253,0.3)]');
    orbContent.innerHTML = `<span class="animate-orb-float text-4xl select-none">🫧</span>`;

    // Kontras gelap untuk tombol di Clean Core agar terbaca di atas putih susu
    ctaButton.className = "glossy-shimmer inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-sky-600 hover:bg-sky-700 text-white border border-sky-700/20 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer";
    badge.classList.add('bg-sky-100', 'text-sky-700', 'border-sky-200');

    body.style.setProperty('--cursor-dot-color', '#38bdf8');
    body.style.setProperty('--cursor-dot-border', 'rgba(255, 255, 255, 0.8)');
    body.style.setProperty('--cursor-ring-color', 'rgba(244, 114, 182, 0.4)');
    body.style.setProperty('--cursor-radius', '50%');

  } else if (themeId === 'frutiger-metro') {
    orb.classList.add('bg-yellow-300', 'border-4', 'border-black', 'shadow-[6px_6px_0px_rgba(0,0,0,1)]');
    orbContent.innerHTML = `<span class="text-3xl font-black text-black">POP!</span>`;

    // Desain tombol bergaya komik/pop tebal
    ctaButton.className = "glossy-shimmer inline-flex items-center gap-3 px-6 py-3.5 rounded-none font-bold text-sm tracking-wide bg-yellow-300 hover:bg-yellow-400 text-black border-4 border-black shadow-[6px_6px_0px_#000000] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer";
    badge.classList.add('bg-black', 'text-white', 'border-black');

    body.style.setProperty('--cursor-dot-color', '#000000');
    body.style.setProperty('--cursor-dot-border', 'rgba(255, 255, 255, 0.8)');
    body.style.setProperty('--cursor-ring-color', '#ff007f');
    body.style.setProperty('--cursor-radius', '12px');
  }
}
