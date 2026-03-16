# ASAD Frontend Specification

This document is the frontend implementation specification for Loveable.

It should be read together with:

- `docs/v1-engineering-spec.md`
- `docs/api-contracts.md`
- `docs/backend-frontend-boundaries.md`
- `docs/fixtures-for-lovable.md`
- `docs/lovable-handoff-procedure.md`

The frontend is not the source of truth.
It is a backend-backed operator interface for story ingestion, artifact generation, review, and preview.

## 1. Goal

Build the first frontend for ASAD as an internal editorial production tool for teacher-support material.

The frontend must help operators:

1. create and inspect story records
2. request material generation
3. review generated artifacts
4. preview outputs before PDF export or publication
5. understand which prompt/template/version produced the output

## 2. Product Positioning

ASAD is not a student app and not a prompt playground.

It is a content operations interface for:

- ingesting stories and illustrations
- generating teacher-support materials
- reviewing outputs
- managing print-ready deliverables

The UI should feel editorial and trustworthy, not corporate and not playful in a toy-like way.

## 3. Design Direction

### 3.1 Brand signals from `astoryaday.com`

The public A Story A Day site suggests a clear visual language:

- warm and human rather than technical
- illustration-led
- generous spacing
- soft rounded forms
- editorial typography with personality
- calm color fields rather than hard dashboard chrome
- storytelling-first tone

This frontend should borrow those signals without turning the operator product into a marketing page.

### 3.2 Translation into the operator UI

The operator UI should therefore feel like:

- an editorial studio
- a publishing workflow
- a calm review desk

It should not feel like:

- enterprise BI software
- a generic AI chatbot console
- a school LMS from the 2010s

### 3.3 Visual rules

Use:

- warm neutrals
- one or two muted accent colors derived from the brand
- rounded cards and panels
- soft borders
- restrained shadows
- expressive but readable typography
- real illustration surfaces in story cards and preview areas

Avoid:

- overly sharp grids
- heavy dark-mode bias
- purple AI-tool aesthetics
- generic admin gradients
- cluttered icon-heavy layouts

## 4. Frontend Principles

### 4.1 Backend-aware by default

The UI must assume:

- stories are backend records
- artifacts are backend records
- generation is asynchronous
- review is stateful
- preview is derived from backend output

Do not hide or invent local frontend-only truth for these concepts.

### 4.2 Structured workflows

The interface should expose the real sequence:

1. ingest
2. analyze
3. generate
4. review
5. approve
6. export or publish

### 4.3 Metadata stays visible

Artifact metadata is not secondary.

The UI must show:

- artifact type
- status
- review state
- prompt family
- prompt version
- template ID
- schema version
- model
- timestamps

### 4.4 Preview is important but not enough

Preview should be prominent, but operators must also be able to inspect state, notes, issues, and provenance.

## 5. Information Architecture

Initial application structure:

- `Stories`
- `Story Workspace`
- `Review`
- `Artifacts`
- `Settings` later

Recommended MVP nav:

- primary left navigation on desktop
- compact top nav or drawer on mobile

Initial navigation items:

- `Stories`
- `Review`
- `Artifacts`

Do not add broad settings/admin areas in the first pass unless needed for navigation realism.

## 6. Core Screens

### 6.1 Story Library

Purpose:

- browse all story records
- understand status at a glance
- open a story workspace quickly

Must show:

- title
- illustration thumbnail
- language
- reading level or age band if available
- story status
- artifact counts
- review counts
- last updated

Recommended behaviors:

- search by title
- filter by status
- filter by artifact readiness
- sort by updated date

Preferred layout:

- card/table hybrid
- richer than a plain data table
- illustration thumbnail and title should carry most of the visual weight

### 6.2 New Story / Upload

Purpose:

- create a new story record with one text source and one illustration

Must show:

- title input
- language selector
- story text area or document upload
- illustration upload
- validation state
- save/create action

Recommended secondary fields:

- target age band
- notes
- source reference

UX requirements:

- clear paired upload model
- visible field completeness state
- inline validation
- no hidden multistep wizard unless it materially improves completion

### 6.3 Story Workspace

Purpose:

- central operational page for one story

Must show:

- story title
- illustration
- story metadata
- generation controls
- current artifact list
- artifact statuses
- review states

Recommended layout:

- hero strip with title, image, and status
- main content area for artifacts/previews
- side panel for generation controls and provenance

This page should feel like the core of the product.

### 6.4 Generation Request Panel

Purpose:

- configure which materials to generate

Must show:

- preset selection
- manual artifact selection
- level differentiation controls
- prompt family/profile visibility
- template selection or template display
- generate action

Artifact options should include at minimum:

