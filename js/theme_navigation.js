// --- ALUR TRANSISI DAN NAVIGASI TEMA (THEME NAVIGATION) ---

let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;
let isScrolling = false;

prevBtn.addEventListener('click', () => {
  let idx = currentThemeIndex - 1;
  if (idx < 0) idx = genres.length - 1;
  triggerTransition(idx);
});

nextBtn.addEventListener('click', () => {
  let idx = currentThemeIndex + 1;
  if (idx >= genres.length) idx = 0;
  triggerTransition(idx);
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    if (index === currentThemeIndex) return;
    triggerTransition(index);
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    nextBtn.click();
  } else if (e.key === 'ArrowLeft') {
    prevBtn.click();
  }
});

window.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX;
  touchstartY = e.changedTouches[0].screenY;
});

window.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX;
  touchendY = e.changedTouches[0].screenY;
  handleGesture();
});

function handleGesture() {
  const diffX = touchendX - touchstartX;
  const diffY = touchendY - touchstartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Gestur horizontal: Ubah tema
    if (diffX < -60) {
      nextBtn.click();
    }
    if (diffX > 60) {
      prevBtn.click();
    }
  } else {
    // Gestur vertikal: Scroll snap satu langkah (Hero <-> Definition)
    const scrollY = window.scrollY;
    const contentSectionTop = contentSec.offsetTop;

    if (isScrolling) return;

    if (Math.abs(diffY) > 50) {
      if (diffY < -50 && scrollY < 50) {
        // Swipe up: scroll down ke content
        isScrolling = true;
        window.scrollTo({
          top: contentSectionTop,
          behavior: 'smooth'
        });
        setTimeout(() => { isScrolling = false; }, 800);
      } else if (diffY > 50 && Math.abs(scrollY - contentSectionTop) < 50) {
        // Swipe down: scroll up ke hero
        isScrolling = true;
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        setTimeout(() => { isScrolling = false; }, 800);
      }
    }
  }
}

// Intersept wheel scroll untuk snap langsung (Hero <-> Definition) di Desktop
window.addEventListener('wheel', (e) => {
  const scrollY = window.scrollY;
  const contentSectionTop = contentSec.offsetTop;

  if (isScrolling) {
    e.preventDefault();
    return;
  }

  // Dari Hero Section ke Bawah (langsung ke Content)
  if (scrollY < 50 && e.deltaY > 0) {
    e.preventDefault();
    isScrolling = true;
    window.scrollTo({
      top: contentSectionTop,
      behavior: 'smooth'
    });
    setTimeout(() => { isScrolling = false; }, 800);
  }
  // Dari Content Section ke Atas (langsung ke Hero)
  else if (Math.abs(scrollY - contentSectionTop) < 50 && e.deltaY < 0) {
    e.preventDefault();
    isScrolling = true;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setTimeout(() => { isScrolling = false; }, 800);
  }
}, { passive: false });

function scrollToContent() {
  contentSec.scrollIntoView({ behavior: 'smooth' });
}

function triggerTransition(newIndex) {
  if (isTransitioning) return;
  isTransitioning = true;

  transitionLayer.style.opacity = '1';
  setTimeout(() => {
    updateTheme(newIndex, true);
    setTimeout(() => {
      transitionLayer.style.opacity = '0';
      // Lepaskan kunci setelah transisi fade-out selesai
      setTimeout(() => {
        isTransitioning = false;
      }, 220);
    }, 60);
  }, 220);
}
