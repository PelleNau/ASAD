import { mkdir } from "node:fs/promises";
import path from "node:path";
import { renderHtmlToPdfFile, renderWorksheetHtml } from "../packages/renderer/dist/renderer/src/index.js";
import { buildArtifactDetailFixture } from "../apps/api/dist/apps/api/src/fixtures.js";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const outputDir = path.join(rootDir, "artifacts", "samples");

async function main() {
  await mkdir(outputDir, { recursive: true });

  const artifactDetail = await buildArtifactDetailFixture();
  const worksheet = artifactDetail.result;

  if (!worksheet || worksheet.artifactType !== "worksheet") {
    throw new Error("Sample PDF rendering currently supports worksheet artifacts only.");
  }

  const html = artifactDetail.renderedHtml ?? renderWorksheetHtml(worksheet);
  const outputPath = path.join(outputDir, "sample-worksheet.pdf");

  const pdfPath = await renderHtmlToPdfFile(html, { outputPath });
  process.stdout.write(`Rendered sample PDF to ${pdfPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
