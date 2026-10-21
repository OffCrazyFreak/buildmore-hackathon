import { createScene } from "../../shared/scene.js";
import { createPointer } from "../../shared/pointer.js";
import { createPool, poolCount, repel } from "../../shared/particles.js";
import { makeEmber, stepEmbers, drawEmbers, exposeEmbers } from "../../shared/embers.js";

const pointer = createPointer();
let particles = [];
let time = 0;

function applyForce(p) {
  return pointer.inside && repel(p, pointer, 170, 2.4);
}

function update(view, dt, k) {
  time += dt;
  stepEmbers(particles, view, time, k, applyForce);
  drawEmbers(particles, view);
}

function still(view) {
  view.ctx.fillStyle = "#0b0908";
  view.ctx.fillRect(0, 0, view.width, view.height);
  exposeEmbers(particles, view, 40, time, applyForce);
}

function seed(view) {
  particles = createPool(poolCount(view, 1500), () => makeEmber(view));
}

createScene({ canvas: document.getElementById("field"), update, still, seed });
