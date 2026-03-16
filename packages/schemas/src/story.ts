import { z } from "zod";
import { assetRecordSchema } from "./asset.js";

export const storyRecordSchema = z.object({
  storyId: z.string().min(1),
  sourceVersion: z.string().min(1),
  title: z.string().min(1),
  language: z.string().min(2),
  storyText: z.string().min(1),
  illustrationAssetId: z.string().min(1),
  illustrationUrl: z.string().min(1).nullable().optional(),
  illustrationAlt: z.string().min(1).nullable().optional(),
  illustrationAsset: assetRecordSchema.optional(),
  targetAgeBand: z.string().nullable().optional(),
  themes: z.array(z.string()).default([]),
  teachingHooks: z.array(z.string()).default([])
});

export type StoryRecord = z.infer<typeof storyRecordSchema>;

export function createStoryRecord(input: z.input<typeof storyRecordSchema>): StoryRecord {
  return storyRecordSchema.parse(input);
}
