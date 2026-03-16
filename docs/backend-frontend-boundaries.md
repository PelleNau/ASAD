# Backend And Frontend Boundaries

This document defines the working boundary between Codex and Loveable.

## Core Principle

Backend owns truth and contracts.
Frontend owns interaction and presentation.

The frontend should never infer backend rules from loosely structured data. The backend should expose stable, typed contracts for all important flows.

## Backend Scope

Owned by Codex.

### Data models

- story record
- story version
- artifact record
- generation envelope
- prompt family/version metadata
- review record
- render job record

### Services

- story ingestion
- normalization
- artifact generation
- prompt execution
- schema validation
- evaluation
- render orchestration
- storage access

### Outputs owned by backend

- canonical story JSON
- artifact JSON
- HTML render payloads
- final PDF metadata
- status and review state

### Backend should expose

- typed API responses
- status enums
- artifact type enums
- prompt family enums
- template IDs
- pagination and filtering contracts

## Frontend Scope

Owned by Loveable.

### UI surfaces

- upload flow
- story list and detail views
- generation request screens
- artifact preview UI
- review UI
- prompt/version admin UI
- job monitoring UI

### Frontend should not own

- prompt logic
- schema validation rules
- PDF composition rules
- curriculum alignment logic
- material generation logic
- storage semantics

## Shared Contract Areas

These must be agreed before frontend implementation proceeds.

### 1. Story ingestion contract

Frontend sends:

- title
- language
- story text
- illustration file
- optional tags

Backend returns:

- story ID
- upload status
- validation errors if any

### 2. Generation request contract

Frontend sends:

- story ID
- requested artifact types
- selected prompt options
- selected layout variant

Backend returns:

- job ID
- accepted artifact plan
- initial status

### 3. Artifact retrieval contract

Backend returns:

- artifact envelope
- artifact JSON
- preview HTML or preview URL
- PDF URL if rendered
- review status

### 4. Review contract

Frontend sends:

- approve or reject
- notes
- optional issue category

Backend returns:

- updated review state
- revision pointer if regenerated

## Ownership By File Area

### Backend-first paths

- `apps/api`
- `apps/worker`
- `packages/schemas`
- `packages/prompts`
- `packages/renderer`

### Frontend-first paths

- `apps/web`
- `public`

### Shared docs

- `docs/main.md`
- `docs/backend-frontend-boundaries.md`
- `docs/api-contracts.md`

## Integration Rules

### Rule 1

Frontend consumes exported schema-derived types where possible.

### Rule 2

Frontend does not build worksheet HTML for final print output. Backend owns print rendering.

### Rule 3

Frontend may render previews from backend-provided structured data or preview HTML, but should not redefine artifact semantics.

### Rule 4

Any new artifact type requires:

- schema addition
- prompt-family mapping
- renderer support decision
- API exposure plan
- frontend display plan

## Pending Shared Decisions

- whether the frontend app will be React/Vite or Next.js
- whether review previews use raw HTML, iframe, or image snapshots
- how prompt version management appears in UI
- auth model for internal operators

