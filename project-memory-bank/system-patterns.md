# AI Lexicon — System Patterns

## Data model

```
AppData
  schemaVersion: number
  appVersion: string
  updatedAt: ISO string
  sections: Section[]

Section
  id, title, description, iconKey, color, order
  archived: boolean
  createdAt, updatedAt: ISO string
  cards: Card[]

Card
  id, sectionId, title, content
  prompt          (the brief's "exampleCode or prompt" — collapsed to one field,
                    consistent with the future TemplateCard.templateText field)
  notes
  tags: string[]
  favorite, archived: boolean
  copyCount: number
  lastCopiedAt: ISO string | null
  createdAt, updatedAt: ISO string
```

Card's shape does not preclude adding `templateText` / `variables[]` / `generatedOutput` in Phase 5 (prompt templates).

Defined in `src/data/constants.js` (schema/app version) and `src/data/seedData.js` (starter content: 5 sections × 3 cards — Debugging, Code Review, Testing, Architecture, Prompt Engineering). Seed IDs are static human-readable slugs, not runtime-generated, so the seed dataset stays stable and diffable in git.

## Storage adapter pattern

`src/storage/localStorageAdapter.js` is the **only** module that touches `window.localStorage`. Public API:

- `loadAppData()` — returns validated `AppData`, falling back to a fresh seed clone on any failure (localStorage inaccessible, invalid JSON, failed shape validation, unsupported future schema version). Failures are logged via `console.warn`, never thrown to the UI.
- `saveAppData(appData)` — persists, stamping `updatedAt`. Returns `boolean` success.
- `resetAppData()` — persists and returns a fresh seed clone.
- `exportAppData(appData)` / `importAppData(json)` — Phase 4 placeholders; already validate+migrate but have no download-to-file or merge UI yet.

Validation helpers: `isValidAppData` → `isValidSection` → `isValidCard` (shape checks only, not deep semantic validation). `migrateAppData` is a stub for future schema-version bumps (`schemaVersion` is already threaded through everywhere so this won't require a data-shape change later).

`src/hooks/useAppData.js` wraps the adapter in a hook exposing `{ appData, recordCopy(cardId), resetToSeed() }` plus the CRUD actions below. **`AI-Lexicon.jsx` never imports the adapter directly** — always goes through this hook. Any future storage backend (e.g. IndexedDB) swaps in behind this same hook interface.

## CRUD state-transform pattern (Phase 2)

`src/state/sectionOps.js` and `src/state/cardOps.js` are pure functions — `(appData, ...args) => newAppData` — with no side effects and no storage access. Each op stamps `updatedAt` and (for cards) touches the parent section's `updatedAt` too. `useAppData.js` wraps every op in a single `apply(updater)` helper that runs the transform, persists via `saveAppData`, and updates React state — so **every mutation path goes through the same save call**, there is no way to change `appData` without persisting it.

- `sectionOps`: `createSection`, `updateSection`, `setSectionArchived`, `deleteSection` (hard delete, cascades — removes the section and all its cards in one array filter).
- `cardOps`: `createCard`, `updateCard`, `duplicateCard` (inserts a `"<title> (Copy)"` card immediately after the source, resets `copyCount`/`favorite`/timestamps), `setCardArchived`, `deleteCard`, `recordCardCopy`.

IDs for user-created sections/cards come from `src/lib/id.js` (`crypto.randomUUID()` with a fallback for non-secure contexts) — seed data keeps its static slugs, only new entities get generated IDs.

Archive vs. delete: archiving is reversible and needs no confirmation (a header toggle reveals archived items, dimmed with an "archived" badge); deleting is permanent and always goes through `ConfirmDialog`. Section delete warns about its card count before cascading.

Validation (`src/lib/validation.js`): `validateSectionInput`/`validateCardInput` return `{ valid, errors }` for required-field and max-length checks, surfaced inline per-field in the forms. `parseTags` turns a comma-separated string into a deduped, trimmed tag array.

## Component architecture

`src/AI-Lexicon.jsx` is the top-level orchestrator (mounted from `src/main.jsx`) — it owns `useAppData()`, view state (selected section, search query, show-archived toggle, expanded-card set), and modal/confirm state, then composes:

- `components/Sidebar.jsx` — "All Sections" + per-section nav, with hover/focus-revealed Edit/Archive/Delete icon buttons (Add Section lives in the sidebar header). Icon from `src/lib/iconMap.js` (static `iconKey → lucide-react component` map — required because of the Tailwind v4 literal-class-scanning constraint, see [[tech-context]]).
- `components/SectionGroup.jsx` — one section's heading + "Add Card" button + its list of `CardItem`s.
- `components/CardItem.jsx` — expand/collapse, copy-to-clipboard, and hover/focus-revealed Edit/Duplicate/Archive/Delete icon buttons.
- `components/Modal.jsx` — generic accessible dialog: traps Escape-to-close, backdrop-click-to-close, auto-focuses the first `input`/`textarea`/`select` (falling back to `[data-autofocus]`), and restores focus to the triggering element on close.
- `components/SectionForm.jsx` / `components/CardForm.jsx` — add/edit forms built on `Modal`, wired to `src/lib/validation.js`.
- `components/ConfirmDialog.jsx` — built on `Modal`, used for every destructive action (section delete, card delete, reset-to-seed).

Section accent/tag colors come from `src/lib/colorMap.js` (static `color → Tailwind class` map, same static-lookup reasoning as icons); both `iconMap.js` and `colorMap.js` export an `*_OPTIONS` array consumed by `SectionForm`'s dropdowns.

## Search

Case-insensitive substring match across `title`, `content`, `prompt`, `notes`, and joined `tags`, scoped to the selected section (or all sections if none selected). Implemented in `cardMatchesQuery()` in `AI-Lexicon.jsx`.

## UI conventions

- Card radius ≤ `rounded-lg` (8px). No nested bordered/rounded boxes inside a card (the expanded prompt block uses a plain `border-l-2 pl-2` indent, not a shaded box).
- No landing-page/hero layout — the first screen is the working app.
- Icons/colors are data-driven (`Section.iconKey` / `Section.color`) rather than hardcoded per section in markup.
- Copy-to-clipboard: `navigator.clipboard.writeText` when in a secure context, with an `execCommand('copy')` fallback (relevant if a built `dist/index.html` is opened directly via `file://`).
