import { z } from "zod";

export const worksheetLevelSchema = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "MIXED",
  "CREATIVE"
]);

export const worksheetQuestionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  skillType: z.enum(["retrieval", "inference", "reflection", "discussion", "creative"]),
  answerFormat: z.enum(["short_text", "long_text", "oral", "drawing"]),
  teacherIntent: z.string().min(1),
  sampleAnswer: z.string().nullable().optional()
});

export const worksheetSectionSchema = z.object({
  type: z.enum(["questions", "reflection", "creative"]),
  heading: z.string().min(1),
  description: z.string().nullable().optional(),
  items: z.array(worksheetQuestionSchema).min(1)
});

export const worksheetArtifactSchema = z.object({
  artifactType: z.literal("worksheet"),
  storyId: z.string().min(1),
  level: worksheetLevelSchema,
  title: z.string().min(1),
  subtitle: z.string().min(1),
  studentInstructions: z.string().min(1),
  sections: z.array(worksheetSectionSchema).min(1),
  printNotes: z.object({
    showNameField: z.boolean().default(true),
    showDateField: z.boolean().default(true)
  })
});

export type WorksheetArtifact = z.infer<typeof worksheetArtifactSchema>;
