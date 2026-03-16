import {
  LOCAL_ASSET_PUBLIC_PREFIX,
  createExampleIllustrationSvg,
  createLocalAssetStore,
  readLocalAsset
} from "@asad/assets";
import {
  createMaterialGenerationRequest,
  createStoryRecord,
  generationArtifactEnvelopeSchema,
  type StoryRecord
} from "@asad/schemas";
import { getPromptFamilyCatalog, getPromptFamilyForArtifact, createPromptRunner } from "@asad/prompts";
import { getTemplateCatalog, renderWorksheetHtml } from "@asad/renderer";
import path from "node:path";

const workspaceRoot = path.resolve(process.env.ASAD_ROOT ?? process.cwd());
const assetStore = createLocalAssetStore({ rootDir: workspaceRoot });
const exampleIllustration = assetStore.storeIllustration({
  storyId: "example-story",
  originalFileName: "example-illustration.svg",
  svgMarkup: createExampleIllustrationSvg("Example Story"),
  altText: "Sagolik illustration for exempelberattelsen"
});

const story = createStoryRecord({
  storyId: "example-story",
  sourceVersion: "draft",
  title: "Example Story",
  language: "sv",
  storyText: "Detta ar en platshallare for den forsta historien.",
  illustrationAssetId: exampleIllustration.assetId,
  illustrationUrl: exampleIllustration.renderUrl,
  illustrationAlt: exampleIllustration.altText,
  illustrationAsset: exampleIllustration
});

const request = createMaterialGenerationRequest({
  storyId: story.storyId,
  artifactTypes: ["worksheet", "teacher_notes"]
});

export const apiBootstrap = {
  story,
  request,
  promptFamilies: getPromptFamilyCatalog(),
  templates: getTemplateCatalog(),
  assetPublicPrefix: LOCAL_ASSET_PUBLIC_PREFIX
};

export type AssetRouteResult = {
  status: 200 | 404 | 400;
  headers: Record<string, string>;
  body: Uint8Array | null;
  storagePath: string | null;
  publicPath: string;
};

export async function getLocalAssetRouteResult(publicPath: string): Promise<AssetRouteResult> {
  const asset = await readLocalAsset(workspaceRoot, publicPath);

  return {
    status: asset.status,
    headers:
      asset.status === 200 && asset.contentType
        ? {
            "content-type": asset.contentType,
            "cache-control": "public, max-age=3600"
          }
        : {},
    body: asset.body,
    storagePath: asset.storagePath,
    publicPath: asset.publicPath
  };
}

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
