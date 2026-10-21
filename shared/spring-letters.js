import { splitAll } from "./split-text.js";

// Letters spring back to their measured home, repel on hover and attract on press.
export function createSpringLetters({ pointer, onLetterStep }) {
  const letters = splitAll();

  function measure() {
    for (const l of letters) l.el.style.transform = "";
    for (const l of letters) {
      const r = l.el.getBoundingClientRect();
      l.hx = r.left + r.width / 2;
      l.hy = r.top + r.height / 2;
      l.w = r.width;
      l.h = r.height;
    }
  }

  function step(time, k) {
    const damping = Math.pow(0.86, k);
    const radius = Math.min(220, window.innerWidth * 0.22);
    for (let i = 0; i < letters.length; i += 1) {
      const l = letters[i];
      const dx = l.hx + l.x - pointer.x;
      const dy = l.hy + l.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < radius * radius) {
        const d = Math.sqrt(d2) || 1;
        const push = (1 - d / radius) * (pointer.down ? -2.4 : 4);
        l.vx += (dx / d) * push * k;
        l.vy += (dy / d) * push * k;
      }
      const idleY = Math.sin(time * 1.4 + i * 0.25) * 3;
      l.vx -= l.x * 0.06 * k;
      l.vy += (idleY - l.y) * 0.06 * k;
      l.vx *= damping;
      l.vy *= damping;
      l.x += l.vx * k;
      l.y += l.vy * k;
      onLetterStep(l);
      const shift = l.x.toFixed(2) + "px, " + l.y.toFixed(2) + "px";
      l.el.style.transform = "translate(" + shift + ") rotate(" + (l.vx * 1.5).toFixed(2) + "deg)";
    }
  }

  measure();
  if (document.fonts) document.fonts.ready.then(measure);
  window.addEventListener("resize", measure);

  return { letters, measure, step };
}
