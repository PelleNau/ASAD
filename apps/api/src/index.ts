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
  illustrationAssetId: "example-illustration",
  illustrationUrl:
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop stop-color='%230d1731'/%3E%3Cstop offset='1' stop-color='%23364b60'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' rx='18' fill='url(%23bg)'/%3E%3Ccircle cx='304' cy='60' r='22' fill='none' stroke='%23d9f3ff' stroke-width='8'/%3E%3Cpath d='M320 42a18 18 0 1 1-18 18' fill='%230d1731'/%3E%3Cellipse cx='228' cy='170' rx='118' ry='128' fill='rgba(194,228,239,0.28)' stroke='rgba(231,247,252,0.72)' stroke-width='6'/%3E%3Cpath d='M92 330L148 278L184 320L234 260L298 330Z' fill='%23202934'/%3E%3Cpath d='M160 200c26-30 44-48 74-56c-8 28-3 58 12 94c-41 4-72-8-86-38z' fill='%23d9dde2'/%3E%3Ccircle cx='177' cy='184' r='16' fill='%23d4aea0'/%3E%3Cpath d='M150 206h40v84h-40z' fill='%232f95ad'/%3E%3Cpath d='M143 205h54v18h-54z' fill='%23732f43'/%3E%3C/svg%3E",
  illustrationAlt: "Sagolik illustration for exempelberattelsen"
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
    renderedHtml:
      result.artifactType === "worksheet"
        ? renderWorksheetHtml(result, {
            story: storyRecord,
            variant: "worksheet"
          })
        : null
  };
}
