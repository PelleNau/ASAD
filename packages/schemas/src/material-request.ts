import { z } from "zod";

export const materialArtifactTypeSchema = z.enum([
  "worksheet",
  "teacher_notes",
  "vocabulary_sheet",
  "discussion_guide",
  "curriculum_alignment",
  "answer_sheet"
]);

export type MaterialArtifactType = z.infer<typeof materialArtifactTypeSchema>;

export const materialGenerationRequestSchema = z.object({
  storyId: z.string().min(1),
  artifactTypes: z.array(materialArtifactTypeSchema).min(1)
});

export type MaterialGenerationRequest = z.infer<typeof materialGenerationRequestSchema>;

export function createMaterialGenerationRequest(
  input: z.input<typeof materialGenerationRequestSchema>
): MaterialGenerationRequest {
  return materialGenerationRequestSchema.parse(input);
}

export const generationArtifactEnvelopeSchema = z.object({
  storyId: z.string().min(1),
  artifactType: materialArtifactTypeSchema,
  schemaVersion: z.string().min(1),
  promptFamily: z.string().min(1),
  promptVersion: z.string().min(1),
  model: z.string().min(1),
  generatedAt: z.string().datetime()
});

export type GenerationArtifactEnvelope = z.infer<typeof generationArtifactEnvelopeSchema>;
