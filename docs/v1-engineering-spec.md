# ASAD Teacher Support Material Generator

## V1 Engineering Specification

This document is the stricter engineering version of the system brief.

It is intended to convert the product direction into something that can be implemented, reviewed, and extended without ambiguity.

## 1. Purpose

The system generates structured teacher-support materials for each story in the A Story A Day platform.

Each story is the canonical source object.
Each generated deliverable is an artifact derived from that story through:

1. ingestion
2. normalization and metadata analysis
3. prompt-driven content generation
4. schema validation
5. deterministic template rendering
6. PDF export

The system must be modular, versioned, reviewable, and reproducible.

## 2. Core Principles

### 2.1 Story-first architecture

All downstream work starts from a canonical `Story` record.

### 2.2 Structured generation only

LLM outputs must be schema-valid structured data, not freeform final text blobs.

### 2.3 Templates own presentation

Generation logic produces content.
Templates and renderer own layout, typography, spacing, pagination, and print format.

### 2.4 Everything versioned

Every generated artifact must retain:

- story version
- prompt ID
- prompt version
- schema version
- template version
- model version
- generation timestamp

### 2.5 Review is part of the system

The platform must support automated validation and human review.
No assumption should be made that all outputs are safe to publish automatically.

## 3. Core Entities

### 3.1 Story

Canonical content object.

Required fields:

- `story_id`
- `source_version`
- `title`
- `language`
- `story_text`
- `word_count`
- `reading_level_estimate`
- `illustration_asset_id`
- `illustration_url`
- `illustration_alt`
- `themes[]`
- `genre`
- `narrative_structure`
- `emotional_tone`
- `target_age_band`
- `curriculum_tags[]`
- `processing_status`

### 3.2 Asset

Binary or static file associated with a story or artifact.

Required fields:

- `asset_id`
- `kind`
- `file_name`
- `media_type`
- `storage_path`
- `public_path`
- `render_url`
- `alt_text`

Initial supported asset kinds:

- `illustration`
- `pdf`
- `preview_image`

### 3.3 PromptDefinition

Versioned generation definition.

Required fields:

- `prompt_id`
- `version`
- `name`
- `description`
- `artifact_type`
- `language`
- `compliance_references[]`
- `expected_output_schema_id`
- `selection_rules`
- `status`

### 3.4 TemplateDefinition

Versioned rendering definition.

Required fields:

- `template_id`
- `version`
- `artifact_type`
- `layout_variant`
- `page_format`
- `design_tokens`
- `status`

### 3.5 Artifact

Generated deliverable linked to a story.

Required fields:

- `artifact_id`
- `story_id`
- `artifact_type`
- `status`
- `review_state`
- `schema_version`
- `prompt_id`
- `prompt_version`
- `template_id`
- `template_version`
- `model`
- `result_json`
- `rendered_html`
- `pdf_asset_id`
- `issues[]`
- `generated_at`

### 3.6 GenerationJob

Track async generation and rendering operations.

Required fields:

- `job_id`
- `story_id`
- `artifact_types[]`
- `status`
- `started_at`
- `completed_at`
- `error_message`

### 3.7 ReviewDecision

Track approval or rejection of generated artifacts.

Required fields:

- `review_id`
- `artifact_id`
- `action`
- `notes`
- `issue_category`
- `reviewed_at`
- `reviewed_by`

## 4. State Models

### 4.1 Story Status

Initial V1 story states:

- `draft`
- `uploaded`
- `normalizing`
- `ready`
- `failed`

### 4.2 Artifact Status

Initial V1 artifact states:

- `generation_queued`
- `generation_running`
- `generated`
- `needs_review`
- `approved`
- `failed`

### 4.3 Review State

Initial V1 review states:

- `not_required`
- `pending_review`
- `approved`
- `rejected`

## 5. Ingestion Layer

### Inputs

Each story requires:

- one story document
- one illustration image

Supported initial story inputs:

- structured text
- markdown
- docx-derived extracted text

Supported initial image inputs:

- png
- jpg
- webp
- svg

### Ingestion Requirements

The ingestion flow must:

1. accept paired upload
2. create a `Story`
3. create an `Asset` for the illustration
4. extract text and title
5. estimate word count
6. store raw assets
7. assign unique IDs
8. move the story into `uploaded`

Optional but recommended preprocessing:

- text normalization
- paragraph segmentation
- sentence segmentation
- reading level estimation

## 6. Story Analysis Layer

After ingestion, the system must create structured metadata attached to the story.

### Content Metadata

- themes
- genre
- narrative structure
- emotional tone

### Pedagogical Metadata

- reading level
- vocabulary complexity
- age suitability
- curriculum relevance

### System Metadata

- token count
- processing status
- analysis warnings

This metadata must be queryable for:

- search
- filtering
- prompt selection
- analytics

## 7. Prompt Library

The platform maintains a central prompt library.

Prompts are not just text strings.
They are versioned generation assets with compliance and output expectations.

### Prompt Requirements

Each prompt must define:

- purpose
- applicable artifact type
- expected output schema
- language
- compliance references
- story selection rules
- version

### Prompt Rules

