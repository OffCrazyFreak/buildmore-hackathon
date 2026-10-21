const LINE_WIDTH = 1;
// Capping the segment keeps a fast ember a spark instead of a streak.
const SPARK_LENGTH = 6;

// One stroke per colour keeps the draw call count tiny at this particle count.
export function drawTrails(particles, view, { colors, fade }) {
  const { ctx } = view;
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, view.width, view.height);
  // Set every frame because resizing the canvas resets the context state.
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineCap = "round";
  for (let c = 0; c < colors.length; c += 1) {
    ctx.strokeStyle = colors[c];
    ctx.beginPath();
    for (const p of particles) {
      if (p.color !== c) continue;
      const dx = p.x - p.px;
      const dy = p.y - p.py;
      const scale = Math.min(1, SPARK_LENGTH / (Math.hypot(dx, dy) || 1));
      ctx.moveTo(p.x - dx * scale, p.y - dy * scale);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
}
