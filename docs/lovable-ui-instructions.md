# Loveable UI Instructions

This document is the first UI/UX implementation brief for Loveable.

The current phase is mockups and frontend structure, but the UI must be designed as a client of a real backend system. Do not design it as a static single-page concept with hidden assumptions in the frontend.

## Goal

Create the first UI/UX implementation for ASAD as a backend-backed content operations tool for generating teacher-support materials from stories.

The UI should help users:

1. upload or create stories
2. request generated materials
3. inspect generated artifacts
4. review outputs before publication
5. understand prompt family and layout configuration at a product level

## Product Positioning

ASAD is not just a worksheet viewer.

It is an internal production tool for:

- story ingestion
- teacher-material generation
- PDF publishing
- review and approval

The UI should reflect that operational workflow.

## Important Constraint

Backend owns:

- story normalization
- prompt execution
- schema validation
- artifact generation
- HTML/PDF rendering
- review state

Frontend owns:

- workflow clarity
- data presentation
- job visibility
- previews
- upload and review interactions

Do not move prompt logic, generation logic, or PDF layout logic into the frontend.

## Current Backend Concepts

Loveable should design around these backend concepts:

- `StoryRecord`
- `MaterialGenerationRequest`
- `GenerationArtifactEnvelope`
- artifact types such as:
  - `worksheet`
  - `teacher_notes`
  - `vocabulary_sheet`
  - `discussion_guide`
  - `curriculum_alignment`
  - `answer_sheet`

The frontend should assume these are stable domain concepts exposed by the backend.

## First UI/UX Scope

Build mockups first for these screens:

### 1. Story Library

Purpose:

- browse all stories
- view status at a glance
- open a story workspace

UI should show:

- story title
- language
- asset completeness
- generation status
- last updated
- quick action to open

### 2. New Story / Upload Flow

Purpose:

- create a story record
- upload story text and one illustration

UI should include:

- title input
- language selector
- story text input area
- illustration upload
- optional metadata fields
- validation state

Design this as a serious editorial workflow, not a playful consumer form.

### 3. Story Workspace

Purpose:

- central workspace for one story
- request generation
- inspect generated artifacts
- view review state

Recommended layout:

- left column or top area: story summary and source info
- main panel: generated artifacts and previews
- side panel: generation controls and metadata

### 4. Generation Request Panel

Purpose:

- let operators choose what to generate

UI should include:

- artifact type selection
- level differentiation options
- prompt family or profile visibility
- layout/template selection
- generate button

This should feel like configuring a content job, not editing the content directly.

### 5. Artifact Review Screen

Purpose:

- inspect generated output
- compare metadata and preview
- approve or reject

UI should include:

- artifact metadata
- HTML or PDF preview area
- review notes
- approve/reject actions
- issue tagging

### 6. Prompt / Template Visibility

Purpose:

- communicate which prompt family and template were used
- help operators trust the system

For mockups, expose:

- prompt family name
- prompt version
- template ID
- schema version
- model

This does not need to be full admin UI yet, but it should be visible somewhere in the workflow.

## UX Direction

The UI should feel like a publishing or editorial operations system.

It should not feel like:

- a student-facing reading product
- a marketing site
- a toy AI prompt playground

Target qualities:

- calm
- structured
- credible
- operational
- easy to scan

## Information Architecture

Use something close to:

- `Stories`
- `Story Workspace`
- `Artifacts`
- `Review`
- `Settings` or `Templates` later

Do not over-expand navigation early. Keep the first version focused on the core workflow.

## Mockup Rules

### Rule 1

Mockups must use realistic backend-driven states:

- empty
- uploading
- validating
- generation queued
- generation in progress
- generated
- needs review
- approved
- failed

### Rule 2

Mockups must show structured data, not lorem ipsum.

Use plausible fields from backend contracts.

### Rule 3

Mockups should anticipate asynchronous work.

Generation is not instant. The UI should include status, progress, and recoverable error states.

### Rule 4

Preview is important, but preview is not the source of truth.

Artifact metadata and review state should be visible alongside the preview.

## Suggested First Frontend Deliverable

Loveable should produce:

1. route structure proposal for `apps/web`
2. wireframes or high-fidelity mockups for:
   - story library
   - upload flow
   - story workspace
   - review screen
3. component inventory
4. state model for the above screens
5. list of backend endpoints needed for implementation

## Backend Assumptions For Loveable

Assume the backend will provide:

- typed responses
- stable artifact enums
- preview payloads
- immutable generation metadata

Do not assume the frontend can:

- generate artifacts locally
- construct final PDF layout
- infer prompt family from display text

## Coordination

Before building the frontend structure, Loveable should read:

- `docs/main.md`
- `docs/backend-frontend-boundaries.md`
- `docs/api-contracts.md`

Any frontend proposal that changes domain concepts or API contracts should be surfaced before implementation.
