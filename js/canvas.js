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

class Particle {
  constructor(x, y, themeId, isExplosion = false, faType = 'empty') {
    this.x = x || Math.random() * canvasWidth;
    this.y = y || (themeId === 'dorfic' ? canvasHeight + 50 : Math.random() * canvasHeight);
    this.themeId = themeId;
    this.isExplosion = isExplosion;

    // Fisika Dorfic Lemon & Es
    this.vx = 0;
    this.vy = 0;

    if (themeId === 'frutiger-aero') {
      this.faType = faType;
      if (faType === 'large-empty') {
        this.radius = Math.random() * 8 + 48; // Gelembung besar kosong
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = -(Math.random() * 0.3 + 0.35); // melayang lambat
      } else if (faType === 'leaf') {
        this.radius = Math.random() * 5 + 13; // Gelembung daun sedang
        this.speedX = (Math.random() - 0.5) * 1.1;
        this.speedY = -(Math.random() * 0.7 + 0.45);
        this.leafRotation = Math.random() * Math.PI * 2;
        this.leafRotSpeed = (Math.random() - 0.5) * 0.02;
      } else if (faType === 'falling-leaf') {
        this.radius = Math.random() * 5 + 13;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = Math.random() * 0.8 + 1.2; // Jatuh ke bawah
        this.leafRotation = Math.random() * Math.PI * 2;
        this.leafRotSpeed = (Math.random() - 0.5) * 0.03;
        this.swayOffset = Math.random() * Math.PI * 2;
      } else {
        this.radius = Math.random() * 10 + 4; // Gelembung kosong kecil
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = -(Math.random() * 1.2 + 0.4);
      }
      this.alpha = faType === 'falling-leaf' ? 0.85 : Math.random() * 0.35 + 0.35;
      this.wobbleSpeed = Math.random() * 0.04 + 0.01;
      this.wobbleRange = Math.random() * 1.6;
    } else if (themeId === 'dorfic') {
      // Memisahkan es batu atau irisan lemon
      this.dorficType = Math.random() > 0.5 ? 'lemon' : 'ice';
      this.radius = Math.random() * 22 + 18;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = -(Math.random() * 0.3 + 0.15);
      this.alpha = Math.random() * 0.25 + 0.7;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.015;
      this.wobbleSpeed = Math.random() * 0.02 + 0.005;
      this.wobbleRange = Math.random() * 1.8;
    } else if (themeId === 'dark-aero') {
      this.radius = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 3;
      this.speedY = isExplosion ? (Math.random() - 0.5) * 6 : -(Math.random() * 2 + 0.5);
      this.alpha = 0.8;
      this.life = 1.0;
      this.decay = Math.random() * 0.015 + 0.01;
    } else if (themeId === 'clean-core') {
      this.radius = Math.random() * 20 + 8;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = -(Math.random() * 0.5 + 0.2);
      this.alpha = Math.random() * 0.25 + 0.15;
      this.wobbleSpeed = Math.random() * 0.02 + 0.005;
      this.wobbleRange = Math.random() * 3;
    } else if (themeId === 'frutiger-metro') {
      this.radius = Math.random() * 15 + 5;
      this.speedX = (Math.random() - 0.5) * 6;
      this.speedY = (Math.random() - 0.5) * 6;
      this.alpha = 1;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.1;
      this.color = ['#ff007f', '#00f3ff', '#ffeb3b', '#7f00ff'][Math.floor(Math.random() * 4)];
      this.shape = ['star', 'circle', 'box'][Math.floor(Math.random() * 3)];
      this.life = 1.0;
      this.decay = Math.random() * 0.02 + 0.01;
    }
  }

