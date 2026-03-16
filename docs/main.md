# Main

Shared handover and coordination document for Codex and Loveable.

## Roles

### Backend owner: Codex

Primary responsibility:

- ingestion pipeline
- schemas
- generation orchestration
- prompt contracts
- evaluation logic
- HTML-to-PDF pipeline
- storage and versioning
- internal service boundaries

### Frontend owner: Loveable

Primary responsibility:

- product UI
- review tooling
- upload flows
- artifact browsing and preview
- prompt/version management screens
- generation status views
- teacher-facing workflow surfaces

## Working Rules

### Codex should own

- domain models
- API contracts
- worker contracts
- prompt input/output schemas
- rendering inputs
- persistence model
- PDF generation implementation

### Loveable should own

- route structure
- page composition
- visual hierarchy
- component library usage
- design tokens in app UI
- upload interaction patterns
- review interactions and operator workflows

### Shared decisions

These require alignment before implementation:

- API request and response shapes
- artifact preview model
- review state machine
- template metadata exposed to UI
- prompt versioning UX
- naming of core artifact types

## Current State

### Implemented

- repo scaffold
- architecture docs
- canonical story schema
- worksheet schema
- teacher notes schema
- prompt family registry
- static prompt runner
- worksheet HTML renderer
- worker generation envelope

### Not yet implemented

- dependency installation
- real OpenAI integration
- real API server
- queue/workflow engine
- PDF renderer
- frontend app
- review interface

## Handover Format

Every handover entry should include:

1. Date
2. Owner
3. What changed
4. Files touched
5. Open questions
6. Next recommended step

## Active Handover Log

### 2026-03-16 - Codex

What changed:

- created initial monorepo scaffold
- added architecture and schema docs
- added first backend pipeline stubs for story -> artifact -> HTML

Files touched:

- `README.md`
- `docs/architecture.md`
- `docs/schemas-and-pipeline.md`
- `apps/*`
- `packages/*`

Open questions:

- final frontend framework choice
- prompt management UI scope for MVP
- first persistent storage choice for local/dev

Next recommended step:

- create shared backend/frontend boundary document
- define API contract v0
- build real generation runner and PDF rendering script

### 2026-03-16 - Codex

What changed:

- added frontend instruction brief for Loveable
- added backend-side next-steps brief for Codex
- established shared coordination docs for mockup phase

Files touched:

- `docs/lovable-ui-instructions.md`
- `docs/codex-backend-next-steps.md`
- `docs/main.md`

Open questions:

- which sample payload set should be created first
- whether frontend preview should use raw HTML or preview images in MVP

Next recommended step:

- add stable status/review enums to schema package
- create committed API fixtures for Loveable

### 2026-03-16 - Codex

What changed:

- added status and review-state schemas
- added frontend-facing fixture payloads
- expanded API contract doc to include workflow and preview fields

Files touched:

- `packages/schemas/src/status.ts`
- `fixtures/*`
- `docs/api-contracts.md`
- `docs/fixtures-for-lovable.md`

Open questions:

- whether frontend preview should prioritize inline HTML or preview URLs in MVP
- whether artifact list responses should include embedded previews or remain summary-only

Next recommended step:

- add sample route contracts in code
- add a script that emits one generated worksheet fixture from backend code

### 2026-03-16 - Codex

What changed:

- added route-level API schemas in code
- added fixture builder utilities in the API layer
- added generated fixture script scaffold

Files touched:

- `packages/schemas/src/api.ts`
- `apps/api/src/fixtures.ts`
- `scripts/generate-fixtures.mjs`
- `docs/generated-fixture-procedure.md`

Open questions:

- whether generated fixtures should stay committed or only be rebuilt locally
- whether preview payloads should be inlined in list responses or only in detail responses

Next recommended step:

- install dependencies and verify build/check flow
- then switch from static to real prompt runner integration

### 2026-03-16 - Codex

What changed:

- added package export metadata for workspace packages
- added a documented build/install sequence
- prepared the monorepo for first real install/build validation

Files touched:

- `apps/api/package.json`
- `apps/worker/package.json`
- `packages/*/package.json`
- `docs/build-sequence.md`

Open questions:

- whether additional TypeScript path aliases will be needed after first install
- whether fixture generation should move out of `apps/api` into a dedicated package later

Next recommended step:

- run `pnpm install`
- run `pnpm check`
- fix the first real compile/runtime issues that appear

### 2026-03-16 - Codex

What changed:

- added a formal handoff procedure for Loveable
- documented repo split between `ASAD` and `blank-canvas`
- documented required handoff format in both directions

Files touched:

- `docs/lovable-handoff-procedure.md`
- `docs/main.md`

Open questions:

- whether Loveable should start with route skeleton only or full mock screen composition
- whether frontend should keep fixture copies locally or read them manually during mockup phase

Next recommended step:

- tell Loveable to start in `blank-canvas` using the fixture and contract docs from `ASAD`
