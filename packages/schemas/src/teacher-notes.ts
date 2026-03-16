import { z } from "zod";

export const teacherNotesArtifactSchema = z.object({
  artifactType: z.literal("teacher_notes"),
  storyId: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  learningFocus: z.array(z.string()).default([]),
  beforeReading: z.array(z.string()).default([]),
  duringReading: z.array(z.string()).default([]),
  afterReading: z.array(z.string()).default([]),
  differentiation: z.object({
    support: z.array(z.string()).default([]),
    stretch: z.array(z.string()).default([])
  }),
  sensitiveTopics: z.array(z.string()).default([]),
  extensionActivities: z.array(z.string()).default([])
});

export type TeacherNotesArtifact = z.infer<typeof teacherNotesArtifactSchema>;
