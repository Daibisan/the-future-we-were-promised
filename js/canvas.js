// --- CANVAS LATAR BELAKANG INTERAKTIF ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let particles = [];
let waves = [];
let rippleGrid = null;
let angleOffset = 0;

let clouds = [
  { x: window.innerWidth * 0.1, y: window.innerHeight * 0.15, scale: 0.8, speed: 0.08 },
  { x: window.innerWidth * 0.5, y: window.innerHeight * 0.25, scale: 1.1, speed: 0.05 },
  { x: window.innerWidth * 0.8, y: window.innerHeight * 0.1, scale: 0.6, speed: 0.12 }
];

window.addEventListener('resize', () => {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  initializeGridAndStructures();
});

function initializeGridAndStructures() {
  rippleGrid = [];
  const cols = Math.ceil(canvasWidth / 40);
  const rows = Math.ceil(canvasHeight / 40);
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      rippleGrid.push({
        origX: x * 40,
        origY: y * 40,
        x: x * 40,
        y: y * 40,
        color: 'rgba(0, 255, 102, 0.15)'
      });
    }
  }
}
initializeGridAndStructures();

// --- LOOP UTAMA RENDERING GRAPHICS ---
function render() {
  const themeId = genres[currentThemeIndex].id;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Menggambar gradasi latar belakang khas untuk tiap tema aktif
  if (themeId === 'frutiger-aero') {
    drawAeroBackground(ctx, canvasWidth, canvasHeight);
  } else if (themeId === 'dorfic') {
    drawDorficBackground(ctx, canvasWidth, canvasHeight);
  } else if (themeId === 'dark-aero') {
    drawDarkAeroBackground(ctx, canvasWidth, canvasHeight);
  } else if (themeId === 'clean-core') {
    drawCleanCoreBackground(ctx, canvasWidth, canvasHeight);
  } else if (themeId === 'frutiger-metro') {
    drawMetroBackground(ctx, canvasWidth, canvasHeight);
  }

  if (themeId === 'dorfic' || themeId === 'dark-aero') {
    waves.forEach((w, idx) => {
      w.radius += w.speed;
      ctx.save();
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      if (themeId === 'dorfic') {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.65 * (1.0 - (w.radius / w.maxRadius))})`;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFB74D';
      } else {
        ctx.strokeStyle = `rgba(0, 255, 102, ${1.0 - (w.radius / w.maxRadius)})`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ff66';
      }
      ctx.stroke();
      ctx.restore();

      if (w.radius >= w.maxRadius) {
        waves.splice(idx, 1);
      }
    });
  }

  particles.forEach((p, idx) => {
    p.update();
    p.draw();

    if (p.isExplosion && (p.life <= 0 || p.shouldRemove)) {
      particles.splice(idx, 1);
    }
  });

  requestAnimationFrame(render);
}

// --- INTERAKSI EVENT CANVAS ---
let activeClickAnimations = [];
window.addEventListener('click', (e) => {
  // Jika kursor berada di atas panel informasi, bypass semua interaksi background
  if (isHoveringInfoPanel) return;

  if (e.target.closest(interactiveElements)) {
    playInterfaceClickSound();
    return;
  }

  const themeId = genres[currentThemeIndex].id;

  if (themeId === 'frutiger-aero') {
    let poppedBubble = false;
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      if (p.themeId === 'frutiger-aero' && (p.faType === 'large-empty' || p.faType === 'leaf')) {
        const dx = e.clientX - p.x;
        const dy = e.clientY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < p.radius) {
          // Letuskan gelembung!
          particles.splice(i, 1);
          poppedBubble = true;
          
          playThemeSound('bubble-pop');
          
          // Efek letusan gelembung kecil pecah terbang keluar
          const bubbleBurstCount = p.faType === 'leaf' ? 8 : 10;
          for (let k = 0; k < bubbleBurstCount; k++) {
            const tempP = new Particle(p.x, p.y, 'frutiger-aero', true, 'empty');
            tempP.speedX = (Math.random() - 0.5) * 6;
            tempP.speedY = (Math.random() - 0.5) * 6;
            tempP.radius = Math.random() * 4 + 2;
            particles.push(tempP);
          }

          if (p.faType === 'leaf') {
            // Spawn daun jatuh bebas dari gelembung yang meletus
            const fallingLeaf = new Particle(p.x, p.y, 'frutiger-aero', true, 'falling-leaf');
            fallingLeaf.radius = p.radius;
            fallingLeaf.leafRotation = p.leafRotation;
            fallingLeaf.leafRotSpeed = (Math.random() - 0.5) * 0.05;
            particles.push(fallingLeaf);

            // Respawn gelembung daun baru di bagian bawah setelah 2.5 detik
            setTimeout(() => {
              if (genres[currentThemeIndex].id === 'frutiger-aero') {
                particles.push(new Particle(Math.random() * canvasWidth, canvasHeight + 50, 'frutiger-aero', false, 'leaf'));
              }
            }, 2500);
          } else {
            // Respawn gelembung kosong besar baru di bagian bawah setelah 2.5 detik
            setTimeout(() => {
              if (genres[currentThemeIndex].id === 'frutiger-aero') {
                particles.push(new Particle(Math.random() * canvasWidth, canvasHeight + 60, 'frutiger-aero', false, 'large-empty'));
              }
            }, 2500);
          }
          
          break; // Letuskan satu gelembung saja per klik
        }
      }
    }
    
    if (poppedBubble) {
      document.body.classList.remove('hovering-large-bubble');
      return; // Batalkan interaksi gelombang ripple klik latar belakang biasa
    }
  }

  // Batasi jumlah animasi klik interaktif maksimal 5
  const clickId = Math.random();
  if (activeClickAnimations.length >= 5) {
    const oldest = activeClickAnimations.shift();
    particles = particles.filter(p => p.clickId !== oldest.id);
    waves = waves.filter(w => w.clickId !== oldest.id);
  }
  activeClickAnimations.push({ id: clickId, type: themeId });
  setTimeout(() => {
    const index = activeClickAnimations.findIndex(anim => anim.id === clickId);
    if (index !== -1) {
      activeClickAnimations.splice(index, 1);
    }
  }, 1500);

  playThemeSound(genres[currentThemeIndex].soundType);

  if (themeId === 'frutiger-aero' || themeId === 'clean-core') {
    const count = themeId === 'clean-core' ? 8 : 12;
    for (let i = 0; i < count; i++) {
      const p = new Particle(e.clientX, e.clientY, themeId, true);
      p.clickId = clickId;
      p.speedX = (Math.random() - 0.5) * 6;
      p.speedY = -(Math.random() * 4 + 1);
      particles.push(p);
    }
  } else if (themeId === 'dorfic') {
    // Meluncurkan riak air pendorong es dan lemon
    waves.push({
      clickId: clickId,
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: 280,
      speed: 6.5,
      color: 'rgba(255, 255, 255, 0.45)'
    });

    // Impuls dorongan air soda oranye dorfic
    particles.forEach(p => {
      const dx = p.x - e.clientX;
      const dy = p.y - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 280) {
        const force = (280 - dist) / 280 * 18;
        p.vx += (dx / (dist || 1)) * force;
        p.vy += (dy / (dist || 1)) * force;
      }
    });

  } else if (themeId === 'dark-aero') {
    waves.push({
      clickId: clickId,
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: Math.max(canvasWidth, canvasHeight) * 0.4,
      speed: 10,
      color: 'rgba(0, 255, 102, 0.6)'
    });
    for (let i = 0; i < 15; i++) {
      const p = new Particle(e.clientX, e.clientY, themeId, true);
      p.clickId = clickId;
      particles.push(p);
    }
  } else if (themeId === 'frutiger-metro') {
    for (let i = 0; i < 18; i++) {
      const p = new Particle(e.clientX, e.clientY, themeId, true);
      p.clickId = clickId;
      particles.push(p);
    }
  }
});

window.addEventListener('mousemove', (e) => {
  // Lewati warp grid jika berada di atas panel definisi
  if (isHoveringInfoPanel) {
    document.body.classList.remove('hovering-large-bubble');
    return;
  }

  const themeId = genres[currentThemeIndex].id;

  // Deteksi hover pada gelembung besar Frutiger Aero
  if (themeId === 'frutiger-aero') {
    let isHoveringBubble = false;
    for (let p of particles) {
      if (p.themeId === 'frutiger-aero' && (p.faType === 'large-empty' || p.faType === 'leaf')) {
        const dx = e.clientX - p.x;
        const dy = e.clientY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < p.radius) {
          isHoveringBubble = true;
          break;
        }
      }
    }
    if (isHoveringBubble) {
      document.body.classList.add('hovering-large-bubble');
    } else {
      document.body.classList.remove('hovering-large-bubble');
    }
  } else {
    document.body.classList.remove('hovering-large-bubble');
  }

  if (themeId === 'dark-aero' && rippleGrid) {
    rippleGrid.forEach(node => {
      const dx = e.clientX - node.x;
      const dy = e.clientY - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        node.x += dx * force * 0.15;
        node.y += dy * force * 0.15;
      } else {
        node.x += (node.origX - node.x) * 0.1;
        node.y += (node.origY - node.y) * 0.1;
      }
    });
  }
});
