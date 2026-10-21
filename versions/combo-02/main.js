import { createScene } from "../../shared/scene.js";
import { createPointer } from "../../shared/pointer.js";
import { createSpringLetters } from "../../shared/spring-letters.js";
import { emberFlowAngle } from "../../shared/flow-field.js";
import { createPool, poolCount, randomItem, swirl, wrapEdges } from "../../shared/particles.js";
import { prepareInk, drawInk } from "../../shared/ink.js";

const FADE = "rgba(11, 9, 8, 0.14)";
const colors = ["#ff7a1a", "#ffb347", "#b4471a"];
const pointer = createPointer();
const letters = createSpringLetters({ pointer, onLetterStep: spray });
let particles = [];
let cursor = 0;
let time = 0;

// Embers are born on a letter's box, so the text reads as the source of every spark.
function spawn(p, l, vx, vy) {
  p.x = l.hx + l.x + (Math.random() - 0.5) * l.w;
  p.y = l.hy + l.y + (Math.random() - 0.5) * l.h;
  p.px = p.x;
  p.py = p.y;
  const a = Math.random() * Math.PI * 2;
  const s = 0.4 + Math.random() * 1.4;
  p.vx = Math.cos(a) * s + vx;
  p.vy = Math.sin(a) * s + vy;
  p.life = 400 + Math.random() * 600;
  return p;
}

function spray(l) {
  if (particles.length === 0) return;
  const speed = Math.hypot(l.vx, l.vy);
  if (speed <= 3) return;
  // Recycle the oldest embers so a spray never grows the pool past the cap.
  const burst = Math.min(4, Math.floor(speed / 3));
  for (let n = 0; n < burst; n += 1) {
    spawn(particles[cursor], l, l.vx * 0.6, l.vy * 0.6);
    cursor = (cursor + 1) % particles.length;
  }
}

function stepField(view, k) {
  const damping = Math.pow(0.95, k);
  // A press reaches the whole screen so every ember answers, not only the nearby ones.
  const radius = pointer.down ? Math.max(view.width, view.height) : 0;
  for (const p of particles) {
    const a = emberFlowAngle(p.x, p.y, time);
    // A little noise keeps embers born on the same letter from bunching into one stream.
    p.vx += (Math.cos(a) * 0.08 + (Math.random() - 0.5) * 0.6) * k;
    p.vy += (Math.sin(a) * 0.08 - 0.05 + (Math.random() - 0.5) * 0.6) * k;
    swirl(p, pointer, radius, -0.9 * k);
    p.vx *= damping;
    p.vy *= damping;
    p.px = p.x;
    p.py = p.y;
    p.x += p.vx * k;
    p.y += p.vy * k;
    p.life -= k;
    wrapEdges(p, view, 10, 9);
    if (p.life < 0) spawn(p, randomItem(letters.letters), 0, 0);
  }
}

function update(view, dt, k) {
  time += dt;
  letters.step(time, k);
  stepField(view, k);
  drawInk(particles, view, colors, FADE);
}

function still(view) {
  for (let i = 0; i < 60; i += 1) {
    stepField(view, 1);
    drawInk(particles, view, colors, null);
  }
}

function seed(view) {
  particles = createPool(poolCount(view, 900), (i) =>
    spawn({ color: i % colors.length }, randomItem(letters.letters), 0, 0),
  );
  cursor = 0;
  // Embers need a few hundred frames to drift from the text to the edges, so run them ahead.
  for (let i = 0; i < 600; i += 1) {
    time += 1 / 60;
    stepField(view, 1);
  }
}

createScene({
  canvas: document.getElementById("field"),
  update,
  still,
  seed,
  onFit: (v) => prepareInk(v, 1.2),
  // Letters are measured before the reseed so new embers spawn on their post-resize homes.
  onResize: letters.measure,
});
