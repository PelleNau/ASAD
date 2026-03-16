import {
  artifactDetailResponseSchema,
  artifactListResponseSchema,
  createStoryResponseSchema,
  generationAcceptedResponseSchema,
  storyDetailResponseSchema,
  storyListResponseSchema,
  type ArtifactDetailResponse,
  type ArtifactListResponse,
  type CreateStoryResponse,
  type GenerationAcceptedResponse,
  type StoryDetailResponse,
  type StoryListResponse
} from "@asad/schemas";
import { generateArtifactFromStory } from "@asad/worker";
import { apiBootstrap } from "./index.js";

export async function buildStoryListFixture(): Promise<StoryListResponse> {
  return storyListResponseSchema.parse({
    items: [
      {
        storyId: apiBootstrap.story.storyId,
        title: apiBootstrap.story.title,
        language: apiBootstrap.story.language,
        status: "needs_review",
        hasIllustration: true,
        artifactCounts: {
          total: 4,
          approved: 2,
          needsReview: 1,
          failed: 1
        },
        updatedAt: "2026-03-16T15:05:00.000Z"
      }
    ]
  });
}

export async function buildStoryDetailFixture(): Promise<StoryDetailResponse> {
  const worksheet = await generateArtifactFromStory(apiBootstrap.story, "worksheet");
  const answerSheet = await generateArtifactFromStory(apiBootstrap.story, "answer_sheet");

  return storyDetailResponseSchema.parse({
    story: apiBootstrap.story,
    artifacts: [
      {
        artifactId: "artifact-worksheet-beginner-v1",
        artifactType: "worksheet",
        title: worksheet.result.title,
        status: "generated",
        reviewState: "not_required",
        templateId: "worksheet-standard-v1",
        hasRenderedHtml: true,
        hasPdf: false,
        previewUrl: null,
        pdfUrl: null
      },
      {
        artifactId: "artifact-answer-sheet-beginner-v1",
        artifactType: "answer_sheet",
        title: answerSheet.result.title,
        status: "generated",
        reviewState: "not_required",
        templateId: "answer-sheet-standard-v1",
        hasRenderedHtml: true,
        hasPdf: false,
        previewUrl: null,
        pdfUrl: null
      }
    ]
  });
}

export async function buildCreateStoryFixture(): Promise<CreateStoryResponse> {
  return createStoryResponseSchema.parse({
    story: {
      ...apiBootstrap.story,
      illustrationUrl: apiBootstrap.story.illustrationUrl,
      illustrationAlt: apiBootstrap.story.illustrationAlt
    },
    status: "uploaded",
    validationErrors: []
  });
}

export async function buildGenerationAcceptedFixture(): Promise<GenerationAcceptedResponse> {
  return generationAcceptedResponseSchema.parse({
    jobId: "job-story-example-001",
    storyId: apiBootstrap.story.storyId,
    artifactTypes: ["worksheet", "answer_sheet", "teacher_notes"],
    status: "generation_queued"
  });
}

export async function buildArtifactListFixture(): Promise<ArtifactListResponse> {
  const worksheet = await generateArtifactFromStory(apiBootstrap.story, "worksheet");
  const answerSheet = await generateArtifactFromStory(apiBootstrap.story, "answer_sheet");
  const teacherNotes = await generateArtifactFromStory(apiBootstrap.story, "teacher_notes");

  return artifactListResponseSchema.parse({
    storyId: apiBootstrap.story.storyId,
    items: [
      {
        artifactId: "artifact-worksheet-beginner-v1",
        artifactType: "worksheet",
        title: worksheet.result.title,
        status: "generated",
        reviewState: "not_required",
        templateId: "worksheet-standard-v1",
        hasRenderedHtml: true,
        hasPdf: false,
        previewUrl: null,
        pdfUrl: null
      },
      {
        artifactId: "artifact-answer-sheet-beginner-v1",
        artifactType: "answer_sheet",
        title: answerSheet.result.title,
        status: "generated",
        reviewState: "not_required",
        templateId: "answer-sheet-standard-v1",
        hasRenderedHtml: true,
        hasPdf: false,
        previewUrl: null,
        pdfUrl: null
      },
      {
        artifactId: "artifact-teacher-notes-v1",
        artifactType: "teacher_notes",
        title: teacherNotes.result.title,
        status: "approved",
        reviewState: "approved",
        templateId: "teacher-notes-v1",
        hasRenderedHtml: false,
        hasPdf: true,
        previewUrl: "https://example.com/previews/artifact-teacher-notes-v1",
        pdfUrl: "https://example.com/pdfs/artifact-teacher-notes-v1.pdf"
      }
    ]
  });
}

export async function buildArtifactDetailFixture(): Promise<ArtifactDetailResponse> {
  const worksheet = await generateArtifactFromStory(apiBootstrap.story, "worksheet");

  return artifactDetailResponseSchema.parse({
    envelope: worksheet.envelope,
    artifactId: "artifact-worksheet-beginner-v1",
    title: worksheet.result.title,
    status: "generated",
    reviewState: "not_required",
    templateId: "worksheet-standard-v1",
    result: worksheet.result,
    renderedHtml: worksheet.renderedHtml,
    previewUrl: null,
    pdfUrl: null,
    issues: []
  });
}

export async function buildAnswerSheetDetailFixture(): Promise<ArtifactDetailResponse> {
  const answerSheet = await generateArtifactFromStory(apiBootstrap.story, "answer_sheet");

  return artifactDetailResponseSchema.parse({
    envelope: answerSheet.envelope,
    artifactId: "artifact-answer-sheet-beginner-v1",
    title: answerSheet.result.title,
    status: "generated",
    reviewState: "not_required",
    templateId: "answer-sheet-standard-v1",
    result: answerSheet.result,
    renderedHtml: answerSheet.renderedHtml,
    previewUrl: null,
    pdfUrl: null,
    issues: []
  });
}
