# Fixtures

Backend-owned fixture payloads for frontend mockups, local API stubs, and contract review.

Loveable should use these fixtures as the first source of truth for mockups and mocked frontend implementation.

Generated API fixtures are also written to `fixtures/generated/` from backend code and should be treated as the runtime contract snapshots.

## Included Fixture Types

- story list items
- story detail records
- generated artifact responses
- review-needed artifact state
- failed artifact state
- generated API route snapshots in `fixtures/generated/`

## Rule

If backend contracts change, these fixtures must be updated in the same change.
