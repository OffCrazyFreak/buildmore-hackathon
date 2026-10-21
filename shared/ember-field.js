import { flowAngle } from "./flow-field.js";
import { createPool, poolCount, randomItem, swirl, wrapEdges } from "./particles.js";

// Embers are born on a letter's box, so the text reads as the source of every spark.
function spawn(p, home, vx, vy) {
  p.x = home.hx + home.x + (Math.random() - 0.5) * home.w;
  p.y = home.hy + home.y + (Math.random() - 0.5) * home.h;
  p.px = p.x;
  p.py = p.y;
  const a = Math.random() * Math.PI * 2;
  const s = 0.4 + Math.random() * 1.4;
  p.vx = Math.cos(a) * s + vx;
  p.vy = Math.sin(a) * s + vy;
  p.life = 400 + Math.random() * 600;
  return p;
}

export function createEmberField({ pointer, homes, colorCount }) {
  let particles = [];
  let cursor = 0;

  function spray(home) {
    if (particles.length === 0) return;
    const speed = Math.hypot(home.vx, home.vy);
    if (speed <= 3) return;
    // Recycle the oldest embers so a spray never grows the pool past the cap.
    const burst = Math.min(4, Math.floor(speed / 3));
    for (let n = 0; n < burst; n += 1) {
      spawn(particles[cursor], home, home.vx * 0.6, home.vy * 0.6);
      cursor = (cursor + 1) % particles.length;
    }
  }

  function step(view, time, k) {
    const damping = Math.pow(0.95, k);
    // A press reaches the whole screen so every ember answers, not only the nearby ones.
    const radius = pointer.down ? Math.max(view.width, view.height) : 0;
    for (const p of particles) {
      const a = flowAngle(p.x, p.y, time);
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
      if (p.life < 0) spawn(p, randomItem(homes), 0, 0);
    }
  }

  function seed(view) {
    particles = createPool(poolCount(view, 900), (i) =>
      spawn({ color: i % colorCount }, randomItem(homes), 0, 0),
    );
    cursor = 0;
    // Embers need a few hundred frames to drift from the text to the edges, so run them ahead.
    for (let i = 0; i < 600; i += 1) step(view, i / 60, 1);
  }

  return {
    get particles() {
      return particles;
    },
    spray,
    step,
    seed,
  };
}
