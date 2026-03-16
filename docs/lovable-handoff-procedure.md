# Loveable Handoff Procedure

This document tells Loveable how to start work, what to read first, what to treat as source of truth, and how to hand work back cleanly.

## Repositories

### Backend repository

Use this repository as the backend source of truth:

- `ASAD`

Backend-owned contracts, schemas, fixtures, and process docs live here.

### Frontend repository

Loveable should write frontend implementation in:

- `blank-canvas`

That repository is the frontend target for mockups and early implementation.

## Phase

Current phase:

- frontend mockups and initial UX structure

Important:

Even though Loveable starts with mockups, the work must assume a real backend exists and will be connected. Do not design isolated static concepts that invent their own business logic.

## What Loveable Must Read First

Before doing any UI work, read these documents in the `ASAD` repo:

1. `docs/main.md`
2. `docs/backend-frontend-boundaries.md`
3. `docs/api-contracts.md`
4. `docs/lovable-ui-instructions.md`
5. `docs/fixtures-for-lovable.md`

These documents define:

- the split between backend and frontend
- the current contract vocabulary
- the intended screens
- the fixture payloads to design against

## Source Of Truth

Loveable should treat the following as source of truth:

### For domain language

- backend schema names
- artifact type enums
- status enums
- review state enums

### For workflow behavior

- `docs/api-contracts.md`
- fixture JSON files in `fixtures/`

### For mockup data

Use fixture payloads from the `ASAD` repo.

Do not invent new backend states unless proposing a change explicitly.

## What Loveable Should Build First

In `blank-canvas`, Loveable should create the first UI/UX implementation for:

1. Story Library
2. Story Upload / New Story
3. Story Workspace
4. Generation Request Panel
5. Artifact Review Screen

The mockups should show realistic backend-driven states:

- draft
- generated
- needs review
- approved
- failed

## Boundaries

### Loveable owns

- page structure
- route structure
- component layout
- interaction design
- status visibility
- preview presentation
- upload flow UX
- review flow UX

### Loveable does not own

- prompt execution logic
- prompt schema design
- artifact generation logic
- curriculum alignment logic
- PDF composition logic
- final print rendering logic
- backend enums or schema semantics

If Loveable thinks one of those backend-owned areas should change, raise it as a proposal rather than implementing it in the frontend.

## Recommended Procedure For Loveable

### Step 1

Review the backend docs and fixtures in `ASAD`.

### Step 2

Set up the frontend workspace in `blank-canvas`.

### Step 3

Build mockups and route structure around the existing contracts and fixture payloads.

### Step 4

Document:

- routes
- screens
- reusable components
- assumptions
- backend data required per screen

### Step 5

Hand back a structured summary that includes:

- what was built
- which fixture data was used
- where the UI depends on backend support
- open questions or blocked areas

## Required Handoff Format From Loveable

When Loveable hands work back, the handoff should include:

1. repository and branch
2. screens added or changed
3. files added or changed
4. which backend fixtures/contracts were used
5. assumptions made
6. open questions for backend

## Required Handoff Format To Loveable

When Codex hands backend changes to Loveable, Codex should provide:

1. changed contract or fixture
2. file references
3. whether the change is breaking
4. what frontend should update

## Design Guidance

Loveable should make the UI feel like:

- an editorial operations tool
- a publishing workflow
- a calm internal system

Not like:

- a consumer reading app
- a generic AI playground
- a student worksheet screen

## Initial Backend Dependencies For Loveable

Loveable should assume the backend will eventually provide:

- story list data
- story detail data
- generation job submission
- artifact listing
- artifact detail with preview metadata
- review submission

For now, use the fixtures as the contract-aligned mock data layer.

## Coordination Rule

If Loveable wants to introduce:

- a new status
- a new artifact type
- a new review state
- a new metadata field

that proposal must be surfaced before frontend implementation treats it as real.
