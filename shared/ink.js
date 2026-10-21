import { inkFlowAngle } from "./flow-field.js";

export const PAPER_FADE = "rgba(244, 239, 230, 0.1)";

export function prepareInk(view, lineWidth) {
  view.ctx.lineWidth = lineWidth;
  view.ctx.lineCap = "round";
}

export function spawnInk(p, view) {
  p.x = Math.random() * view.width;
  p.y = Math.random() * view.height;
  p.px = p.x;
  p.py = p.y;
  p.vx = 0;
  p.vy = 0;
  p.life = 120 + Math.random() * 240;
  return p;
}

export function stepInk(particles, view, time, k, applyForce) {
  const damping = Math.pow(0.95, k);
  for (const p of particles) {
    const a = inkFlowAngle(p.x, p.y, time);
    p.vx += Math.cos(a) * 0.06 * k;
    p.vy += Math.sin(a) * 0.06 * k;
    applyForce(p);
    p.vx *= damping;
    p.vy *= damping;
    p.px = p.x;
    p.py = p.y;
    p.x += p.vx * k;
    p.y += p.vy * k;
    p.life -= k;
    const out = p.x < -10 || p.x > view.width + 10 || p.y < -10 || p.y > view.height + 10;
    if (p.life < 0 || out) spawnInk(p, view);
  }
}

// One stroke per colour keeps the draw call count tiny at this particle count.
export function drawInk(particles, view, colors, fade) {
  const { ctx } = view;
  if (fade) {
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, view.width, view.height);
  }
  for (let c = 0; c < colors.length; c += 1) {
    ctx.strokeStyle = colors[c];
    ctx.beginPath();
    for (const p of particles) {
      if (p.color !== c) continue;
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
}

// Each step draws over the last so the still frame reads as one long exposure, with time frozen.
export function exposeInk(particles, view, colors, frames, time, applyForce) {
  for (let i = 0; i < frames; i += 1) {
    stepInk(particles, view, time, 1, applyForce);
    drawInk(particles, view, colors, null);
  }
}
