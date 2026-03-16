# Fixtures For Loveable

These fixture files are the first backend handoff package for frontend work.

## Files

- [story-list.json](/Users/pellenaucler/Documents/CodexProjekt/ASAD/fixtures/story-list.json)
- [story-detail.json](/Users/pellenaucler/Documents/CodexProjekt/ASAD/fixtures/story-detail.json)
- [artifact-worksheet-generated.json](/Users/pellenaucler/Documents/CodexProjekt/ASAD/fixtures/artifact-worksheet-generated.json)
- [artifact-worksheet-needs-review.json](/Users/pellenaucler/Documents/CodexProjekt/ASAD/fixtures/artifact-worksheet-needs-review.json)
- [artifact-teacher-notes-approved.json](/Users/pellenaucler/Documents/CodexProjekt/ASAD/fixtures/artifact-teacher-notes-approved.json)
- [artifact-failed.json](/Users/pellenaucler/Documents/CodexProjekt/ASAD/fixtures/artifact-failed.json)

## Intended Use

Loveable should use these fixtures for:

- story library mockups
- story workspace mockups
- generation-state UI
- review-state UI
- failure-state UI

## Notes

- `renderedHtml` can be used as a preview placeholder for mockups.
- `previewUrl` and `pdfUrl` are optional and intentionally mixed across fixture states.
- the frontend should not assume every artifact has a PDF immediately.
- the frontend should always surface `status`, `reviewState`, `artifactType`, and generation metadata.

## Expected UI States Covered

- draft story
- generated artifact
- needs review artifact
- approved artifact
- failed artifact

## Backend Rule

If schema or response contracts change, update the fixture files in the same change.
