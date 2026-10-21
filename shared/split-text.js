function makeLetter(ch) {
  const el = document.createElement("span");
  el.className = "letter";
  el.textContent = ch;
  return { el, hx: 0, hy: 0, w: 0, h: 0, x: 0, y: 0, vx: 0, vy: 0 };
}

export function splitText(el) {
  const text = el.textContent;
  const letters = [];
  el.textContent = "";

  // Screen readers would announce the letter spans one character at a time, so they get the original string.
  const label = document.createElement("span");
  label.className = "sr-only";
  label.textContent = text;
  el.appendChild(label);

  const holder = document.createElement("span");
  holder.setAttribute("aria-hidden", "true");
  // Letters are inline-block, so group them per word or the browser wraps mid-word.
  for (const word of text.split(" ")) {
    const group = document.createElement("span");
    group.className = "word";
    for (const ch of word) {
      const letter = makeLetter(ch);
      group.appendChild(letter.el);
      letters.push(letter);
    }
    holder.appendChild(group);
    holder.appendChild(document.createTextNode(" "));
  }
  el.appendChild(holder);

  return letters;
}

export function splitAll(selector = "[data-split]") {
  const letters = [];
  document.querySelectorAll(selector).forEach((el) => letters.push(...splitText(el)));
  return letters;
}
