export function createCanvas(canvas, { onResize, onSeed }) {
  const ctx = canvas.getContext("2d");
  const view = { ctx, width: 0, height: 0 };
  let seedTimer = 0;

  function fit() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    view.width = window.innerWidth;
    view.height = window.innerHeight;
    canvas.width = Math.round(view.width * dpr);
    canvas.height = Math.round(view.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resize() {
    fit();
    onResize(view);
    clearTimeout(seedTimer);
    // Reseeding per resize event stutters and repeats any warm-up, so wait for the drag to settle.
    seedTimer = setTimeout(onSeed, 150);
  }

  window.addEventListener("resize", resize);
  fit();

  return view;
}
