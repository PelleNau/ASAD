# API Contracts

Initial backend/frontend contract draft.

These are v0 contracts for alignment, not final production interfaces.

## Story

```ts
type StoryRecord = {
  storyId: string;
  sourceVersion: string;
  title: string;
  language: string;
  storyText: string;
  illustrationAssetId: string;
  illustrationUrl?: string | null;
  illustrationAlt?: string | null;
  targetAgeBand?: string | null;
  themes: string[];
  teachingHooks: string[];
};
```

## Create Story Request

```ts
type CreateStoryRequest = {
  title: string;
  language: string;
  storyText: string;
  illustrationFileName: string;
  illustrationUrl?: string | null;
  illustrationAlt?: string | null;
  targetAgeBand?: string | null;
  tags: string[];
};
```

## Generation Request

```ts
type MaterialArtifactType =
  | "worksheet"
  | "teacher_notes"
  | "vocabulary_sheet"
  | "discussion_guide"
  | "curriculum_alignment"
  | "answer_sheet";

type MaterialGenerationRequest = {
  storyId: string;
  artifactTypes: MaterialArtifactType[];
};
```

## Generation Envelope

```ts
type GenerationArtifactEnvelope = {
  storyId: string;
  artifactType: MaterialArtifactType;
  schemaVersion: string;
  promptFamily: string;
  promptVersion: string;
  model: string;
  generatedAt: string;
};
```

## Generated Artifact Response

```ts
type GeneratedArtifactResponse = {
  envelope: GenerationArtifactEnvelope;
  artifactId: string;
  title: string;
  status: GenerationStatus;
  reviewState: ReviewState;
  templateId: string;
  result: unknown;
  renderedHtml: string | null;
  previewUrl: string | null;
  pdfUrl: string | null;
  issues: string[];
};
```

## Status

```ts
type GenerationStatus =
  | "draft"
  | "uploaded"
  | "normalizing"
  | "ready"
  | "generation_queued"
  | "generation_running"
  | "generated"
  | "needs_review"
  | "approved"
  | "failed";

type ReviewState =
  | "not_required"
  | "pending_review"
  | "approved"
  | "rejected";
```

## Story List Item

```ts
type StoryListItem = {
  storyId: string;
  title: string;
  language: string;
  status: GenerationStatus;
  hasIllustration: boolean;
  artifactCounts: {
    total: number;
    approved: number;
    needsReview: number;
    failed: number;
  };
  updatedAt: string;
};
```

## Artifact Preview

```ts
type ArtifactPreview = {
  artifactId: string;
  artifactType: MaterialArtifactType;
  title: string;
  status: GenerationStatus;
  reviewState: ReviewState;
  templateId: string;
  hasRenderedHtml: boolean;
  hasPdf: boolean;
  previewUrl: string | null;
  pdfUrl: string | null;
};
```

## Initial Endpoints

These are recommended initial endpoints.

### `POST /stories`

Purpose:

- create a story record and upload illustration

Expected ingestion behavior:

- backend stores the uploaded asset
- backend resolves a renderable `illustrationUrl`
- backend stores optional `illustrationAlt` for print/accessibility use

### `GET /stories/:storyId`

Purpose:

- fetch normalized story metadata

### `POST /stories/:storyId/generate`

Purpose:

- request generation for one or more artifact types

### `GET /stories/:storyId/artifacts`

Purpose:

- list generated artifacts for a story

### `GET /artifacts/:artifactId`

Purpose:

- fetch one generated artifact and preview metadata

### `POST /artifacts/:artifactId/review`

Purpose:

- approve or reject generated artifact

## Notes For Loveable

Frontend should treat:

- `renderedHtml` as preview content only
- `result` as structured artifact data
- `envelope` as immutable generation metadata
- `status` and `reviewState` as first-class workflow indicators

Final PDF rendering remains backend-owned.