- prompt updates should not invalidate historical artifacts
- prompt version must be stored with every output
- new prompt text may be added without code changes
- new artifact types usually require code changes

## 8. Deliverable Types

Initial V1 artifact types:

- `worksheet`
- `answer_sheet`
- `teacher_notes`
- `vocabulary_sheet`
- `discussion_guide`
- `curriculum_alignment`

### V1 Delivery Priority

MVP should prioritize:

1. worksheet
2. answer sheet
3. teacher notes

## 9. Output Schemas

Every artifact type must have a concrete schema.

Example principle:

- `worksheet` schema defines title, level, sections, questions, answer format
- `answer_sheet` may reuse worksheet shell but must support answer content
- `teacher_notes` defines before/during/after reading, differentiation, extension

No artifact type should exist in the system without:

- schema
- prompt mapping
- template mapping
- API exposure plan

## 10. Generation Controls

### 10.1 Presets

Preset = predefined bundle of artifact types.

Example:

- `standard_classroom_pack`
  - worksheet
  - answer_sheet
  - teacher_notes
  - vocabulary_sheet

### 10.2 Manual Selection

Users can request one or more artifact types directly.

Example:

- level 1 worksheet
- level 2 worksheet
- vocabulary sheet
- discussion guide

## 11. Backend Generation Pipeline

The generation flow must be:

1. load story
2. load metadata
3. choose prompt definitions
4. run LLM generation
5. validate schema
6. run automated checks
7. write artifact JSON
8. render HTML
9. render PDF
10. mark review status

## 12. Validation and Evaluation

There must be a validation layer between generation and rendering.

### Required checks

- schema validity
- missing required fields
- duplicate questions
- bad formatting
- unsupported answer format
- missing answer content for answer sheets
- curriculum coverage rules where applicable

### Optional but strongly recommended

- reading-level fit
- unsafe or low-quality output detection
- prompt regression checks

Outputs that fail validation should:

- not move directly to approved
- include issue messages
- move to `failed` or `needs_review`

## 13. Template System

Templates must be decoupled from generation logic.

### Template responsibilities

- page layout
- typography
- spacing
- header/footer
- logo placement
- illustration placement
- section ordering
- page breaks

### Renderer responsibilities

- convert artifact JSON to HTML
- convert HTML to PDF
- preserve A4 print format

## 14. PDF System

The export system must support:

- A4 output
- multi-page rendering
- header/footer consistency
- high-resolution illustration rendering
- page numbering
- section continuity

Initial renderer choice:

- HTML/CSS
- Playwright PDF export

## 15. Review Workflow

Review is a required system feature, not a future extra.

### Review operations

- approve artifact
- reject artifact
- attach notes
- attach issue category

### Review outcomes

- `approved`
- `rejected`
- `needs_review`

The system must preserve review notes alongside the artifact.

## 16. Search and Analytics

The platform should support:

- search by title
- search by theme
- filtering by reading level
- filtering by curriculum tags
- filtering by artifact availability

Future analytics should support:

- artifact generation counts
- curriculum coverage
- teacher usage patterns
- review rejection reasons

## 17. API Surface

Minimum V1 route families:

- `POST /stories`
- `GET /stories`
- `GET /stories/:storyId`
- `POST /stories/:storyId/generate`
- `GET /stories/:storyId/artifacts`
- `GET /artifacts/:artifactId`
- `POST /artifacts/:artifactId/review`
- `GET /assets/local/:fileName`

For local development, fixture-backed routes may exist first, but route shape should remain stable.

## 18. Scalability Rules

The system must support:

- multiple languages
- multiple prompt versions
- multiple templates per artifact type
- batch generation
- additional artifact types

However, the following clarification is required:

- new prompt text should usually not require code changes
- new schema-bearing artifact types usually do require controlled code changes

## 19. Non-Functional Requirements

The system must be:

- deterministic at rendering time
- reproducible at artifact level
- auditable through version linkage
- modular across ingestion, generation, rendering, and review
- safe for batch processing

## 20. Acceptance Criteria for V1

V1 is acceptable when all of the following are true:

1. A story plus illustration can be ingested into a canonical `Story`.
2. The system stores an illustration as a structured `Asset`.
3. The system can generate at least:
   - worksheet
   - answer sheet
   - teacher notes
4. Generated outputs validate against explicit schemas.
5. Generated outputs render through deterministic templates.
6. The system can export print-ready PDF output.
7. Artifacts retain prompt/template/model/version metadata.
8. Artifacts can be reviewed and approved/rejected.
9. Story and artifact data can be searched and filtered through metadata.
10. Local development supports end-to-end preview of:
    - story
    - illustration
    - worksheet
    - answer sheet

## 21. Recommended Immediate Build Order

1. story + asset ingestion
2. story metadata generation
3. worksheet schema and prompt path
4. answer-sheet schema and prompt path
5. teacher-notes path
6. template rendering
7. PDF export
8. review workflow
9. analytics and search refinement

## 22. Implementation Note

This specification is intentionally stricter than the original system brief.

The original brief is strong as a direction document.
This version adds the missing engineering constraints:

- explicit entities
- explicit states
- explicit versioning
- validation layer
- review flow
- acceptance criteria

These additions are necessary to make the platform reliable at scale.
