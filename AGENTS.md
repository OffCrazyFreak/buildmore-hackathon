# AGENTS.md

Static site, no build step, no bundler, no npm packages. Native ES modules, so it needs an HTTP server locally (`python3 -m http.server`); GitHub Pages serves it in production.

## Layout

- `shared/`: the code every version draws on, one concern per file (`scene.js`, `loop.js`, `canvas.js`, `pointer.js`, `motion.js`, `split-text.js`, `spring-letters.js`, `flow-field.js`, `particles.js`, `embers.js`, `ink.js`) plus `hero.css` for the shared layout, letter spans and focus ring.
- `versions/<name>/`: a version is a folder with exactly three files: `index.html` (markup, Google Fonts link, concept comment on line 2), `style.css` (custom properties for palette and fonts, a few size overrides) and `main.js` (imports from `shared/` and holds only what is specific to that version).
- A new version reuses `shared/` before adding anything. If two versions need the same thing, it goes in `shared/`, never copied between `main.js` files.
- Keep files at roughly 50 to 100 lines and split by concern, not to hit a number.

## Conventions

- Kebab-case filenames. `design-0N` means built with the frontend design skill, `free-0N` without it, `combo-0N` combines the kept ones.
- `function name() {}` over arrow constants, except small inline callbacks. Double quotes in JS. Named exports only.
- Comments explain a non-obvious decision in one line. Never narrate the code.
- No em dashes or en dashes anywhere: code, comments, copy, commits.
- Every page respects `prefers-reduced-motion`, keeps the hero copy as real DOM text, stops its animation loop when the tab is hidden, and handles resize and devicePixelRatio. The shared modules already do this; do not reimplement it per version.
- Format with Prettier before committing: `npx prettier --write .`
- Commit message: `type(scope): Short summary in imperative mood`, with a `Changes:` list. No trailers.
