# AI Lexicon — Tech Context

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Build tool | Vite | `npm run dev` / `build` / `preview` |
| UI framework | React 19 | Plain JavaScript (`.jsx`), not TypeScript, per explicit product decision |
| Styling | Tailwind CSS v4 | via `@tailwindcss/vite` plugin, not the v3 postcss+config approach |
| Icons | lucide-react | static icon-key → component lookup, see [[system-patterns]] |
| Persistence | `window.localStorage` | wrapped in an adapter, see [[system-patterns]] |

## Why Tailwind v4 + `@tailwindcss/vite` (not v3)

- Zero extra config files — no `postcss.config.js`, no `tailwind.config.js` needed; v4 scans source files automatically at build time.
- Native Vite plugin integration — one line in `vite.config.js`.
- **Gotcha**: v4's class scanner only sees literal class-name strings in source. Dynamic template strings like `` `text-${color}-600` `` will NOT be detected/included in the build. This is why section colors and icons are resolved through static lookup objects (`src/lib/colorMap.js`, `src/lib/iconMap.js`) rather than string interpolation.

## Why localStorage now, not IndexedDB

Phase 1 is explicitly "foundation," not production-hardening. localStorage is synchronous, requires zero new dependencies, and comfortably handles the data volume of a text-based prompt lexicon (well under its ~5–10MB browser limit for anything short of thousands of large cards). The storage adapter's public API (`loadAppData`/`saveAppData`/`resetAppData`/`exportAppData`/`importAppData`) is storage-mechanism-agnostic by design, so a future phase can introduce an IndexedDB-backed adapter implementing the same signatures and swap it in behind `useAppData` with no changes to `AI-Lexicon.jsx`. Production-grade offline storage should move to IndexedDB before public launch (see [[progress]] Phase 6/7).

## No backend, no network calls

The app is fully static and offline-first by design. Nothing in the codebase makes network requests. This must remain true unless the user explicitly approves a backend or cloud sync in a future phase.

## Deliberately excluded tooling (Phase 1)

No ESLint, Prettier, or test runner yet — avoiding unnecessary dependencies while the foundation is still being established. Revisit in Phase 7 (production polish) if automated tests become valuable for storage/import-export logic.

## File size convention (from Phase 2 onward)

Keep source files under ~300 lines so an AI assistant (or a human) only needs to read the specific small file relevant to a task, not a monolith. When a file approaches the limit, split it along existing seams rather than growing it further — e.g. Phase 2 split CRUD logic into `src/state/sectionOps.js`/`cardOps.js` (pure transforms, no storage/UI concerns) and split `AI-Lexicon.jsx`'s per-section rendering into `components/SectionGroup.jsx` before it crossed 300 lines. Every file in the repo is currently under 300 lines (`AI-Lexicon.jsx` is the largest at ~250); see [[system-patterns]] for the resulting module map.

## npm scripts

- `npm run dev` — local dev server with HMR.
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the production build locally.
