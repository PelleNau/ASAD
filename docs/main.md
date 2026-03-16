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

### 2026-03-16 - Codex

What changed:

- installed workspace dependencies and generated a lockfile
- fixed TypeScript path resolution and ESM runtime issues for local execution
- generated backend-derived API fixture snapshots successfully

Files touched:

- `tsconfig.base.json`
- `apps/*/tsconfig.json`
- `packages/*/src/index.ts`
- `packages/schemas/src/*.ts`
- `apps/*/package.json`
- `scripts/generate-fixtures.mjs`
- `fixtures/generated/*`
- `docs/build-sequence.md`

Open questions:

- whether to keep the current `dist/.../src/*` entrypoint shape until project references are introduced
- whether generated fixture snapshots should become part of every contract-changing PR

Next recommended step:

- commit the validated build/runtime fixes
- then replace the static prompt runner with a real OpenAI runner and add PDF rendering

### 2026-03-16 - Codex

What changed:

- added an OpenAI-backed prompt runner behind the existing runner interface
- kept static generation as the default fallback when `OPENAI_API_KEY` is missing
- verified that check, build, and generated fixture snapshots still succeed locally

Files touched:

- `packages/prompts/src/runner.ts`
- `packages/prompts/package.json`
- `apps/worker/src/index.ts`
- `apps/api/src/index.ts`
- `README.md`
- `docs/generated-fixture-procedure.md`

Open questions:

- whether to move from prompt-constrained JSON parsing to stricter Responses API structured outputs next
- whether answer sheets should get a dedicated schema instead of reusing worksheet generation temporarily

Next recommended step:

- add PDF rendering with Playwright
- then replace the static worksheet template with the first production worksheet design

### 2026-03-16 - Codex

What changed:

- added a Playwright-backed HTML-to-PDF renderer in the renderer package
- added a sample PDF script for rendering a worksheet artifact to disk
- verified check/build/fixture generation after adding the renderer path

Files touched:

- `packages/renderer/src/pdf.ts`
- `packages/renderer/src/index.ts`
- `packages/renderer/package.json`
- `scripts/render-sample-pdf.mjs`
- `package.json`
- `docs/build-sequence.md`

Open questions:

- whether to commit generated sample PDFs or keep them runtime-only
- whether preview PNG generation should be added alongside PDFs in the same renderer package

Next recommended step:

- validate `pnpm pdf:sample` outside the current sandboxed browser restriction
- then upgrade the worksheet print template to the first production design pass

### 2026-03-16 - Codex

What changed:

- extracted worksheet design signals from the sample story PDFs
- upgraded the worksheet HTML template to carry level taxonomy, stronger print hierarchy, and answer spaces
- regenerated the artifact detail snapshot to reflect the new worksheet design

Files touched:

- `packages/renderer/src/worksheet-html.ts`
- `fixtures/generated/artifact-detail.generated.json`

Open questions:

- whether the final worksheet should include illustration placement on the first page
- whether answer sheets should mirror the same visual shell or use a simpler teacher-facing variant

Next recommended step:

- validate the upgraded template through the PDF renderer outside sandbox restrictions
- then add a dedicated answer-sheet print template

### 2026-03-16 - Codex

What changed:

- rebuilt the worksheet print shell to follow the reference PDFs much more closely
- switched from the previous branded card layout to a sparse editorial page layout
- matched the top title block, top-right illustration area, colored level header, metadata lines, footer rule, and mixed-question marker behavior

Files touched:

- `packages/renderer/src/worksheet-html.ts`
- `fixtures/generated/artifact-detail.generated.json`

Open questions:

- whether we should add real illustration URLs to the story schema so the renderer can use the actual uploaded art instead of a placeholder panel
- whether the footer should use a real logo asset rather than CSS recreation

Next recommended step:

- add dedicated illustration-url support to the canonical story/rendering path
- then build the answer-sheet variant against the same page shell

### 2026-03-16 - Codex

What changed:

- added renderable illustration fields to the canonical story record
- added optional sample-answer fields to worksheet questions for teacher-facing output
- implemented a dedicated answer-sheet print variant on the same worksheet shell
- generated an answer-sheet detail snapshot alongside the existing worksheet snapshot

Files touched:

- `packages/schemas/src/story.ts`
- `packages/schemas/src/worksheet.ts`
- `packages/prompts/src/runner.ts`
- `packages/renderer/src/templates.ts`
- `packages/renderer/src/worksheet-html.ts`
- `apps/api/src/index.ts`
- `apps/api/src/fixtures.ts`
- `apps/worker/src/index.ts`
- `scripts/generate-fixtures.mjs`

Open questions:

- whether `sampleAnswer` should later split into `facitText` and `assessmentNote`
- whether the frontend should expose worksheet and answer-sheet previews side by side in the same story workspace

