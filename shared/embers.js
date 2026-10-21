import { emberFlowAngle } from "./flow-field.js";
import { wrapEdges } from "./particles.js";

export function makeEmber(view) {
  return {
    x: Math.random() * view.width,
    y: Math.random() * view.height,
    vx: 0,
    vy: 0,
    size: 0.6 + Math.random() * 1.6,
    heat: Math.random(),
    life: Math.random(),
  };
}

export function stepEmbers(particles, view, time, k, applyForce) {
  const damping = Math.pow(0.94, k);
  const cool = Math.pow(0.985, k);
  for (let i = 0; i < particles.length; i += 1) {
    const p = particles[i];
    const a = emberFlowAngle(p.x, p.y, time);
    p.vx += Math.cos(a) * 0.06 * k;
    p.vy += (Math.sin(a) * 0.06 - 0.012) * k;
    if (applyForce(p)) p.heat = Math.min(1, p.heat + 0.08 * k);
    p.vx *= damping;
    p.vy *= damping;
    p.x += p.vx * k;
    p.y += p.vy * k;
    p.heat *= cool;
    p.life += 0.0012 * k;
    wrapEdges(p, view, 6, 6);
    if (p.life > 1) particles[i] = makeEmber(view);
  }
}

export function drawEmbers(particles, view) {
  const { ctx } = view;
  ctx.fillStyle = "rgba(11, 9, 8, 0.28)";
  ctx.fillRect(0, 0, view.width, view.height);
  for (const p of particles) {
    const fade = Math.min(1, Math.sin(p.life * Math.PI) * 3);
    const warm = 0.35 + p.heat * 0.65;
    const g = Math.floor(90 + warm * 90);
    const b = Math.floor(20 + (1 - warm) * 60);
    ctx.fillStyle =
      "rgba(255," + g + "," + b + "," + (fade * (0.25 + p.heat * 0.7)).toFixed(3) + ")";
    const s = p.size * (0.8 + p.heat);
    ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
  }
}

// Many silent steps then one draw stand in for the loop under reduced motion.
export function exposeEmbers(particles, view, frames, time, applyForce) {
  for (let i = 0; i < frames; i += 1) stepEmbers(particles, view, time, 1, applyForce);
  drawEmbers(particles, view);
}
