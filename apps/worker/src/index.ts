import {
  createMaterialGenerationRequest,
  generationArtifactEnvelopeSchema,
  type GenerationArtifactEnvelope,
  type MaterialArtifactType,
  type StoryRecord
} from "@asad/schemas";
import { getPromptFamilyForArtifact, StaticPromptRunner, type PromptExecutionResult } from "@asad/prompts";
import { renderWorksheetHtml } from "@asad/renderer";

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

export async function generateArtifactFromStory(
  story: StoryRecord,
  artifactType: MaterialArtifactType
): Promise<GeneratedArtifact> {
  const promptFamily = getPromptFamilyForArtifact(artifactType);
  const runner = new StaticPromptRunner();
  const result = await runner.run({
    story,
    artifactType,
    promptFamily: promptFamily.key,
    promptVersion: "0.1.0",
    model: "static-runner"
  });

  const envelope = generationArtifactEnvelopeSchema.parse({
    storyId: story.storyId,
    artifactType,
    schemaVersion: "0.1.0",
    promptFamily: promptFamily.key,
    promptVersion: "0.1.0",
    model: "static-runner",
    generatedAt: new Date().toISOString()
  });

  const renderedHtml = result.artifactType === "worksheet" ? renderWorksheetHtml(result) : null;

  return {
    envelope,
    result,
    renderedHtml
  };
}
