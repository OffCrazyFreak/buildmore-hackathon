import { createLoop } from "../../shared/loop.js";
import { createPointer } from "../../shared/pointer.js";
import { createSpringLetters } from "../../shared/spring-letters.js";

const root = document.documentElement;
const pointer = createPointer();
const letters = createSpringLetters({ pointer });
let time = 0;

// The glow follows the pointer and drifts on its own once the pointer leaves.
function moveGlow() {
  if (pointer.inside) {
    root.style.setProperty("--gx", pointer.x + "px");
    root.style.setProperty("--gy", pointer.y + "px");
  } else {
    root.style.setProperty("--gx", 50 + Math.sin(time * 0.4) * 20 + "%");
    root.style.setProperty("--gy", 50 + Math.cos(time * 0.3) * 15 + "%");
  }
}

function update(dt, k) {
  time += dt;
  letters.step(time, k);
  moveGlow();
}

createLoop({ update }).start();