  update() {
    if (this.themeId === 'dorfic') {
      this.x += this.speedX + this.vx + Math.sin(Date.now() * this.wobbleSpeed) * this.wobbleRange * 0.05;
      this.y += this.speedY + this.vy;
      this.rotation += this.rotSpeed;

      // Perlahan redam impuls dorongan gelombang air dorfic
      this.vx *= 0.94;
      this.vy *= 0.94;

      if (this.y < -50) {
        this.y = canvasHeight + 50;
        this.x = Math.random() * canvasWidth;
        this.vx = 0;
        this.vy = 0;
      }
      if (this.x < -50) this.x = canvasWidth + 50;
      if (this.x > canvasWidth + 50) this.x = -50;

    } else if (this.themeId === 'frutiger-aero' || this.themeId === 'clean-core') {
      if (this.themeId === 'frutiger-aero' && this.faType === 'falling-leaf') {
        this.x += this.speedX + Math.sin(Date.now() * 0.005 + this.swayOffset) * 1.2;
        this.y += this.speedY;
        this.leafRotation += this.leafRotSpeed;
      } else {
        this.x += this.speedX + Math.sin(Date.now() * this.wobbleSpeed) * this.wobbleRange * 0.1;
        this.y += this.speedY;
        if (this.themeId === 'frutiger-aero' && this.faType === 'leaf') {
          this.leafRotation += this.leafRotSpeed;
        }
      }

      const offset = this.radius + 15;
      if (this.y < -offset) {
        if (this.isExplosion) {
          this.shouldRemove = true;
        } else {
          this.y = canvasHeight + offset;
          this.x = Math.random() * canvasWidth;
        }
      }
      if (this.y > canvasHeight + offset) {
        if (this.isExplosion) {
          this.shouldRemove = true;
        } else {
          this.y = -offset;
          this.x = Math.random() * canvasWidth;
        }
      }
      if (this.x < -offset) {
        if (this.isExplosion) {
          this.shouldRemove = true;
        } else {
          this.x = canvasWidth + offset;
        }
      }
      if (this.x > canvasWidth + offset) {
        if (this.isExplosion) {
          this.shouldRemove = true;
        } else {
          this.x = -offset;
        }
      }
    } else if (this.themeId === 'dark-aero') {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
    } else if (this.themeId === 'frutiger-metro') {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;
      if (this.isExplosion) {
        this.life -= this.decay;
      } else {
        if (this.x < 0 || this.x > canvasWidth) this.speedX *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.speedY *= -1;
      }
    }
  }

