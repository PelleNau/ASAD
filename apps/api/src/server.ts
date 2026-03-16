import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  generationAcceptedResponseSchema,
  generationRequestSchema,
  reviewArtifactRequestSchema,
  reviewArtifactResponseSchema,
  storyDetailResponseSchema,
  storyListResponseSchema,
  type ArtifactDetailResponse,
  type ArtifactPreview,
  type GenerationStatus,
  type MaterialArtifactType,
  type ReviewState,
  type StoryRecord
} from "@asad/schemas";
import {
  buildAnswerSheetDetailFixture,
  buildArtifactDetailFixture,
  buildArtifactListFixture,
  buildCreateStoryFixture,
  buildStoryDetailFixture,
  buildStoryListFixture,
  buildTeacherNotesDetailFixture
} from "./fixtures.js";
import { getLocalAssetRouteResult } from "./index.js";

const publicDir = path.resolve(process.env.ASAD_ROOT ?? process.cwd(), "public");

function sendJson(response: ServerResponse, statusCode: number, payload: unknown): void {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8"
  });
  response.end(`${JSON.stringify(payload, null, 2)}\n`);
}

function sendBytes(
  response: ServerResponse,
  statusCode: number,
  headers: Record<string, string>,
  body: Uint8Array | null
): void {
  response.writeHead(statusCode, headers);
  response.end(body ? Buffer.from(body) : undefined);
}

async function readJsonBody<T>(request: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return (raw.length === 0 ? {} : JSON.parse(raw)) as T;
}

type DevServerState = {
  story: StoryRecord;
  artifacts: Map<string, ArtifactDetailResponse>;
};

async function createInitialState(): Promise<DevServerState> {
  const storyDetail = await buildStoryDetailFixture();
  const worksheet = await buildArtifactDetailFixture();
  const answerSheet = await buildAnswerSheetDetailFixture();
  const teacherNotes = await buildTeacherNotesDetailFixture();

  return {
    story: storyDetail.story,
    artifacts: new Map([
      [worksheet.artifactId, worksheet],
      [answerSheet.artifactId, answerSheet],
      [teacherNotes.artifactId, teacherNotes]
    ])
  };
}

function getArtifactStatusCounts(artifacts: ArtifactPreview[]) {
  return {
    total: artifacts.length,
    approved: artifacts.filter((artifact) => artifact.reviewState === "approved").length,
    needsReview: artifacts.filter((artifact) => artifact.reviewState === "pending_review").length,
    failed: artifacts.filter((artifact) => artifact.status === "failed").length
  };
}

function getStoryStatus(artifacts: ArtifactPreview[]): GenerationStatus {
  if (artifacts.some((artifact) => artifact.status === "generation_running")) {
    return "generation_running";
  }

  if (artifacts.some((artifact) => artifact.status === "generation_queued")) {
    return "generation_queued";
  }

  if (artifacts.some((artifact) => artifact.reviewState === "pending_review")) {
    return "needs_review";
  }

  if (artifacts.some((artifact) => artifact.reviewState === "approved")) {
    return "approved";
  }

  return "generated";
}

function createArtifactPreview(artifact: ArtifactDetailResponse): ArtifactPreview {
  return {
    artifactId: artifact.artifactId,
    artifactType: artifact.envelope.artifactType,
    title: artifact.title,
    status: artifact.status,
    reviewState: artifact.reviewState,
    templateId: artifact.templateId,
    hasRenderedHtml: artifact.renderedHtml !== null,
    hasPdf: artifact.pdfUrl !== null,
    previewUrl: artifact.previewUrl,
    pdfUrl: artifact.pdfUrl
  };
}

function getArtifactIdForType(artifactType: MaterialArtifactType): string {
  switch (artifactType) {
    case "worksheet":
      return "artifact-worksheet-beginner-v1";
    case "answer_sheet":
      return "artifact-answer-sheet-beginner-v1";
    case "teacher_notes":
      return "artifact-teacher-notes-v1";
    default:
      throw new Error(`Dev server does not yet map artifact type ${artifactType} to a fixture artifact ID`);
  }
}

function attachArtifactPreviewUrl(artifact: ArtifactDetailResponse): ArtifactDetailResponse {
  return {
    ...artifact,
    previewUrl: artifact.renderedHtml ? `/artifacts/${artifact.artifactId}/preview` : artifact.previewUrl
  };
}

function createStoryDetailPayload(state: DevServerState) {
  const artifacts = Array.from(state.artifacts.values()).map(attachArtifactPreviewUrl).map(createArtifactPreview);

  return storyDetailResponseSchema.parse({
    story: state.story,
    artifacts
  });
}

function createStoryListPayload(state: DevServerState) {
  const artifacts = Array.from(state.artifacts.values()).map(attachArtifactPreviewUrl).map(createArtifactPreview);

  return storyListResponseSchema.parse({
    items: [
      {
        storyId: state.story.storyId,
        title: state.story.title,
        language: state.story.language,
        status: getStoryStatus(artifacts),
        hasIllustration: Boolean(state.story.illustrationUrl),
        artifactCounts: getArtifactStatusCounts(artifacts),
        updatedAt: new Date().toISOString()
      }
    ]
  });
}

function setArtifactsToGenerated(state: DevServerState, artifactTypes: MaterialArtifactType[]) {
  for (const artifact of state.artifacts.values()) {
    if (!artifactTypes.includes(artifact.envelope.artifactType)) {
      continue;
    }

    artifact.status = "generated";
    artifact.reviewState = artifact.envelope.artifactType === "teacher_notes" ? "approved" : "pending_review";
  }
}

