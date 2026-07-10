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

`src/hooks/useAppData.js` wraps the adapter in a hook exposing `{ appData, recordCopy(cardId), resetToSeed() }`. **`AI-Lexicon.jsx` never imports the adapter directly** — always goes through this hook. Any future storage backend (e.g. IndexedDB) swaps in behind this same hook interface.

## Component architecture

`src/AI-Lexicon.jsx` is the single top-level component (mounted from `src/main.jsx`). Structure:

- Header: title/tagline, search input, reset-to-seed icon button (`window.confirm` guarded).
- Left sidebar nav: "All Sections" + one button per section, icon from `src/lib/iconMap.js` (static `iconKey → lucide-react component` map — required because of the Tailwind v4 literal-class-scanning constraint, see [[tech-context]]).
- Main content: cards grouped by section heading, filtered by the active section and search query.
- Section accent/tag colors come from `src/lib/colorMap.js` (static `color → Tailwind class` map, same static-lookup reasoning).

## Search

Case-insensitive substring match across `title`, `content`, `prompt`, `notes`, and joined `tags`, scoped to the selected section (or all sections if none selected). Implemented in `cardMatchesQuery()` in `AI-Lexicon.jsx`.

## UI conventions

- Card radius ≤ `rounded-lg` (8px). No nested bordered/rounded boxes inside a card (the expanded prompt block uses a plain `border-l-2 pl-2` indent, not a shaded box).
- No landing-page/hero layout — the first screen is the working app.
- Icons/colors are data-driven (`Section.iconKey` / `Section.color`) rather than hardcoded per section in markup.
- Copy-to-clipboard: `navigator.clipboard.writeText` when in a secure context, with an `execCommand('copy')` fallback (relevant if a built `dist/index.html` is opened directly via `file://`).
