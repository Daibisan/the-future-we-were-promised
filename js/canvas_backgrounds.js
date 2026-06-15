// --- RENDERER LATAR BELAKANG ESTETIKA (BACKGROUNDS) ---

// Helper untuk menggambar gedung kaca reflektif di Frutiger Aero
function drawAeroGlassBuilding(ctx, canvasWidth, canvasHeight, horizonY, getHorizonY, xStart, xEnd, height, type = 'flat', peakOffset = 0.5) {
  const w = xEnd - xStart;
  const xMid = xStart + w * peakOffset;
  const baseYStart = getHorizonY(xStart, horizonY);
  const baseYEnd = getHorizonY(xEnd, horizonY);
  const baseYMid = getHorizonY(xMid, horizonY);

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
      ctx.moveTo(lx, getHorizonY(lx, horizonY));
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
}

// 1. Frutiger Aero
function drawAeroBackground(ctx, canvasWidth, canvasHeight) {
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
  const horizonY = canvasHeight * 0.52;
  const getHorizonY = (x, hy) => {
    return hy + Math.sin(x * 0.0015) * 6 + Math.cos(x * 0.0008) * 3;
  };

  ctx.lineWidth = 0.8;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  const baseWidth = canvasWidth;

  // Render 10 gedung pencakar langit yang saling bertumpuk (overlapped cluster)
  drawAeroGlassBuilding(ctx, canvasWidth, canvasHeight, horizonY, getHorizonY, baseWidth * 0.74, baseWidth * 0.755, 32, 'flat');
  drawAeroGlassBuilding(ctx, canvasWidth, canvasHeight, horizonY, getHorizonY, baseWidth * 0.75, baseWidth * 0.768, 55, 'slope-left');
  drawAeroGlassBuilding(ctx, canvasWidth, canvasHeight, horizonY, getHorizonY, baseWidth * 0.763, baseWidth * 0.78, 72, 'spire');
  drawAeroGlassBuilding(ctx, canvasWidth, canvasHeight, horizonY, getHorizonY, baseWidth * 0.774, baseWidth * 0.793, 46, 'flat');
  drawAeroGlassBuilding(ctx, canvasWidth, canvasHeight, horizonY, getHorizonY, baseWidth * 0.788, baseWidth * 0.812, 85, 'antenna-spire');
  drawAeroGlassBuilding(ctx, canvasWidth, canvasHeight, horizonY, getHorizonY, baseWidth * 0.806, baseWidth * 0.824, 66, 'slope-right');
  drawAeroGlassBuilding(ctx, canvasWidth, canvasHeight, horizonY, getHorizonY, baseWidth * 0.819, baseWidth * 0.838, 50, 'stepped');
  drawAeroGlassBuilding(ctx, canvasWidth, canvasHeight, horizonY, getHorizonY, baseWidth * 0.833, baseWidth * 0.852, 68, 'spire');
  drawAeroGlassBuilding(ctx, canvasWidth, canvasHeight, horizonY, getHorizonY, baseWidth * 0.848, baseWidth * 0.864, 40, 'flat');
  drawAeroGlassBuilding(ctx, canvasWidth, canvasHeight, horizonY, getHorizonY, baseWidth * 0.86, baseWidth * 0.875, 48, 'cylinder');

  ctx.restore();

  // --- 3. Jejeran Pohon (Treeline) di Cakrawala Bukit (Dibuat Jauh/Kecil menutupi kaki gedung) ---
  ctx.save();
  for (let x = 0; x < canvasWidth; x += 4) {
    const y = getHorizonY(x, horizonY);
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
  ctx.moveTo(0, getHorizonY(0, horizonY));
  for (let x = 0; x < canvasWidth; x++) {
    ctx.lineTo(x, getHorizonY(x, horizonY));
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
}

// 2. Dorfic
function drawDorficBackground(ctx, canvasWidth, canvasHeight) {
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
}

// 3. Dark Aero
function drawDarkAeroBackground(ctx, canvasWidth, canvasHeight) {
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
}

// 4. Clean Core
function drawCleanCoreBackground(ctx, canvasWidth, canvasHeight) {
  let softGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  softGrad.addColorStop(0, '#E0F2FE');
  softGrad.addColorStop(0.5, '#F0F9FF');
  softGrad.addColorStop(1, '#FCE7F3');
  ctx.fillStyle = softGrad;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// 5. Frutiger Metro
function drawMetroBackground(ctx, canvasWidth, canvasHeight) {
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
