import { createScene } from "./shared/scene.js";
import { createPointer } from "./shared/pointer.js";
import { createSpringLetters } from "./shared/spring-letters.js";
import { createEmberField } from "./shared/ember-field.js";
import { drawTrails } from "./shared/trails.js";

function readPalette() {
  const css = getComputedStyle(document.documentElement);
  const read = (name) => css.getPropertyValue(name).trim();
  return {
    colors: [read("--ember-hot"), read("--ember-bright"), read("--ember-deep")],
    fade: read("--trail-fade"),
  };
}

const palette = readPalette();
const pointer = createPointer();
const letters = createSpringLetters({ pointer, onLetterStep: (l) => field.spray(l) });
const field = createEmberField({
  pointer,
  homes: letters.letters,
  colorCount: palette.colors.length,
});
let time = 0;

function update(view, dt, k) {
  time += dt;
  letters.step(time, k);
  field.step(view, time, k);
  drawTrails(field.particles, view, palette);
}

function still(view) {
  for (let i = 0; i < 60; i += 1) {
    field.step(view, time, 1);
    drawTrails(field.particles, view, palette);
  }
}

createScene({
  canvas: document.getElementById("field"),
  update,
  still,
  seed: field.seed,
  // Letters are measured before the reseed so new embers spawn on their post-resize homes.
  onResize: letters.measure,
});
