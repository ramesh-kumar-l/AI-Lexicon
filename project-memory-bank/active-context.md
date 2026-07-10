# AI Lexicon — Active Context

## Current phase

**Phase 1: Data model and storage foundation** — complete and verified. See [[progress]].

## Status

The repo was completely empty (only `LICENSE` + a 2-line `README.md`) when this phase began — no prior app code existed anywhere, confirmed by exhaustive search. Built from scratch per user approval: Vite + React (JS) + Tailwind v4 scaffold, `src/data/` seed content (5 sections × 3 cards), `src/storage/localStorageAdapter.js` + `src/hooks/useAppData.js`, and `src/AI-Lexicon.jsx` as a read-only browsing UI (search, expand/collapse, copy-to-clipboard with persisted copy counts).

`npm install`, `npm run build`, and `npm run preview` all succeeded. Browser-driven smoke tests (Playwright, headless Chromium) confirmed: direct load into working UI, sidebar section filtering, live search across title/content/prompt/notes/tags, expand/collapse, copy-to-clipboard with persisted copy count surviving a page reload, graceful fallback to seed data when `localStorage` is corrupted, reset-to-seed reverting state, and keyboard focus reachability. No console errors.

## Immediate next steps

Phase 1 is done. **Waiting for the user's explicit instruction before starting Phase 2** — per the project's phase-discipline rule (no auto-continuing between phases).

## Deferred decisions (intentionally not addressed yet)

- IndexedDB migration — planned for later (Phase 6/7 production-hardening), not Phase 1. See [[tech-context]] for why localStorage was chosen now.
- CRUD editing UI (add/edit/duplicate/archive/delete sections and cards) — Phase 2.
- Tag/favorite filter UI, sort options — Phase 3 (tags/favorites/copyCount/lastCopiedAt fields already exist in the data model, just no UI to filter/sort by them yet).
- Import/export UI, corrupted-data recovery UX beyond silent fallback — Phase 4 (adapter functions exist as placeholders already).
- Prompt template variables (`{framework}`, `{audience}`, etc.) — Phase 5.
- PWA manifest/service worker — Phase 6.
