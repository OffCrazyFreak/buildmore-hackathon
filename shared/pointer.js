// One pointer for the whole page; touch-action: none in hero.css keeps touches from scrolling instead.
export function createPointer() {
  const pointer = { x: -9999, y: -9999, down: false };

  function track(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }

  function release() {
    pointer.down = false;
  }

  function leave() {
    pointer.x = -9999;
    pointer.y = -9999;
    pointer.down = false;
  }

  window.addEventListener("pointermove", track);
  window.addEventListener("pointerdown", (event) => {
    pointer.down = true;
    track(event);
  });
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  document.documentElement.addEventListener("pointerleave", leave);

  return pointer;
}
