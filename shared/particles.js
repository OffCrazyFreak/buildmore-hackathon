const MAX_PARTICLES = 1400;

export function poolCount(view, areaPerParticle) {
  return Math.max(
    1,
    Math.min(MAX_PARTICLES, Math.floor((view.width * view.height) / areaPerParticle)),
  );
}

export function createPool(count, make) {
  const pool = [];
  for (let i = 0; i < count; i += 1) pool.push(make(i));
  return pool;
}

export function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

// Wrap instead of respawning so the field stays dense across the whole screen.
export function wrapEdges(p, view, margin, inset) {
  if (p.x < -margin || p.x > view.width + margin) {
    p.x = p.x < 0 ? view.width + inset : -inset;
    // Reset the previous point too, or the wrap draws a trail across the screen.
    p.px = p.x;
  }
  if (p.y < -margin || p.y > view.height + margin) {
    p.y = p.y < 0 ? view.height + inset : -inset;
    p.py = p.y;
  }
}

// Tangential push makes a vortex instead of a plain shove; negative strength pulls inward.
export function swirl(p, pointer, radius, strength) {
  const dx = p.x - pointer.x;
  const dy = p.y - pointer.y;
  const d2 = dx * dx + dy * dy;
  if (d2 >= radius * radius) return;
  const d = Math.sqrt(d2) || 1;
  const f = (1 - d / radius) * strength;
  p.vx += (-dy / d) * f + (dx / d) * f * 0.35;
  p.vy += (dx / d) * f + (dy / d) * f * 0.35;
}
