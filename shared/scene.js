import { createLoop } from "./loop.js";
import { createCanvas } from "./canvas.js";

// Callbacks take the view as their first argument because the initial seed runs before this returns.
export function createScene({ canvas, update, still, seed, onFit, onResize }) {
  const loop = createLoop({
    update: (dt, k) => update(view, dt, k),
    still: () => still(view),
  });

  function reseed() {
    seed(view);
    loop.renderStill();
  }

  const view = createCanvas(canvas, { onFit, onResize, onSeed: reseed });
  reseed();
  loop.start();

  return view;
}
