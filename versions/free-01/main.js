import { createScene } from "../../shared/scene.js";
import { createPointer } from "../../shared/pointer.js";
import { createPool, poolCount, pointerVortex } from "../../shared/particles.js";
import { PAPER_FADE, prepareInk, spawnInk, stepInk, drawInk, exposeInk } from "../../shared/ink.js";

const PAPER = "#f4efe6";
const colors = ["#1c1814", "#9e3a21", "#2f5d7c"];
const pointer = createPointer();
let particles = [];
let time = 0;

function update(view, dt, k) {
  time += 0.0035 * k;
  stepInk(particles, view, time, k, (p) => pointerVortex(p, view, pointer, k));
  drawInk(particles, view, colors, PAPER_FADE);
}

function still(view) {
  exposeInk(particles, view, colors, 90, time, (p) => pointerVortex(p, view, pointer, 1));
}

function onFit(view) {
  prepareInk(view, 1.1);
  view.ctx.fillStyle = PAPER;
  view.ctx.fillRect(0, 0, view.width, view.height);
}

function seed(view) {
  particles = createPool(poolCount(view, 1600, 900), (i) =>
    spawnInk({ color: i % colors.length }, view),
  );
}

createScene({ canvas: document.getElementById("field"), update, still, seed, onFit });
