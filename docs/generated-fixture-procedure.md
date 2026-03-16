# Generated Fixture Procedure

This document explains how backend-generated fixtures should work.

## Goal

The hand-written fixture files in `fixtures/` are useful for initial mockups, but the long-term goal is to generate contract-aligned fixture payloads directly from backend code.

That prevents drift between:

- schema package
- worker/API behavior
- frontend mock data

## Script

The root script is:

```bash
COREPACK_HOME="$PWD/.corepack-cache" corepack pnpm fixtures:generate
```

## Output

Generated files are written to:

```text
fixtures/generated/
```

## What gets generated

- story list response
- story detail response
- create story response
- generation accepted response
- artifact list response
- artifact detail response

## Current limitation

The script depends on built backend code in `apps/api/dist`.

That means the intended sequence is:

1. install dependencies
2. build packages/apps
3. run `pnpm fixtures:generate`

If `OPENAI_API_KEY` is not configured, the script uses the static runner fallback. That keeps the generated snapshots stable for frontend mockups and contract review.

## Why this matters

Loveable should eventually use generated fixtures as the safest mock source, because they are derived from backend-owned contracts instead of manually maintained JSON only.

## Current recommendation

Until dependencies are installed and the build is running, Loveable should use:

- `fixtures/*.json`

After the build pipeline is live, switch frontend mock usage toward:

- `fixtures/generated/*.json`
