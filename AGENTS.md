# AGENTS.md

Static site, no build step, no bundler, no npm packages. Native ES modules, so it needs an HTTP server locally (`python3 -m http.server`, then `http://localhost:8000/`); browsers refuse modules over `file://`. GitHub Pages serves it in production.

## Layout

- `index.html` (markup, Google Fonts link, concept comment on line 2), `style.css` (custom properties for palette and fonts, headline glow) and `main.js` (reads the palette from CSS custom properties and wires the modules) form the single page.
- `shared/`: one concern per file.
  - `scene.js`: ties the loop and the canvas together and runs the seed.
  - `loop.js`: the frame loop, paused when the tab is hidden, a single still frame under reduced motion.
  - `motion.js`: the `prefers-reduced-motion` query.
  - `canvas.js`: canvas sizing, devicePixelRatio and debounced reseed on resize.
  - `pointer.js`: the shared pointer state.
  - `split-text.js` and `spring-letters.js`: letter spans with an accessible label, and the spring physics that moves them.
  - `flow-field.js`, `particles.js` and `ember-field.js`: the flow angle, pool and force helpers, and the embers that spawn on letters.
  - `trails.js`: draws the ember trails.
  - `hero.css`: layout, line styles, letter spans and focus ring.
- Colours live only in `style.css`. Modules in `shared/` take them as arguments and never hold palette literals.
- Keep files at roughly 50 to 100 lines and split by concern, not to hit a number.

## Conventions

- Kebab-case filenames.
- `function name() {}` over arrow constants, except small inline callbacks. Double quotes in JS. Named exports only, and no export or parameter without a caller.
- Comments explain a non-obvious decision in one line. Never narrate the code.
- No em dashes or en dashes anywhere: code, comments, copy, commits.
- The page respects `prefers-reduced-motion`, keeps the hero copy as real DOM text that is visible without JavaScript or web fonts, stops its animation loop when the tab is hidden, and handles resize and devicePixelRatio.
- Format with Prettier before committing: `npx prettier --write .`
- Commit message: `type(scope): Short summary in imperative mood`, with a `Changes:` list. No trailers.
