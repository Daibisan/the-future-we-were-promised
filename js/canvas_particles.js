// --- DATA & FISIKA PARTIKEL INTERAKTIF ---
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
