# Schemas And Pipeline

## Canonical Story Schema

This is the source of truth for downstream generation.

```json
{
  "story_id": "uuid",
  "source_version": "sha256",
  "title": "string",
  "language": "sv",
  "story_text": "string",
  "illustration_asset_id": "uuid",
  "target_age_band": "string | null",
  "themes": ["string"],
  "characters": [
    {
      "name": "string",
      "role": "string",
      "traits": ["string"]
    }
  ],
  "setting": {
    "time": "string | null",
    "place": "string | null"
  },
  "plot_points": [
    {
      "order": 1,
      "summary": "string"
    }
  ],
  "emotional_arc": [
    {
      "stage": "string",
      "emotion": "string",
      "evidence": "string"
    }
  ],
  "key_vocabulary_candidates": [
    {
      "word": "string",
      "context": "string"
    }
  ],
  "sensitive_topics": ["string"],
  "teaching_hooks": ["string"],
  "normalization_confidence": 0.0
}
```

## Worksheet Schema

This should be emitted by `ASAD_WORKSHEET_FORMAT_STANDARD` and `ASAD_LEVEL_DIFFERENTIATION`.

```json
{
  "artifact_type": "worksheet",
  "story_id": "uuid",
  "level": "BEGINNER | INTERMEDIATE | ADVANCED | MIXED | CREATIVE",
  "title": "string",
  "subtitle": "string",
  "student_instructions": "string",
  "sections": [
    {
      "type": "questions | reflection | creative",
      "heading": "string",
      "description": "string | null",
      "items": [
        {
          "id": "string",
          "prompt": "string",
          "skill_type": "retrieval | inference | reflection | discussion | creative",
          "answer_format": "short_text | long_text | oral | drawing",
          "teacher_intent": "string"
        }
      ]
    }
  ],
  "print_notes": {
    "show_name_field": true,
    "show_date_field": true
  }
}
```

## Vocabulary Sheet Schema

```json
{
  "artifact_type": "vocabulary_sheet",
  "story_id": "uuid",
  "title": "string",
  "words": [
    {
      "word": "string",
      "part_of_speech": "string | null",
      "student_friendly_definition": "string",
      "story_context": "string",
      "teaching_reason": "string",
      "difficulty": "low | medium | high"
    }
  ]
}
```

## Discussion Guide Schema

```json
{
  "artifact_type": "discussion_guide",
  "story_id": "uuid",
  "title": "string",
  "lesson_goal": "string",
  "prompts": [
    {
      "id": "string",
      "prompt": "string",
      "purpose": "string",
      "follow_ups": ["string"],
      "mode": "pair | small_group | class"
    }
  ],
  "sentence_starters": ["string"]
}
```

## Teacher Notes Schema

```json
{
  "artifact_type": "teacher_notes",
  "story_id": "uuid",
  "title": "string",
  "summary": "string",
  "learning_focus": ["string"],
  "before_reading": ["string"],
  "during_reading": ["string"],
  "after_reading": ["string"],
  "differentiation": {
    "support": ["string"],
    "stretch": ["string"]
  },
  "sensitive_topics": ["string"],
  "extension_activities": ["string"]
}
```

## Curriculum Alignment Schema

```json
{
  "artifact_type": "curriculum_alignment",
  "story_id": "uuid",
  "curriculum_framework": "string",
  "alignments": [
    {
      "target_id": "string",
      "target_label": "string",
      "rationale": "string",
      "evidence": ["string"],
      "confidence": 0.0
    }
  ]
}
```

## Orchestration Pipeline

## Input

- story text
- title
- illustration
- optional metadata
- selected task options

## Job sequence

```text
ingest_story
  -> normalize_story
  -> generate_base_plan
  -> generate_requested_artifacts
  -> validate_json
  -> run_quality_evals
  -> review_if_needed
  -> render_html
  -> render_pdf
  -> publish_outputs
```

## Generation Rules

### Rule 1

Every generator consumes canonical story JSON, never raw story text directly, unless explicitly needed for evidence extraction.

### Rule 2

Every generator emits JSON that validates before rendering starts.

### Rule 3

Every rendered PDF is built from a template and a layout manifest, not from model-generated HTML.

### Rule 4

Every output stores prompt version, layout version, schema version, and source story version.

## Template Model

The renderer should accept:

```json
{
  "template_id": "worksheet_standard_v1",
  "layout_version": "1.0.0",
  "design_tokens": {
    "font_heading": "TiemposHeadline",
    "font_body": "Roboto",
    "color_background": "#e9e4e3",
    "color_primary": "#e2591a"
  },
  "content_blocks": []
}
```

The template engine maps semantic blocks to fixed visual slots.

Examples:

- story heading
- worksheet badge
- intro copy
- numbered question list
- footer with licensing or metadata

## Evaluation Checks

Minimum automated checks:

- JSON schema validity
- no duplicate questions
- question count within template limits
- level differentiation consistency
- vocabulary terms actually appear in the story or are directly inferable
- curriculum alignments include rationale
- answer sheet questions map to worksheet question IDs
- text length fits available print space thresholds

## Review Triggers

Send output to review when:

- schema passes but confidence is low
- curriculum alignment confidence falls below threshold
- layout overflow is detected
- generated question quality heuristics fail
- sensitive topics are detected

## Suggested Next Implementation Files

When build work starts, create:

```text
packages/schemas/src/story.ts
packages/schemas/src/worksheet.ts
packages/schemas/src/teacher-notes.ts
packages/prompts/src/families.ts
packages/renderer/src/templates/worksheet-standard.ts
packages/renderer/src/playwright/render-pdf.ts
apps/worker/src/jobs/generate-artifact.ts
apps/api/src/routes/stories.ts
```

## MVP Definition

The MVP is complete when the system can:

1. accept a story and illustration
2. generate Level 1 worksheet JSON
3. generate Level 2 worksheet JSON
4. generate Mixed worksheet JSON
5. generate Teacher Notes JSON
6. render all four outputs as printable PDFs
7. store outputs with version metadata
