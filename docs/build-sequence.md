# Build Sequence

This document defines the intended install/build order for the current ASAD monorepo.

## Goal

Get the workspace into a state where:

- package imports resolve correctly
- apps compile against workspace packages
- generated fixture scripts can run from built output

## Required Steps

### 1. Install dependencies

From the repo root:

```bash
pnpm install
```

## 2. Run type checks

```bash
pnpm check
```

This should catch:

- schema import issues
- package export issues
- workspace dependency problems

## 3. Build the workspace

```bash
pnpm build
```

Expected output:

- `packages/*/dist`
- `apps/api/dist`
- `apps/worker/dist`

## 4. Generate backend-derived fixtures

```bash
pnpm fixtures:generate
```

Generated outputs should appear in:

```text
fixtures/generated/
```

## Current Notes

- `apps/api` depends on `@asad/worker` for fixture generation helpers.
- package `exports` are now declared for all workspace packages and app packages that are imported by other code.
- this repo still uses a static prompt runner. Real OpenAI integration is a later step.

## Expected Next Build Risks

Most likely first issues after install/build:

- TypeScript module resolution edge cases
- ESM runtime path issues in the fixture script
- missing dependencies once real rendering or OpenAI clients are added

## Rule

If the install/build sequence changes, update this document in the same change.