  draw() {
    ctx.save();
    if (this.themeId === 'frutiger-aero') {
      const r = this.radius;

      ctx.save();
      ctx.translate(this.x, this.y);

      // 1. Gambar Konten di Dalam Gelembung Terlebih Dahulu
      if (this.faType === 'globe') {
        // Lingkaran dasar bumi hijau rumput
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
        let globeGrad = ctx.createLinearGradient(-r * 0.5, -r * 0.5, r * 0.5, r * 0.5);
        globeGrad.addColorStop(0, '#8BC34A');
        globeGrad.addColorStop(1, '#2E7D32');
        ctx.fillStyle = globeGrad;
        ctx.fill();

        // Benua hijau muda
        ctx.fillStyle = '#C8E6C9';

        ctx.beginPath();
        ctx.arc(-r * 0.2, -r * 0.15, r * 0.22, 0, Math.PI * 2);
        ctx.arc(-r * 0.32, -r * 0.25, r * 0.18, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(r * 0.22, r * 0.12, r * 0.25, 0, Math.PI * 2);
        ctx.arc(r * 0.32, -r * 0.05, r * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(-r * 0.08, r * 0.3, r * 0.18, 0, Math.PI * 2);
        ctx.fill();

        // Clip garis koordinat ke tubuh bumi
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
        ctx.clip();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 0.8;

        // Garis bujur (vertikal)
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.4, r * 0.72, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.18, r * 0.72, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Garis lintang (horizontal)
        ctx.beginPath();
        ctx.moveTo(-r, -r * 0.3); ctx.lineTo(r, -r * 0.3);
        ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
        ctx.moveTo(-r, r * 0.3); ctx.lineTo(r, r * 0.3);
        ctx.stroke();

        ctx.restore();
      }

      else if (this.faType === 'nemo') {
        // Clip air di batas gelembung
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.86, 0, Math.PI * 2);
        ctx.clip();

        // Air bergoyang
        ctx.beginPath();
        const waveY = r * 0.1 + Math.sin(Date.now() * 0.004 + this.x * 0.05) * (r * 0.06);
        ctx.rect(-r, waveY, r * 2, r * 2);
        let waterGrad = ctx.createLinearGradient(0, waveY, 0, r);
        waterGrad.addColorStop(0, 'rgba(0, 180, 216, 0.55)');
        waterGrad.addColorStop(1, 'rgba(0, 77, 102, 0.75)');
        ctx.fillStyle = waterGrad;
        ctx.fill();

        // Ikan Nemo kecil berenang
        ctx.save();
        const fishX = Math.sin(Date.now() * 0.0025 + this.wobbleSpeed * 80) * (r * 0.32);
        const fishY = waveY + (r - waveY) * 0.42 + Math.cos(Date.now() * 0.003) * (r * 0.08);
        ctx.translate(fishX, fishY);
        const direction = Math.cos(Date.now() * 0.0025 + this.wobbleSpeed * 80) >= 0 ? 1 : -1;
        ctx.scale(direction, 1);

        const fishW = r * 0.32;
        const fishH = r * 0.19;

        // Ekor
        ctx.beginPath();
        ctx.moveTo(-fishW * 0.4, 0);
        ctx.lineTo(-fishW * 0.75, -fishH * 0.45);
        ctx.lineTo(-fishW * 0.75, fishH * 0.45);
        ctx.closePath();
        ctx.fillStyle = '#FF6D00';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Badan Nemo
        ctx.beginPath();
        ctx.ellipse(0, 0, fishW * 0.5, fishH * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FF6D00';
        ctx.fill();
        ctx.stroke();

        // Belang Putih
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(-fishW * 0.1, 0, fishW * 0.08, fishH * 0.46, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(fishW * 0.14, 0, fishW * 0.07, fishH * 0.43, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Mata hitam
        ctx.beginPath();
        ctx.arc(fishW * 0.28, -fishH * 0.15, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();

        ctx.restore();
        ctx.restore();
      }

      else if (this.faType === 'leaf' || this.faType === 'falling-leaf') {
        ctx.save();
        ctx.rotate(this.leafRotation);

        // Bentuk Daun
        ctx.beginPath();
        const leafW = r * 0.56;
        const leafH = r * 0.26;
        ctx.ellipse(0, 0, leafW, leafH, 0, 0, Math.PI * 2);
        let leafGrad = ctx.createLinearGradient(-leafW, 0, leafW, 0);
        leafGrad.addColorStop(0, '#4CAF50');
        leafGrad.addColorStop(1, '#8BC34A');
        ctx.fillStyle = leafGrad;
        ctx.fill();
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Tulang Daun
        ctx.beginPath();
        ctx.moveTo(-leafW, 0);
        ctx.lineTo(leafW, 0);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore();

      if (this.faType !== 'falling-leaf') {
        // 2. Gambar gelembung luar transparan mengkilap di atas konten
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(this.x - r * 0.35, this.y - r * 0.35, r * 0.3, r * 0.15, Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 1.5})`;
        ctx.fill();
      }

    } else if (this.themeId === 'dorfic') {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.alpha;

      if (this.dorficType === 'lemon') {
        const r = this.radius;
        // Kulit jeruk luar
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = '#FFA726';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Daging putih dalam
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF9C4';
        ctx.fill();

        // Segmen bulir lemon orange
        const segments = 8;
        for (let i = 0; i < segments; i++) {
          const startAngle = (i * 2 * Math.PI) / segments + 0.05;
          const endAngle = ((i + 1) * 2 * Math.PI) / segments - 0.05;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, r * 0.82, startAngle, endAngle);
          ctx.closePath();
          ctx.fillStyle = '#FFB74D';
          ctx.fill();

          // Detailing kilauan air dalam jeruk
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.74, startAngle + 0.1, endAngle - 0.1);
          ctx.strokeStyle = '#FFE082';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Inti tengah jeruk
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF9C4';
        ctx.fill();

      } else {
        // Es Batu Kristal 3D Transparan Dorfic
        const size = this.radius * 1.4;
        const half = size / 2;
        const cornerRadius = 6;

        ctx.beginPath();
        ctx.moveTo(-half + cornerRadius, -half);
        ctx.lineTo(half - cornerRadius, -half);
        ctx.quadraticCurveTo(half, -half, half, -half + cornerRadius);
        ctx.lineTo(half, half - cornerRadius);
        ctx.quadraticCurveTo(half, half, half - cornerRadius, half);
        ctx.lineTo(-half + cornerRadius, half);
        ctx.quadraticCurveTo(-half, half, -half, half - cornerRadius);
        ctx.lineTo(-half, -half + cornerRadius);
        ctx.quadraticCurveTo(-half, -half, -half + cornerRadius, -half);
        ctx.closePath();

        let iceGrad = ctx.createLinearGradient(-half, -half, half, half);
        iceGrad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
        iceGrad.addColorStop(0.35, 'rgba(255, 224, 178, 0.4)');
        iceGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
        iceGrad.addColorStop(1, 'rgba(255, 255, 255, 0.65)');

        ctx.fillStyle = iceGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

    } else if (this.themeId === 'dark-aero') {
      ctx.fillStyle = `rgba(0, 255, 102, ${this.life * 0.85})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff66';
      ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);

    } else if (this.themeId === 'clean-core') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(219, 234, 254, ${this.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius - 1, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(244, 114, 182, ${this.alpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x + this.radius * 0.3, this.y + this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 1.2})`;
      ctx.fill();

    } else if (this.themeId === 'frutiger-metro') {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;

      let drawAlpha = this.isExplosion ? this.life : 1.0;
      ctx.globalAlpha = drawAlpha;

      if (this.shape === 'star') {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.radius, -Math.sin((18 + i * 72) * Math.PI / 180) * this.radius);
          ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (this.radius / 2), -Math.sin((54 + i * 72) * Math.PI / 180) * (this.radius / 2));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(-this.radius * 0.7, -this.radius * 0.7, this.radius * 1.4, this.radius * 1.4);
        ctx.strokeRect(-this.radius * 0.7, -this.radius * 0.7, this.radius * 1.4, this.radius * 1.4);
      }
    }
    ctx.restore();
  }
}

function resetCanvasParticles(themeId) {
  particles = [];
  waves = [];
  if (themeId === 'frutiger-aero') {
    // 4 Gelembung besar kosong yang bisa pecah jika di klik
    for (let i = 0; i < 4; i++) {
      particles.push(new Particle(null, null, themeId, false, 'large-empty'));
    }
    // 5 Gelembung daun hijau kecil
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(null, null, themeId, false, 'leaf'));
    }
    // 8 Gelembung kosong kecil (dikurangi agar tidak lag dan seimbang)
    for (let i = 0; i < 8; i++) {
      particles.push(new Particle(null, null, themeId, false, 'empty'));
    }
  } else {
    const qty = themeId === 'frutiger-metro' ? 12 : 30;
    for (let i = 0; i < qty; i++) {
      particles.push(new Particle(null, null, themeId, false));
    }
  }
}

// --- LOOP UTAMA RENDERING GRAPHICS ---
function render() {
  const themeId = genres[currentThemeIndex].id;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 1. Menggambar gradasi latar belakang khas untuk tiap tema aktif
  if (themeId === 'frutiger-aero') {
    // 1. Langit biru bergradasi menyerupai gambar (biru tua -> biru muda -> putih horizon)
    let skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.52);
    skyGradient.addColorStop(0, '#0055d4');
    skyGradient.addColorStop(0.35, '#2196f3');
    skyGradient.addColorStop(0.7, '#80d8ff');
    skyGradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // --- 0. Matahari Bersinar & Sinar Lens Flare (Kanan Atas) ---
    ctx.save();
    const sunX = canvasWidth * 0.88;
    const sunY = canvasHeight * 0.16;

    let sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 130);
    sunGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sunGlow.addColorStop(0.12, 'rgba(255, 255, 224, 0.85)');
    sunGlow.addColorStop(0.35, 'rgba(179, 229, 252, 0.4)');
    sunGlow.addColorStop(0.7, 'rgba(111, 177, 252, 0.1)');
    sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 130, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.lineWidth = 1.6;
    const rays = 8;
    const rayLength = 95;
    for (let i = 0; i < rays; i++) {
      const angle = (i * Math.PI / 4) + (Date.now() * 0.00008);
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(sunX + Math.cos(angle) * rayLength, sunY + Math.sin(angle) * rayLength);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(sunX, sunY, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    // --- 1. Awan di Langit (Mewakili awan putih di gambar) ---
    clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > canvasWidth + 160) {
        c.x = -160;
        c.y = Math.random() * (canvasHeight * 0.28) + 35;
      }

      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.48)';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 32 * c.scale, 0, Math.PI * 2);
      ctx.arc(c.x + 28 * c.scale, c.y - 14 * c.scale, 26 * c.scale, 0, Math.PI * 2);
      ctx.arc(c.x + 55 * c.scale, c.y, 26 * c.scale, 0, Math.PI * 2);
      ctx.arc(c.x + 22 * c.scale, c.y + 14 * c.scale, 22 * c.scale, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // --- 2. Gedung-Gedung Frutiger Aero di Horizon Kanan (Dibuat Jauh/Kecil menempel di treeline) ---
    ctx.save();
    // horizonY ditinggikan ke 0.52 agar tampak jauh di cakrawala dan stabil
    const horizonY = canvasHeight * 0.52;
    function getHorizonY(x) {
      return horizonY + Math.sin(x * 0.0015) * 6 + Math.cos(x * 0.0008) * 3;
    }

    ctx.lineWidth = 0.8;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    const baseWidth = canvasWidth;

    // Helper untuk menggambar gedung kaca reflektif dengan berbagai variasi bentuk
    const drawGlassBuilding = (xStart, xEnd, height, type = 'flat', peakOffset = 0.5) => {
      const w = xEnd - xStart;
      const xMid = xStart + w * peakOffset;
      const baseYStart = getHorizonY(xStart);
      const baseYEnd = getHorizonY(xEnd);
      const baseYMid = getHorizonY(xMid);

      ctx.beginPath();
      ctx.moveTo(xStart, baseYStart);

      if (type === 'flat') {
        ctx.lineTo(xStart, baseYMid - height);
        ctx.lineTo(xEnd, baseYMid - height);
      } else if (type === 'slope-left') {
        ctx.lineTo(xStart, baseYMid - height * 0.7);
        ctx.lineTo(xEnd, baseYMid - height);
      } else if (type === 'slope-right') {
        ctx.lineTo(xStart, baseYMid - height);
        ctx.lineTo(xEnd, baseYMid - height * 0.7);
      } else if (type === 'spire') {
        ctx.lineTo(xMid - w * 0.15, baseYMid - height * 0.82);
        ctx.lineTo(xMid, baseYMid - height);
        ctx.lineTo(xMid + w * 0.15, baseYMid - height * 0.82);
      } else if (type === 'stepped') {
        const stepW = w * 0.18;
        ctx.lineTo(xStart, baseYMid - height * 0.65);
        ctx.lineTo(xStart + stepW, baseYMid - height * 0.65);
        ctx.lineTo(xStart + stepW, baseYMid - height * 0.85);
        ctx.lineTo(xStart + stepW * 2, baseYMid - height * 0.85);
        ctx.lineTo(xStart + stepW * 2, baseYMid - height);
        ctx.lineTo(xEnd - stepW * 2, baseYMid - height);
        ctx.lineTo(xEnd - stepW * 2, baseYMid - height * 0.85);
        ctx.lineTo(xEnd - stepW, baseYMid - height * 0.85);
        ctx.lineTo(xEnd - stepW, baseYMid - height * 0.65);
        ctx.lineTo(xEnd, baseYMid - height * 0.65);
      } else if (type === 'cylinder') {
        ctx.quadraticCurveTo(xMid, baseYMid - height - 6, xEnd, baseYMid - height);
      }

      ctx.lineTo(xEnd, baseYEnd);
      ctx.closePath();

      // Gradasi warna kaca reflektif abu-abu kebiruan
      let buildGrad = ctx.createLinearGradient(xStart, baseYMid - height, xEnd, baseYMid);
      buildGrad.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
      buildGrad.addColorStop(0.35, 'rgba(180, 222, 245, 0.24)');
      buildGrad.addColorStop(1, 'rgba(80, 130, 180, 0.02)');

      ctx.fillStyle = buildGrad;
      ctx.fill();
      ctx.stroke();

      // Gambar detail garis vertikal panel kaca gedung (facade stripes)
      if (type !== 'spire') {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = 0.5;
        const numLines = Math.floor(w / 4);
        for (let i = 1; i < numLines; i++) {
          const lx = xStart + (i * w / numLines);
          ctx.beginPath();
          ctx.moveTo(lx, getHorizonY(lx));
          ctx.lineTo(lx, baseYMid - height * 0.85);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Desain khusus untuk menara antena utama (Building 5)
      if (type === 'antenna-spire') {
        ctx.beginPath();
        ctx.moveTo(xStart, baseYStart);
        ctx.lineTo(xStart, baseYMid - height * 0.75);
        ctx.lineTo(xStart + w * 0.25, baseYMid - height * 0.75);
        ctx.lineTo(xStart + w * 0.25, baseYMid - height * 0.9);
        ctx.lineTo(xEnd - w * 0.25, baseYMid - height * 0.9);
        ctx.lineTo(xEnd - w * 0.25, baseYMid - height * 0.75);
        ctx.lineTo(xEnd, baseYMid - height * 0.75);
        ctx.lineTo(xEnd, baseYEnd);
        ctx.closePath();
        ctx.fillStyle = buildGrad;
        ctx.fill();
        ctx.stroke();

        // Tiang antena tipis di bagian atas
        ctx.beginPath();
        ctx.moveTo(xMid, baseYMid - height * 0.9);
        ctx.lineTo(xMid, baseYMid - height - 12);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    };

    // Render 10 gedung pencakar langit yang saling bertumpuk (overlapped cluster)
    drawGlassBuilding(baseWidth * 0.74, baseWidth * 0.755, 32, 'flat');
    drawGlassBuilding(baseWidth * 0.75, baseWidth * 0.768, 55, 'slope-left');
    drawGlassBuilding(baseWidth * 0.763, baseWidth * 0.78, 72, 'spire');
    drawGlassBuilding(baseWidth * 0.774, baseWidth * 0.793, 46, 'flat');
    drawGlassBuilding(baseWidth * 0.788, baseWidth * 0.812, 85, 'antenna-spire');
    drawGlassBuilding(baseWidth * 0.806, baseWidth * 0.824, 66, 'slope-right');
    drawGlassBuilding(baseWidth * 0.819, baseWidth * 0.838, 50, 'stepped');
    drawGlassBuilding(baseWidth * 0.833, baseWidth * 0.852, 68, 'spire');
    drawGlassBuilding(baseWidth * 0.848, baseWidth * 0.864, 40, 'flat');
    drawGlassBuilding(baseWidth * 0.86, baseWidth * 0.875, 48, 'cylinder');

    ctx.restore();

    // --- 3. Jejeran Pohon (Treeline) di Cakrawala Bukit (Dibuat Jauh/Kecil menutupi kaki gedung) ---
    ctx.save();
    for (let x = 0; x < canvasWidth; x += 4) {
      const y = getHorizonY(x);
      const treeHeight = 3.0 + (Math.sin(x * 0.08) * 1.0);

      // Lapisan daun luar gelap
      ctx.fillStyle = '#226926';
      ctx.beginPath();
      ctx.arc(x, y + 1.2, treeHeight, 0, Math.PI * 2);
      ctx.fill();

      // Lapisan daun dalam terang
      ctx.fillStyle = '#388E3C';
      ctx.beginPath();
      ctx.arc(x + 0.5, y + 1.5, treeHeight * 0.72, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // --- 4. Pita Pita Gelombang Bukit Hijau (Meadow Horizon - Ditinggikan/Dibuat Jauh) ---
    ctx.beginPath();
    ctx.moveTo(0, getHorizonY(0));
    for (let x = 0; x < canvasWidth; x++) {
      ctx.lineTo(x, getHorizonY(x));
    }
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.closePath();
    let waveGrad = ctx.createLinearGradient(0, horizonY, 0, canvasHeight);
    waveGrad.addColorStop(0, 'rgba(76, 175, 80, 0.98)');
    waveGrad.addColorStop(0.3, 'rgba(139, 195, 74, 0.99)');
    waveGrad.addColorStop(1, 'rgba(205, 220, 57, 1)');
    ctx.fillStyle = waveGrad;
    ctx.fill();

    // --- 5. Lapisan Gelombang Kedua (Softer Highlight Ribbon - Diperkecil & Dibuat Jauh) ---
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight * 0.58);
    for (let x = 0; x < canvasWidth; x++) {
      const y = canvasHeight * 0.58 + Math.cos(x * 0.003) * 6;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fill();

  } else if (themeId === 'dorfic') {
    let dorficGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    dorficGrad.addColorStop(0, '#F37335');
    dorficGrad.addColorStop(0.6, '#FDC830');
    dorficGrad.addColorStop(1, '#FFE259');
    ctx.fillStyle = dorficGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    angleOffset += 0.004;
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.arc(canvasWidth * 0.8, canvasHeight * 0.3, 150 + Math.sin(angleOffset) * 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.arc(canvasWidth * 0.15, canvasHeight * 0.7, 280 + Math.cos(angleOffset * 0.5) * 30, 0, Math.PI * 2);
    ctx.fill();

  } else if (themeId === 'dark-aero') {
    let cyberGrad = ctx.createRadialGradient(canvasWidth / 2, canvasHeight / 2, 50, canvasWidth / 2, canvasHeight / 2, Math.max(canvasWidth, canvasHeight) * 0.8);
    cyberGrad.addColorStop(0, '#0a230e');
    cyberGrad.addColorStop(0.6, '#040d05');
    cyberGrad.addColorStop(1, '#000000');
    ctx.fillStyle = cyberGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.06)';
    ctx.beginPath();
    for (let x = 0; x < canvasWidth; x += 40) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
    }
    for (let y = 0; y < canvasHeight; y += 40) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
    }
    ctx.stroke();

    if (rippleGrid) {
      rippleGrid.forEach(node => {
        node.x += (node.origX - node.x) * 0.05;
        node.y += (node.origY - node.y) * 0.05;

        ctx.fillStyle = 'rgba(0, 255, 102, 0.18)';
        ctx.fillRect(node.x - 1.5, node.y - 1.5, 3, 3);
      });
    }

  } else if (themeId === 'clean-core') {
    let softGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    softGrad.addColorStop(0, '#E0F2FE');
    softGrad.addColorStop(0.5, '#F0F9FF');
    softGrad.addColorStop(1, '#FCE7F3');
    ctx.fillStyle = softGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  } else if (themeId === 'frutiger-metro') {
    ctx.fillStyle = '#ff007f';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = '#00f3ff';
    const rayCount = 18;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const maxRadius = Math.max(canvasWidth, canvasHeight) * 1.5;

    angleOffset += 0.003;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angleOffset);
    for (let i = 0; i < rayCount; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const angle1 = (i * 360 / rayCount) * Math.PI / 180;
      const angle2 = ((i + 0.5) * 360 / rayCount) * Math.PI / 180;
      ctx.lineTo(Math.cos(angle1) * maxRadius, Math.sin(angle1) * maxRadius);
      ctx.lineTo(Math.cos(angle2) * maxRadius, Math.sin(angle2) * maxRadius);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 14;
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
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
