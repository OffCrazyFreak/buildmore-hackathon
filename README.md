# BuildMore Hackathon landing

Six versions of a single animated hero for the BuildMore Hackathon, plus a switcher.

## Structure

- `index.html`: switcher. The buttons are grouped into design skill, no skill and combo. Arrow keys move between versions, `r` reloads the current one, the hash (`#combo-02`) deep-links to a version, and "open alone" opens the current version in its own tab.
- `versions/<name>/`: one folder per version with `index.html` (markup, fonts, concept comment on line 2), `style.css` (palette, fonts, sizes) and `main.js` (wires the shared modules and holds the forces that make this version different).
- `shared/`: ES modules and `hero.css`, one concern per file: the frame loop, canvas sizing, pointer state, text splitting, spring letters, flow fields, ember and ink particles.

`design-01` is the keeper from the batch built with the frontend design skill, `free-01` and `free-02` are the keepers from the batch built without it, and `combo-0N` are three pages that combine the three keepers in different ways.

## Running locally

The pages load `main.js` as a native ES module, which browsers refuse over `file://`, so serve the folder over HTTP: `npx serve .` or `python3 -m http.server`, then open `http://localhost:<port>/`. No build step, no bundler, no npm packages. Google Fonts is the only external request.

Published with GitHub Pages from the `main` branch.
