import {
  createMaterialGenerationRequest,
  createStoryRecord,
  generationArtifactEnvelopeSchema,
  type StoryRecord
} from "@asad/schemas";
import { getPromptFamilyCatalog, getPromptFamilyForArtifact, createPromptRunner } from "@asad/prompts";
import { getTemplateCatalog, renderWorksheetHtml } from "@asad/renderer";

const story = createStoryRecord({
  storyId: "example-story",
  sourceVersion: "draft",
  title: "Example Story",
  language: "sv",
  storyText: "Detta ar en platshallare for den forsta historien.",
  illustrationAssetId: "example-illustration"
});

const request = createMaterialGenerationRequest({
  storyId: story.storyId,
  artifactTypes: ["worksheet", "teacher_notes"]
});

export const apiBootstrap = {
  story,
  request,
  promptFamilies: getPromptFamilyCatalog(),
  templates: getTemplateCatalog()
};

export async function generateWorksheetPreview(storyRecord: StoryRecord) {
  const artifactType = "worksheet";
  const promptFamily = getPromptFamilyForArtifact(artifactType);
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const runner = createPromptRunner({
    apiKey: process.env.OPENAI_API_KEY,
    model
  });
  const result = await runner.run({
    story: storyRecord,
    artifactType,
    promptFamily: promptFamily.key,
    promptVersion: "0.1.0",
    model
  });

  return {
    envelope: generationArtifactEnvelopeSchema.parse({
      storyId: storyRecord.storyId,
      artifactType,
      schemaVersion: "0.1.0",
      promptFamily: promptFamily.key,
      promptVersion: "0.1.0",
      model: process.env.OPENAI_API_KEY ? model : "static-runner",
      generatedAt: new Date().toISOString()
    }),
    result,
    renderedHtml: result.artifactType === "worksheet" ? renderWorksheetHtml(result) : null
  };
}