Next recommended step:

- render real uploaded illustration assets instead of fixture data URIs
- then tighten the answer-sheet content model if teacher feedback shows the current sample-answer field is too loose

### 2026-03-16 - Codex

What changed:

- extended the create-story ingestion contract to carry illustration render metadata
- updated fixtures/docs so frontend can rely on `illustrationUrl` and `illustrationAlt`
- made the story upload contract explicit about backend responsibility for turning uploads into renderable assets

Files touched:

- `packages/schemas/src/api.ts`
- `apps/api/src/fixtures.ts`
- `docs/api-contracts.md`
- `docs/backend-frontend-boundaries.md`

Open questions:

- whether the upload API should eventually return signed URLs, permanent URLs, or opaque asset handles
- whether illustration alt text should be operator-authored, model-generated, or both

Next recommended step:

- add an asset-storage abstraction in backend code
- then replace fixture data URIs with asset-backed illustration URLs in the local generation path

### 2026-03-16 - Codex

What changed:

- added a local asset-storage package for illustration files
- switched the sample story/bootstrap path from inline data URIs to file-backed illustration URLs
- made local scripts compatible with an explicit `ASAD_ROOT` override for asset output

Files touched:

- `packages/assets/*`
- `apps/api/src/index.ts`
- `apps/api/package.json`
- `tsconfig.base.json`
- `README.md`
- `docs/build-sequence.md`

Open questions:

- whether to add a formal asset-record schema next
- whether preview HTML should keep using `file://` URLs in dev or move to a tiny local asset server

Next recommended step:

- add an asset metadata schema and API response shape
- then replace `file://` preview URLs with a local-served asset path for browser-facing environments

### 2026-03-16 - Codex

What changed:

- added a formal asset schema to the shared schema package
- embedded optional illustration asset metadata in the story record
- switched local illustration render URLs from `file://` URLs to browser-safe `/assets/local/...` paths

Files touched:

- `packages/schemas/src/asset.ts`
- `packages/schemas/src/story.ts`
- `packages/schemas/src/index.ts`
- `packages/assets/src/index.ts`
- `apps/api/src/index.ts`
- `docs/api-contracts.md`
- `docs/backend-frontend-boundaries.md`

Open questions:

- whether `storagePath` should stay visible outside backend-only contracts
- whether `/assets/local/...` should be treated as a dev-only convention or the permanent public asset path shape

Next recommended step:

- add a minimal asset-serving route in the API layer for local/dev preview
- then thread asset metadata into frontend fixtures and preview docs more explicitly

### 2026-03-16 - Codex

What changed:

- added a framework-neutral local asset route resolver in the API layer
- documented `GET /assets/local/:fileName` as the local/dev asset-serving contract
- added a probe script to verify the route result without requiring a full HTTP server yet

Files touched:

- `packages/assets/src/index.ts`
- `apps/api/src/index.ts`
- `package.json`
- `scripts/probe-local-asset.mjs`
- `docs/api-contracts.md`
- `docs/backend-frontend-boundaries.md`
- `docs/build-sequence.md`

Open questions:

- whether the eventual API app should serve these assets directly or delegate to a static middleware layer
- whether preview HTML should continue embedding `/assets/local/...` or move to signed/absolute URLs in staging

Next recommended step:

- add a minimal actual HTTP server or route adapter in `apps/api`
- then hand Loveable the explicit asset-preview contract for frontend integration

### 2026-03-16 - Codex

What changed:

- added a minimal Node HTTP server for local API integration
- exposed health, story, artifact, and local asset routes from `apps/api`
- added a probe script that exercises the running server over HTTP

Files touched:

- `apps/api/src/server.ts`
- `apps/api/package.json`
- `package.json`
- `scripts/probe-api-server.mjs`
- `docs/api-contracts.md`
- `docs/backend-frontend-boundaries.md`
- `docs/build-sequence.md`

Open questions:

- whether to keep the server framework-neutral or move to Fastify once mutation routes expand
- whether Loveable should consume the local API directly now or keep using generated fixtures until review UI starts

Next recommended step:

- run the local API server and verify asset/JSON endpoints end to end
- then hand Loveable the exact local base URL and implemented routes

### 2026-03-16 - Codex

What changed:

- added in-memory generation and review actions to the local API server
- wired the backend-owned preview page to call those actions directly
- verified state changes over HTTP for generate and approve flows

Files touched:

- `apps/api/src/server.ts`
- `public/local-preview.html`
- `docs/api-contracts.md`
- `docs/build-sequence.md`

Open questions:

- whether local server state should reset on restart or persist to a dev file store
- whether teacher notes should be added to the mutable local workflow state next

Next recommended step:

- expose teacher-notes detail and review paths in the local server
- then decide whether to persist local workflow state between runs
