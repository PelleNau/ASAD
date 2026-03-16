import http from "node:http";

const baseUrl = new URL(process.env.ASAD_API_BASE_URL ?? "http://127.0.0.1:4312");

function request(pathname) {
  return new Promise((resolve, reject) => {
    const requestInstance = http.request(
      {
        protocol: baseUrl.protocol,
        hostname: baseUrl.hostname,
        port: baseUrl.port,
        path: pathname,
        method: "GET"
      },
      (response) => {
        const chunks = [];

        response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        response.on("end", () => {
          resolve({
            status: response.statusCode ?? 0,
            headers: response.headers,
            body: Buffer.concat(chunks)
          });
        });
      }
    );

    requestInstance.on("error", reject);
    requestInstance.end();
  });
}

async function fetchJson(pathname) {
  const response = await request(pathname);
  return {
    status: response.status,
    body: JSON.parse(response.body.toString("utf8"))
  };
}

async function fetchAsset(pathname) {
  const response = await request(pathname);
  return {
    status: response.status,
    contentType: response.headers["content-type"] ?? null,
    byteLength: response.body.byteLength
  };
}

async function main() {
  const stories = await fetchJson("/stories");
  const story = await fetchJson("/stories/example-story");
  const assetPath = story.body.story.illustrationUrl;
  const asset = await fetchAsset(assetPath);
  const teacherNotes = await fetchJson("/artifacts/artifact-teacher-notes-v1");
  const teacherNotesPreview =
    teacherNotes.body.previewUrl ? await request(teacherNotes.body.previewUrl) : { status: 0, headers: {}, body: Buffer.alloc(0) };

  process.stdout.write(
    JSON.stringify(
      {
        baseUrl,
        stories,
        storyStatus: story.status,
        assetPath,
        asset,
        teacherNotes: {
          status: teacherNotes.status,
          previewUrl: teacherNotes.body.previewUrl,
          previewStatus: teacherNotesPreview.status,
          previewContentType: teacherNotesPreview.headers["content-type"] ?? null
        }
      },
      null,
      2
    ) + "\n"
  );
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