async function routeRequest(state: DevServerState, request: IncomingMessage, response: ServerResponse): Promise<void> {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  const { pathname } = url;
  const method = request.method ?? "GET";

  if (method === "GET" && pathname === "/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (method === "GET" && (pathname === "/" || pathname === "/preview")) {
    const html = await readFile(path.join(publicDir, "local-preview.html"), "utf8");
    response.writeHead(200, {
      "content-type": "text/html; charset=utf-8"
    });
    response.end(html);
    return;
  }

  if (method === "GET" && pathname === "/stories") {
    sendJson(response, 200, createStoryListPayload(state));
    return;
  }

  if (method === "GET" && pathname === "/stories/example-story") {
    sendJson(response, 200, createStoryDetailPayload(state));
    return;
  }

  if (method === "POST" && pathname === "/stories") {
    sendJson(response, 201, await buildCreateStoryFixture());
    return;
  }

  if (method === "GET" && pathname === "/stories/example-story/artifacts") {
    sendJson(
      response,
      200,
      await buildArtifactListFixture().then((payload) => ({
        ...payload,
        items: Array.from(state.artifacts.values()).map(attachArtifactPreviewUrl).map(createArtifactPreview)
      }))
    );
    return;
  }

  if (method === "POST" && pathname === "/stories/example-story/generate") {
    const requestBody = generationRequestSchema.parse(await readJsonBody(request));

    setArtifactsToGenerated(state, requestBody.artifactTypes);

    sendJson(
      response,
      202,
      generationAcceptedResponseSchema.parse({
        jobId: `job-${Date.now()}`,
        storyId: state.story.storyId,
        artifactTypes: requestBody.artifactTypes,
        status: "generation_queued"
      })
    );
    return;
  }

  if (method === "GET" && pathname.startsWith("/artifacts/")) {
    const artifactPath = pathname.replace("/artifacts/", "");

    if (artifactPath.endsWith("/preview")) {
      const artifactId = artifactPath.replace("/preview", "");
      const artifact = state.artifacts.get(artifactId);

      if (!artifact) {
        sendJson(response, 404, { error: "Artifact not found", artifactId });
        return;
      }

      if (!artifact.renderedHtml) {
        sendJson(response, 409, { error: "Artifact does not have rendered HTML preview", artifactId });
        return;
      }

      response.writeHead(200, {
        "content-type": "text/html; charset=utf-8"
      });
      response.end(artifact.renderedHtml);
      return;
    }

    if (!artifactPath.includes("/")) {
      const artifact = state.artifacts.get(artifactPath);

      if (!artifact) {
        sendJson(response, 404, { error: "Artifact not found", artifactId: artifactPath });
        return;
      }

      sendJson(response, 200, attachArtifactPreviewUrl(artifact));
      return;
    }
  }

  if (method === "GET" && pathname === "/stories/example-story/generate/options") {
    sendJson(response, 200, {
      storyId: state.story.storyId,
      artifactTypes: ["worksheet", "answer_sheet", "teacher_notes"],
      mappedArtifactIds: {
        worksheet: getArtifactIdForType("worksheet"),
        answer_sheet: getArtifactIdForType("answer_sheet"),
        teacher_notes: getArtifactIdForType("teacher_notes")
      }
    });
    return;
  }

  if (method === "POST" && pathname.startsWith("/artifacts/") && pathname.endsWith("/review")) {
    const artifactId = pathname.replace("/artifacts/", "").replace("/review", "");
    const artifact = state.artifacts.get(artifactId);

    if (!artifact) {
      sendJson(response, 404, { error: "Artifact not found", artifactId });
      return;
    }

    const requestBody = reviewArtifactRequestSchema.parse(await readJsonBody(request));
    const reviewState: ReviewState = requestBody.action === "approve" ? "approved" : "rejected";

    artifact.reviewState = reviewState;
    artifact.status = reviewState === "approved" ? "approved" : "needs_review";
    artifact.issues = requestBody.notes ? [requestBody.notes] : artifact.issues;

    sendJson(
      response,
      200,
      reviewArtifactResponseSchema.parse({
        artifactId,
        reviewState,
        updatedAt: new Date().toISOString()
      })
    );
    return;
  }

  if (method === "GET" && pathname.startsWith("/assets/local/")) {
    const asset = await getLocalAssetRouteResult(pathname);

    if (asset.status === 200) {
      sendBytes(response, 200, asset.headers, asset.body);
      return;
    }

    sendJson(response, asset.status, {
      error: asset.status === 404 ? "Asset not found" : "Invalid asset path",
      publicPath: asset.publicPath
    });
    return;
  }

  sendJson(response, 404, {
    error: "Not found",
    method,
    pathname
  });
}

export function createApiServer() {
  const statePromise = createInitialState();

  return createServer((request, response) => {
    statePromise
      .then((state) => routeRequest(state, request, response))
      .catch((error) => {
        sendJson(response, 500, {
          error: error instanceof Error ? error.message : "Unknown server error"
        });
      })
      .catch(() => undefined);
  });
}

export async function startApiServer(options: { port?: number; host?: string } = {}) {
  const port = options.port ?? Number(process.env.ASAD_API_PORT ?? 4312);
  const host = options.host ?? process.env.ASAD_API_HOST ?? "127.0.0.1";
  const server = createApiServer();

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve());
  });

  return {
    server,
    port,
    host
  };
}

if (import.meta.url === new URL(process.argv[1] ?? "", "file://").href) {
  startApiServer()
    .then(({ host, port }) => {
      process.stdout.write(`ASAD API listening on http://${host}:${port}\n`);
    })
    .catch((error) => {
      process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
      process.exitCode = 1;
    });
}
