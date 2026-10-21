import { createScene } from "../../shared/scene.js";
import { createPointer } from "../../shared/pointer.js";
import { createSpringLetters } from "../../shared/spring-letters.js";
import { createPool, poolCount, pointerVortex } from "../../shared/particles.js";
import { makeEmber, stepEmbers, drawEmbers, exposeEmbers } from "../../shared/embers.js";

const pointer = createPointer();
const letters = createSpringLetters({ pointer });
let particles = [];
let time = 0;

function update(view, dt, k) {
  time += dt;
  stepEmbers(particles, view, time, k, (p) => pointerVortex(p, view, pointer, k));
  letters.step(time, k);
  drawEmbers(particles, view);
}

function still(view) {
  exposeEmbers(particles, view, 40, time, (p) => pointerVortex(p, view, pointer, 1));
}

function seed(view) {
  particles = createPool(poolCount(view, 1500), () => makeEmber(view));
}

createScene({ canvas: document.getElementById("field"), update, still, seed });
