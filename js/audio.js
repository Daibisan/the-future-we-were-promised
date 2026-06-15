// --- MESIN SINTESIS SUARA (Web Audio API) ---
let soundEnabled = true;
let globalVolume = 10;
let audioCtx = null;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

const soundToggle = document.getElementById('sound-toggle');
const soundOnIcon = document.getElementById('sound-on-icon');
const soundOffIcon = document.getElementById('sound-off-icon');

soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    soundOnIcon.classList.remove('hidden');
    soundOnIcon.classList.add('block');
    soundOffIcon.classList.remove('block');
    soundOffIcon.classList.add('hidden');
    initAudioContext();
    playInterfaceClickSound();
  } else {
    soundOnIcon.classList.remove('block');
    soundOnIcon.classList.add('hidden');
    soundOffIcon.classList.remove('hidden');
    soundOffIcon.classList.add('block');
  }
});

// Suara ketukan antarmuka mekanis bersih (Satisfying UI Click)
function playInterfaceClickSound() {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(1150, now + 0.05);
    gain.gain.setValueAtTime(0.06 * globalVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {
    // Abaikan error audio
  }
}

function playThemeSound(type) {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'water') {
      // Suara rintik air / gelembung aero glossy
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1250, now + 0.12);
      gain.gain.setValueAtTime(0.12 * globalVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'cozy') {
      // Bunyi analog oranye retro hangat dorfic
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(261.6, now);
      osc.frequency.setValueAtTime(329.6, now + 0.05);
      osc.frequency.setValueAtTime(392.0, now + 0.1);
      gain.gain.setValueAtTime(0.15 * globalVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.40);
    } else if (type === 'cyber') {
      // Efek sub-drop fiksi ilmiah laser
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);
      osc.disconnect(gain);
      osc.connect(filter);
      filter.connect(gain);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(45, now + 0.25);
      gain.gain.setValueAtTime(0.18 * globalVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'bubble') {
      // Bunyi letupan busa sabun lembut
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
      gain.gain.setValueAtTime(0.08 * globalVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'bubble-pop') {
      // Crisp wet pop sound untuk gelembung besar Frutiger Aero
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
      gain.gain.setValueAtTime(0.18 * globalVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'pop') {
      // Bunyi arcade retro metro ceria
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.setValueAtTime(300, now + 0.04);
      osc.frequency.setValueAtTime(450, now + 0.08);
      gain.gain.setValueAtTime(0.06 * globalVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    // Abaikan error audio
  }
}
