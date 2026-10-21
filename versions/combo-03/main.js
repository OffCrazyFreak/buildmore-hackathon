import { createScene } from "../../shared/scene.js";
import { createPointer } from "../../shared/pointer.js";
import { createSpringLetters } from "../../shared/spring-letters.js";
import { createPool, poolCount, pointerVortex } from "../../shared/particles.js";
import { PAPER_FADE, prepareInk, spawnInk, stepInk, drawInk, exposeInk } from "../../shared/ink.js";

const colors = ["#ff7a1a", "#b4471a", "#e8601c"];
const pointer = createPointer();
const letters = createSpringLetters({ pointer, onLetterStep: trail });
let particles = [];
let cursor = 0;
let time = 0;

// Ink shed by a letter carries the letter's velocity so the streak reads as a wake.
function shed(l) {
  if (particles.length === 0) return;
  const p = particles[cursor];
  cursor = (cursor + 1) % particles.length;
  p.x = l.hx + l.x + (Math.random() - 0.5) * 12;
  p.y = l.hy + l.y + (Math.random() - 0.5) * 12;
  p.px = p.x;
  p.py = p.y;
  p.vx = l.vx * 0.8 + (Math.random() - 0.5) * 1.2;
  p.vy = l.vy * 0.8 + (Math.random() - 0.5) * 1.2;
  p.life = 60 + Math.random() * 120;
}

function trail(l) {
  const speed = Math.hypot(l.vx, l.vy);
  if (speed <= 2.5) return;
  const drops = Math.min(4, Math.ceil(speed / 2.5));
  for (let n = 0; n < drops; n += 1) shed(l);
}

function update(view, dt, k) {
  time += 0.0035 * k;
  letters.step(time, k);
  stepInk(particles, view, time, k, (p) => pointerVortex(p, view, pointer, k));
  drawInk(particles, view, colors, PAPER_FADE);
}

function still(view) {
  exposeInk(particles, view, colors, 90, time, (p) => pointerVortex(p, view, pointer, 1));
}

function seed(view) {
  particles = createPool(poolCount(view, 1200), (i) =>
    spawnInk({ color: i % colors.length }, view),
  );
  cursor = 0;
}

createScene({
  canvas: document.getElementById("field"),
  update,
  still,
  seed,
  onFit: (v) => prepareInk(v, 1.1),
});
