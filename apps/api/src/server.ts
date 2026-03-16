import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  buildAnswerSheetDetailFixture,
  buildArtifactDetailFixture,
  buildArtifactListFixture,
  buildCreateStoryFixture,
  buildStoryDetailFixture,
  buildStoryListFixture
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

async function routeRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
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
    sendJson(response, 200, await buildStoryListFixture());
    return;
  }

  if (method === "GET" && pathname === "/stories/example-story") {
    sendJson(response, 200, await buildStoryDetailFixture());
    return;
  }

  if (method === "POST" && pathname === "/stories") {
    sendJson(response, 201, await buildCreateStoryFixture());
    return;
  }

  if (method === "GET" && pathname === "/stories/example-story/artifacts") {
    sendJson(response, 200, await buildArtifactListFixture());
    return;
  }

  if (method === "GET" && pathname === "/artifacts/artifact-worksheet-beginner-v1") {
    sendJson(response, 200, await buildArtifactDetailFixture());
    return;
  }

  if (method === "GET" && pathname === "/artifacts/artifact-answer-sheet-beginner-v1") {
    sendJson(response, 200, await buildAnswerSheetDetailFixture());
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
  return createServer((request, response) => {
    routeRequest(request, response).catch((error) => {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : "Unknown server error"
      });
    });
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
