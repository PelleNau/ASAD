# Codex Backend Next Steps

This is the backend-side companion document to `docs/lovable-ui-instructions.md`.

Its purpose is to keep backend delivery aligned with what Loveable needs to move from mockups into implementation.

## Immediate Goal

Provide stable backend concepts, contracts, and sample payloads early enough that Loveable can design around real system behavior instead of guessing.

## Backend Deliverables Loveable Needs First

### 1. Stable domain vocabulary

Codex must keep these concepts stable unless there is a strong reason to change them:

- `StoryRecord`
- `MaterialGenerationRequest`
- `GenerationArtifactEnvelope`
- artifact type enum
- prompt family identifiers
- template identifiers
- review states
- generation status states

If these change, update:

- `docs/api-contracts.md`
- `docs/backend-frontend-boundaries.md`
- `docs/main.md`

### 2. Example payloads

Loveable will need realistic example payloads for:

- story list item
- story detail record
- generation request
- generated artifact response
- review item
- status/error states

These should be added as committed fixtures once the first API shapes stabilize.

### 3. Status model

Codex should define the initial generation lifecycle clearly.

Recommended v0 statuses:

- `draft`
- `uploaded`
- `normalizing`
- `ready`
- `generation_queued`
- `generation_running`
- `generated`
- `needs_review`
- `approved`
- `failed`

Frontend mockups should use these or a clearly documented variation.

### 4. Artifact metadata contract

Every generated artifact should expose:

- artifact ID
- story ID
- artifact type
- schema version
- prompt family
- prompt version
- model
- template ID
- generated timestamp
- review state
- preview availability
- PDF availability

This metadata is not optional. It is required for trust, review, debugging, and operator visibility.

## Backend Work Order

Codex should build in this order:

### Step 1. Lock schema package

Add stable schemas for:

- story
- worksheet
- teacher notes
- artifact envelope
- generation status
- review state

This is the foundation for both backend and frontend.

### Step 2. Produce sample fixture payloads

Create fixtures for:

- one story
- one worksheet artifact
- one teacher notes artifact
- one failed artifact
- one needs-review artifact

These will unblock Loveable quickly.

### Step 3. Implement renderer contract

Codex should define:

- what preview HTML looks like
- how the frontend receives it
- what metadata accompanies it

Even before the final PDF renderer is complete, this preview contract should be stable.

### Step 4. Implement real prompt runner abstraction

Swap the static runner for a real OpenAI-backed runner without changing the frontend contract.

This is critical:

Frontend contracts should not depend on whether generation is static, mocked, or live.

### Step 5. Implement PDF rendering path

Backend should own:

- HTML print rendering
- PDF file generation
- PDF asset URLs or download handles

Frontend should only display the result.

## Things Codex Should Not Push Onto Loveable

Do not ask Loveable to:

- invent domain state enums
- decide artifact metadata shape
- infer generation states from loose strings
- construct final worksheet HTML
- define prompt family logic in UI

These are backend responsibilities.

## Proposed First Backend-to-Frontend Package

The first clean handoff to Loveable should include:

1. stable TypeScript types in `packages/schemas`
2. `docs/api-contracts.md` updated to match code
3. fixture JSON examples
4. one preview-ready worksheet artifact example
5. one sample teacher-notes artifact example

Once those exist, Loveable can safely start `apps/web`.

## Coordination Rules

When Codex changes a frontend-relevant contract, Codex should:

1. update code
2. update `docs/api-contracts.md`
3. add a log entry to `docs/main.md`
4. mark whether the change is breaking or non-breaking

## Immediate Next Recommended Backend Tasks

1. add status and review-state schemas
2. add API fixture files
3. add preview response schemas
4. add a first render script that produces worksheet HTML from a fixture
5. then begin real OpenAI integration
