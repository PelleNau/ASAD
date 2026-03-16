import { z } from "zod";
import { materialGenerationRequestSchema } from "./material-request.js";
import {
  artifactPreviewSchema,
  generatedArtifactResponseSchema,
  storyListItemSchema
} from "./status.js";
import { storyRecordSchema } from "./story.js";

export const createStoryRequestSchema = z.object({
  title: z.string().min(1),
  language: z.string().min(2),
  storyText: z.string().min(1),
  illustrationFileName: z.string().min(1),
  illustrationUrl: z.string().min(1).nullable().optional(),
  illustrationAlt: z.string().min(1).nullable().optional(),
  targetAgeBand: z.string().nullable().optional(),
  tags: z.array(z.string()).default([])
});

export type CreateStoryRequest = z.infer<typeof createStoryRequestSchema>;

export const createStoryResponseSchema = z.object({
  story: storyRecordSchema,
  status: z.literal("uploaded"),
  validationErrors: z.array(z.string()).default([])
});

export type CreateStoryResponse = z.infer<typeof createStoryResponseSchema>;

export const storyListResponseSchema = z.object({
  items: z.array(storyListItemSchema)
});

export type StoryListResponse = z.infer<typeof storyListResponseSchema>;

export const storyDetailResponseSchema = z.object({
  story: storyRecordSchema,
  artifacts: z.array(artifactPreviewSchema)
});

export type StoryDetailResponse = z.infer<typeof storyDetailResponseSchema>;

export const generationRequestSchema = materialGenerationRequestSchema;
export type GenerationRequest = z.infer<typeof generationRequestSchema>;

export const generationAcceptedResponseSchema = z.object({
  jobId: z.string().min(1),
  storyId: z.string().min(1),
  artifactTypes: z.array(z.string()).min(1),
  status: z.enum(["generation_queued", "generation_running"])
});

export type GenerationAcceptedResponse = z.infer<typeof generationAcceptedResponseSchema>;

export const artifactListResponseSchema = z.object({
  storyId: z.string().min(1),
  items: z.array(artifactPreviewSchema)
});

export type ArtifactListResponse = z.infer<typeof artifactListResponseSchema>;

export const artifactDetailResponseSchema = generatedArtifactResponseSchema;
export type ArtifactDetailResponse = z.infer<typeof artifactDetailResponseSchema>;

export const reviewArtifactRequestSchema = z.object({
  action: z.enum(["approve", "reject"]),
  notes: z.string().default(""),
  issueCategory: z.string().nullable().optional()
});

export type ReviewArtifactRequest = z.infer<typeof reviewArtifactRequestSchema>;

export const reviewArtifactResponseSchema = z.object({
  artifactId: z.string().min(1),
  reviewState: z.enum(["approved", "rejected"]),
  updatedAt: z.string().datetime()
});

export type ReviewArtifactResponse = z.infer<typeof reviewArtifactResponseSchema>;
