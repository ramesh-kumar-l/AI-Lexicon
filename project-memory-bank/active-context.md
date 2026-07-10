# AI Lexicon — Active Context

## Current phase

**Phase 2: Editable sections and cards** — complete and verified. See [[progress]].

## Status

Added full CRUD for sections and cards on top of the Phase 1 foundation, with no changes to the storage adapter's public API (`loadAppData`/`saveAppData`/`resetAppData` — CRUD is implemented as pure state-transform functions layered on top, see [[system-patterns]]).

New capabilities: Add/Edit/Archive/Delete for sections, Add/Edit/Duplicate/Archive/Delete for cards, an "Archived" toggle in the header to reveal archived items (badge-marked, dimmed), and inline validation (required title, length limits) shown per-field in the form. All destructive actions (section delete cascades to its cards, card delete) go through a shared `ConfirmDialog` — the old `window.confirm` for reset-to-seed was replaced with the same dialog for consistency.

`npm install`, `npm run build`, and `npm run preview` all succeeded. Playwright (headless Chromium) verified 25/25 checks with no console errors, run against both the dev server and the production preview build:
- 10 Phase 1 regression checks (search, filter, expand/collapse, copy+persist, keyboard focus) — still passing.
- 2 Phase 1 resilience checks (corrupted-localStorage fallback, reset-to-seed) — still passing, reset now driven through the new `ConfirmDialog` instead of `window.confirm`.
- 10 new Phase 2 CRUD checks: add/edit/delete section (with cascade + confirm), add/edit/duplicate/archive/delete card, archived-item visibility toggle, empty-title validation blocking submit, and full persistence across a page reload.
- 3 modal accessibility checks: auto-focus on the first form field when a modal opens, Escape closes it, and focus returns to the triggering button on close.

## Immediate next steps

Phase 2 is done. **Waiting for the user's explicit instruction before starting Phase 3** — per the project's phase-discipline rule (no auto-continuing between phases).

## Deferred decisions (intentionally not addressed yet)

- Tag/favorite filter UI, sort options, favoriting a card — Phase 3 (tags/favorites/copyCount/lastCopiedAt fields already exist in the data model; Phase 2's `CardForm` intentionally does not expose a favorite toggle to keep that scoped to Phase 3).
- Moving a card between sections — not exposed in `CardForm` yet; deferred to avoid scope creep, no data-model blocker.
- IndexedDB migration — still planned for later (Phase 6/7 production-hardening).
- Import/export UI, corrupted-data recovery UX beyond silent fallback — Phase 4 (adapter placeholder functions unchanged).
- Prompt template variables (`{framework}`, `{audience}`, etc.) — Phase 5.
- PWA manifest/service worker — Phase 6.
