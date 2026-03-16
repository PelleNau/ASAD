import {
  createMaterialGenerationRequest,
  generationArtifactEnvelopeSchema,
  type GenerationArtifactEnvelope,
  type MaterialArtifactType,
  type StoryRecord
} from "@asad/schemas";
import { createPromptRunner, getPromptFamilyForArtifact, type PromptExecutionResult } from "@asad/prompts";
import { renderTeacherNotesHtml, renderWorksheetHtml } from "@asad/renderer";

export type GenerationJobPlan = {
  storyId: string;
  artifactType: MaterialArtifactType;
  promptFamily: string;
};

export function planGenerationJobs(storyId: string, artifactTypes: MaterialArtifactType[]): GenerationJobPlan[] {
  const request = createMaterialGenerationRequest({
    storyId,
    artifactTypes
  });

  return request.artifactTypes.map((artifactType) => ({
    storyId: request.storyId,
    artifactType,
    promptFamily: getPromptFamilyForArtifact(artifactType).key
  }));
}

export type GeneratedArtifact = {
  envelope: GenerationArtifactEnvelope;
  result: PromptExecutionResult;
  renderedHtml: string | null;
};

export type GenerationRuntimeOptions = {
  apiKey?: string;
  model?: string;
};

export async function generateArtifactFromStory(
  story: StoryRecord,
  artifactType: MaterialArtifactType,
  options: GenerationRuntimeOptions = {}
): Promise<GeneratedArtifact> {
  const promptFamily = getPromptFamilyForArtifact(artifactType);
  const runner = createPromptRunner({
    apiKey: options.apiKey ?? process.env.OPENAI_API_KEY,
    model: options.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini"
  });
  const model = options.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const result = await runner.run({
    story,
    artifactType,
    promptFamily: promptFamily.key,
    promptVersion: "0.1.0",
    model
  });

  const envelope = generationArtifactEnvelopeSchema.parse({
    storyId: story.storyId,
    artifactType,
    schemaVersion: "0.1.0",
    promptFamily: promptFamily.key,
    promptVersion: "0.1.0",
    model: options.apiKey ?? process.env.OPENAI_API_KEY ? model : "static-runner",
    generatedAt: new Date().toISOString()
  });

  const renderedHtml =
    result.artifactType === "worksheet"
      ? renderWorksheetHtml(result, {
          story,
          variant: artifactType === "answer_sheet" ? "answer_sheet" : "worksheet"
        })
      : result.artifactType === "teacher_notes"
        ? renderTeacherNotesHtml(result, { story })
        : null;

  return {
    envelope,
    result,
    renderedHtml
  };
}
