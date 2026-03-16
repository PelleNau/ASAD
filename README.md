# ASAD

Teacher-support material generation pipeline for A Story A Day.

## Goal

Ingest stories plus one illustration per story, generate structured teacher-support materials, and render print-ready PDFs that match the ASAD worksheet design system.

The system is designed to produce:

- differentiated worksheets
- vocabulary sheets
- discussion guides
- teacher notes
- curriculum alignment summaries
- printable answer sheets

## Product Shape

The platform should treat content generation and PDF rendering as separate concerns:

1. Ingest and normalize story inputs.
2. Convert each story into a canonical semantic JSON record.
3. Generate multiple teaching artifacts from that canonical record using versioned prompt families.
4. Render PDFs from deterministic HTML/CSS templates.
5. Evaluate outputs and send weak generations to review.

## Prompt Families

The initial prompt families are:

- `ASAD_SAGA_MATERIAL_GENERATOR`
- `ASAD_WORKSHEET_FORMAT_STANDARD`
- `ASAD_PRINTABLE_PDF_LAYOUT`
- `ASAD_LEVEL_DIFFERENTIATION`
- `ASAD_VOCABULARY_EXTRACTOR`
- `ASAD_DISCUSSION_GUIDE`
- `ASAD_TEACHER_NOTES_GENERATOR`
- `ASAD_CURRICULUM_ALIGNMENT`

These should be implemented as versioned generators with strict input and output schemas, not as ad hoc prompt strings embedded in rendering code.

## Recommended Stack

- App/API: TypeScript
- Database: Postgres
- Asset storage: S3 or Cloudflare R2
- Queue/workflows: BullMQ for MVP, Temporal if workflow complexity grows
- Generation: OpenAI Responses API with Structured Outputs
- Batch/backfill jobs: OpenAI Batch API
- PDF rendering: HTML/CSS templates rendered with Playwright PDF
- Review UI: internal web app backed by artifact JSON and PDF previews

## Core Principle

Do not let the model generate final layout.

The model should generate structured content blocks. Layout should be deterministic and code-driven so the PDFs remain stable, brand-consistent, and easy to iterate.

## Docs

- [Architecture](/Users/pellenaucler/Documents/CodexProjekt/ASAD/docs/architecture.md)
- [Schemas And Pipeline](/Users/pellenaucler/Documents/CodexProjekt/ASAD/docs/schemas-and-pipeline.md)
