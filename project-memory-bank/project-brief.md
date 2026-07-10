# AI Lexicon — Project Brief

## What it is

AI Lexicon is a private, offline-first AI workflow and prompt knowledge system for engineers and teams. It is not a static prompt list — it is an editable, organizable, importable/exportable workspace where engineers capture, improve, and reuse prompts, playbooks, workflow patterns, debugging methods, testing methods, architecture patterns, code review prompts, and reusable templates.

Positioning: "A private, offline-first AI workflow system for repeatable, trusted AI results."
Tagline: "A working vocabulary for faster, smarter AI collaboration."

## Problem it solves

Engineers use AI daily but their best prompts, playbooks, and workflow patterns are scattered across chat history, notes apps, and memory — not captured, not reused, not shared reliably across a team. AI Lexicon turns ad-hoc AI usage into repeatable, trusted workflows.

## Primary users

- Software engineers using AI daily.
- AI champions inside engineering teams.
- Junior engineers learning how to use AI reliably.
- Product managers and technical writers using repeatable AI workflows.
- Consultants and agencies reusing client-ready AI workflows.
- Teams that need internal AI prompt standards and playbooks.

## Core principles

- Offline-first: works without a network connection once loaded.
- Privacy-first: no data leaves the browser unless the user explicitly exports or shares it. No hidden network calls, no accounts, no telemetry, no cloud sync (until explicitly approved in a future phase).
- Editable and trustworthy: users can add, edit, duplicate, archive, import, export, and reset their content with confidence nothing will be silently lost or corrupted.
- Calm, dense, professional interface — a productivity tool, not a marketing site.

## Explicit non-goals (for now)

- No backend/server.
- No cloud sync or multi-device sync.
- No user accounts or authentication.
- No telemetry/analytics.

## Roadmap (8 phases)

1. **Data model and storage foundation** — *in progress*. Seed data, storage adapter, read-only browsing UI (search, expand/collapse, copy).
2. Editable sections and cards — CRUD with validation and confirmation for destructive actions.
3. Search, filters, tags, favorites — full personal-knowledge-base features.
4. Import, export, backup, reset — portability and trust.
5. Prompt templates — variables like `{framework}`, `{audience}`, fill-in UI, generated output.
6. PWA and offline installability.
7. Trust and production polish — tests, accessibility, docs, public-launch readiness.
8. Optional desktop app (Tauri preferred) — only after the web/PWA product is stable, and only with explicit approval.

See [[progress]] for phase-by-phase status and [[active-context]] for what's happening right now.
