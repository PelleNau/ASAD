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
COREPACK_HOME="$PWD/.corepack-cache" corepack pnpm install
```

## 2. Run type checks

```bash
COREPACK_HOME="$PWD/.corepack-cache" corepack pnpm check
```

This should catch:

- schema import issues
- package export issues
- workspace dependency problems

## 3. Build the workspace

```bash
COREPACK_HOME="$PWD/.corepack-cache" corepack pnpm build
```

Expected output:

- `packages/*/dist`
- `apps/api/dist`
- `apps/worker/dist`

## 4. Generate backend-derived fixtures

```bash
ASAD_ROOT="$PWD" COREPACK_HOME="$PWD/.corepack-cache" corepack pnpm fixtures:generate
```

Generated outputs should appear in:

```text
fixtures/generated/
```

Local illustration assets used by the sample/dev path are written to:

```text
artifacts/assets/
```

## 5. Render a sample PDF

```bash
COREPACK_HOME="$PWD/.corepack-cache" corepack pnpm pdf:sample
```

Expected output:

- `artifacts/samples/sample-worksheet.pdf`

## 6. Probe local asset serving

```bash
ASAD_ROOT="$PWD" COREPACK_HOME="$PWD/.corepack-cache" corepack pnpm asset:probe
```

Expected output:

- JSON describing the local asset route result for the sample illustration

## 7. Run local API server

```bash
ASAD_ROOT="$PWD" COREPACK_HOME="$PWD/.corepack-cache" corepack pnpm api:start
```

Useful local URLs:

- `http://127.0.0.1:4312/health`
- `http://127.0.0.1:4312/stories`
- `http://127.0.0.1:4312/stories/example-story`
- `http://127.0.0.1:4312/stories/example-story/artifacts`
- `http://127.0.0.1:4312/artifacts/artifact-worksheet-beginner-v1`
- `http://127.0.0.1:4312/artifacts/artifact-answer-sheet-beginner-v1`

## Current Notes

- `apps/api` depends on `@asad/worker` for fixture generation helpers.
- package `exports` are now declared for all workspace packages and app packages that are imported by other code.
- workspace package entrypoints currently target emitted `dist/.../src/*` paths because TypeScript is compiling source across package boundaries.
- this repo still uses a static prompt runner. Real OpenAI integration is a later step.

## Expected Next Build Risks

Most likely next issues after install/build:

- package build layout cleanup once project references are introduced
- missing dependencies once real rendering or OpenAI clients are added
- PDF/runtime integration edge cases when Playwright is added
- Chromium launch permissions in restricted macOS/sandbox environments

## Rule

If the install/build sequence changes, update this document in the same change.
