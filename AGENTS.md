# AGENTS.md

Static site, no build step. Each file under `versions/` is a fully self-contained HTML page: inline CSS and vanilla JS, Google Fonts as the only external request.

- Kebab-case filenames. `design-0N` means built with the frontend design skill, `free-0N` without it.
- `function name() {}` over arrow constants, except small inline callbacks. Double quotes in JS.
- Comments explain a non-obvious decision in one line. Never narrate the code.
- No em dashes or en dashes anywhere: code, comments, copy, commits.
- Every page respects `prefers-reduced-motion`, keeps the hero copy as real DOM text, stops its animation loop when the tab is hidden, and handles resize and devicePixelRatio.
- Format with Prettier before committing: `npx prettier --write .`
- Commit message: `type(scope): Short summary in imperative mood`, with a `Changes:` list. No trailers.
