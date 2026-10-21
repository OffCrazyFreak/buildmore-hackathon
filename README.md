# BuildMore Hackathon landing

A single animated hero for the BuildMore Hackathon: the letters are the only light source, embers stream out of them across the screen, letters spring away from the pointer and spray sparks when they move fast, and a press pulls every ember inward.

## Structure

- `index.html`: markup, Google Fonts link and the concept comment on line 2.
- `style.css`: palette (including the ember colours and trail fade the canvas reads at startup), fonts and the glow on the headline.
- `main.js`: reads the palette and wires the shared modules together.
- `shared/`: ES modules and `hero.css`, one concern per file: the frame loop, canvas sizing, pointer state, text splitting, spring letters, the flow field, the ember field and trail drawing.

## Running locally

The page loads `main.js` as a native ES module, which browsers refuse over `file://`, so serve the folder over HTTP: `python3 -m http.server`, then open `http://localhost:8000/`. No build step, no bundler, no npm packages. Google Fonts is the only external request.

Published with GitHub Pages from the `main` branch.