- worksheet level 1
- worksheet level 2
- worksheet mix
- answer sheet
- teacher notes

Important:

This panel configures a job.
It does not directly edit generated content.

### 6.5 Artifact Detail / Review

Purpose:

- inspect one generated artifact in detail
- review and approve or reject it

Must show:

- artifact header with status and review state
- structured metadata
- preview pane
- issue list or validation state
- review notes field
- approve/reject controls

Recommended split:

- left: preview
- right: metadata, state, notes, actions

### 6.6 Review Queue

Purpose:

- allow operators to process pending artifacts efficiently

Must show:

- artifacts needing review
- story title
- artifact type
- level
- generated time
- validation or issue flags
- quick open action

Optional but useful:

- keyboard-friendly review flow
- batch filtering by artifact type or issue state

### 6.7 Artifacts Index

Purpose:

- browse all generated outputs across stories

Must show:

- story
- artifact type
- status
- review state
- template
- prompt version
- updated timestamp

This screen is secondary to `Story Workspace` and `Review`, but it helps operations at scale.

## 7. State Design

The UI must render realistic backend states.

Story states:

- `draft`
- `uploaded`
- `normalizing`
- `ready`
- `failed`

Artifact states:

- `generation_queued`
- `generation_running`
- `generated`
- `needs_review`
- `approved`
- `failed`

Review states:

- `not_required`
- `pending_review`
- `approved`
- `rejected`

Required UI states:

- empty
- loading
- success
- partial data
- validation error
- generation queued
- generation running
- review pending
- rejected with notes
- failure with retry path

## 8. Preview Strategy

The frontend must treat previews as backend-backed.

Allowed preview modes:

- iframe or HTML preview for generated worksheet shell
- asset-backed illustration rendering
- preview image or PDF preview later

Do not:

- rebuild PDF layout logic in the frontend
- recompose print layout from raw question arrays in the browser as the source of truth

The backend renderer owns final print structure.

## 9. Component Guidance

The first UI should likely include:

- app shell
- sidebar nav
- story card
- status badge
- artifact badge
- metadata list
- generation panel
- review action bar
- preview frame
- upload panel
- filter bar
- empty-state panel

Preferred component behavior:

- readable on laptop-sized screens
- mobile-safe but not mobile-first in the workflow sense
- generous click targets
- clear hierarchy before density

## 10. Tone and Copy

Interface copy should be:

- direct
- calm
- editorial
- operational

Prefer:

- `Generate materials`
- `Pending review`
- `Story ready`
- `Rejected with notes`

Avoid:

- gimmicky AI language
- “magic” metaphors inside the operator tool
- vague button labels like `Run`

## 11. Data Contract Requirements

The frontend must build against backend contracts and fixtures.

Primary references:

- `docs/api-contracts.md`
- `fixtures/story-list.json`
- `fixtures/story-detail.json`
- `fixtures/artifact-worksheet-generated.json`
- `fixtures/artifact-worksheet-needs-review.json`
- `fixtures/artifact-teacher-notes-approved.json`
- `fixtures/artifact-failed.json`
- `fixtures/generated/*`

The frontend should expect:

- typed story objects
- typed artifact objects
- typed status enums
- stable IDs
- preview URLs and asset URLs from the backend

## 12. Mockup Phase Deliverable

Loveable should first produce a mockup set that includes:

1. story library
2. upload/create story
3. story workspace
4. generation panel
5. artifact review detail
6. review queue

The mockups should show:

- at least one ready story
- one story still processing
- one failed artifact
- one artifact pending review
- one approved artifact

## 13. Implementation Expectations

Even in mockup phase, the frontend should be structured as if it will connect to the backend immediately after.

That means:

- route-based pages
- fixture-backed data layer
- backend-shaped models
- component states matching real status enums
- no prototype-only fake data model that must later be thrown away

## 14. Frontend Boundaries

Frontend owns:

- route structure
- screen composition
- UI state presentation
- user interaction design
- upload UX
- review UX
- preview embedding

Frontend does not own:

- prompt execution
- schema validation
- generation orchestration
- PDF rendering logic
- artifact approval rules
- template layout logic for print

## 15. Recommended First Build Order

1. app shell and navigation
2. story library using fixture data
3. story workspace shell
4. generation panel UI
5. artifact review detail
6. review queue
7. upload flow
8. integration with local ASAD preview API

## 16. Definition of Done for Frontend V1 Mockups

The first frontend pass is acceptable when:

- it clearly reflects the backend workflow
- it uses backend terms and states correctly
- it feels visually consistent with A Story A Day brand signals
- it avoids generic SaaS styling
- it can transition from fixtures to backend responses without redesigning the data model
- it gives reviewers enough context to judge upload, generation, preview, and review flows
