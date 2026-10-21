import { prefersReducedMotion } from "./motion.js";

// k is dt in 60 fps frames, so forces tuned at 60 Hz hold on any refresh rate.
export function createLoop({ update, still }) {
  const reduced = prefersReducedMotion();
  let frame = 0;
  let last = 0;

  function tick(now) {
    // Cleared first so a throwing update cannot leave a stale handle that blocks start().
    frame = 0;
    const dt = Math.min(1 / 30, (now - last) / 1000) || 1 / 60;
    last = now;
    update(dt, dt * 60);
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (frame || reduced) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  // One settled frame stands in for the loop so the page is not blank.
  function renderStill() {
    if (reduced) still();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  return { start, renderStill };
}
