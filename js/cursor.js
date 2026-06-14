// --- LOGIKA KURSOR DINAMIS ---
const cursorDot = document.getElementById('custom-cursor-dot');
const cursorRing = document.getElementById('custom-cursor-ring');

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursorRing() {
  const springFactor = 0.14; 
  ringX += (mouseX - ringX) * springFactor;
  ringY += (mouseY - ringY) * springFactor;

  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';

  requestAnimationFrame(animateCursorRing);
}
requestAnimationFrame(animateCursorRing);

document.addEventListener('mouseover', (e) => {
  if (e.target.closest(interactiveElements)) {
    document.body.classList.add('hovering-interactive');
  }
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest(interactiveElements)) {
    document.body.classList.remove('hovering-interactive');
  }
});
