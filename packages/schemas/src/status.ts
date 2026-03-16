import { z } from "zod";
import { generationArtifactEnvelopeSchema, materialArtifactTypeSchema } from "./material-request.js";

const routeOrUrlSchema = z.union([z.string().url(), z.string().regex(/^\//)]);

export const generationStatusSchema = z.enum([
  "draft",
  "uploaded",
  "normalizing",
  "ready",
  "generation_queued",
  "generation_running",
  "generated",
  "needs_review",
  "approved",
  "failed"
]);

export type GenerationStatus = z.infer<typeof generationStatusSchema>;

export const reviewStateSchema = z.enum([
  "not_required",
  "pending_review",
  "approved",
  "rejected"
]);

export type ReviewState = z.infer<typeof reviewStateSchema>;

export const storyListItemSchema = z.object({
  storyId: z.string().min(1),
  title: z.string().min(1),
  language: z.string().min(2),
  status: generationStatusSchema,
  hasIllustration: z.boolean(),
  artifactCounts: z.object({
    total: z.number().int().nonnegative(),
    approved: z.number().int().nonnegative(),
    needsReview: z.number().int().nonnegative(),
    failed: z.number().int().nonnegative()
  }),
  updatedAt: z.string().datetime()
});

export type StoryListItem = z.infer<typeof storyListItemSchema>;

export const artifactPreviewSchema = z.object({
  artifactId: z.string().min(1),
  artifactType: materialArtifactTypeSchema,
  title: z.string().min(1),
  status: generationStatusSchema,
  reviewState: reviewStateSchema,
  templateId: z.string().min(1),
  hasRenderedHtml: z.boolean(),
  hasPdf: z.boolean(),
  previewUrl: routeOrUrlSchema.nullable(),
  pdfUrl: routeOrUrlSchema.nullable()
});

export type ArtifactPreview = z.infer<typeof artifactPreviewSchema>;

export const generatedArtifactResponseSchema = z.object({
  envelope: generationArtifactEnvelopeSchema,
  artifactId: z.string().min(1),
  title: z.string().min(1),
  status: generationStatusSchema,
  reviewState: reviewStateSchema,
  templateId: z.string().min(1),
  result: z.unknown(),
  renderedHtml: z.string().nullable(),
  previewUrl: routeOrUrlSchema.nullable(),
  pdfUrl: routeOrUrlSchema.nullable(),
  issues: z.array(z.string()).default([])
});

export type GeneratedArtifactResponse = z.infer<typeof generatedArtifactResponseSchema>;
