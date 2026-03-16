import { getLocalAssetRouteResult, apiBootstrap } from "../apps/api/dist/apps/api/src/index.js";

async function main() {
  const publicPath = apiBootstrap.story.illustrationUrl;

  if (!publicPath) {
    throw new Error("No illustrationUrl available on apiBootstrap.story");
  }

  const result = await getLocalAssetRouteResult(publicPath);

  process.stdout.write(
    JSON.stringify(
      {
        publicPath,
        status: result.status,
        headers: result.headers,
        storagePath: result.storagePath,
        byteLength: result.body?.byteLength ?? 0
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
