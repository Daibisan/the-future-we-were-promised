// --- INISIALISASI UTAMA APLIKASI (APP ENTRYPOINT) ---

// Deteksi hover pada panel definisi agar bypass event canvas latar belakang
infoPanel.addEventListener('mouseenter', () => { isHoveringInfoPanel = true; });
infoPanel.addEventListener('mouseleave', () => { isHoveringInfoPanel = false; });

// Inisialisasi awal tema pertama (Frutiger Aero) tanpa suara
updateTheme(0, false);

// Mulai animasi loop canvas
requestAnimationFrame(render);

// Pudar lapisan transisi saat pemuatan awal halaman
setTimeout(() => {
  transitionLayer.style.opacity = '0';
  setTimeout(() => {
    isTransitioning = false; // Lepaskan kunci setelah inisialisasi awal selesai
  }, 220);
}, 100);
