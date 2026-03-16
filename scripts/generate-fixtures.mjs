import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildAnswerSheetDetailFixture,
  buildArtifactDetailFixture,
  buildArtifactListFixture,
  buildCreateStoryFixture,
  buildGenerationAcceptedFixture,
  buildStoryDetailFixture,
  buildStoryListFixture
} from "../apps/api/dist/apps/api/src/fixtures.js";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const outputDir = path.join(rootDir, "fixtures", "generated");

async function writeJson(fileName, payload) {
  const target = path.join(outputDir, fileName);
  await writeFile(target, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  await writeJson("story-list.generated.json", await buildStoryListFixture());
  await writeJson("story-detail.generated.json", await buildStoryDetailFixture());
  await writeJson("create-story.generated.json", await buildCreateStoryFixture());
  await writeJson("generation-accepted.generated.json", await buildGenerationAcceptedFixture());
  await writeJson("artifact-list.generated.json", await buildArtifactListFixture());
  await writeJson("artifact-detail.generated.json", await buildArtifactDetailFixture());
  await writeJson("answer-sheet-detail.generated.json", await buildAnswerSheetDetailFixture());

  process.stdout.write(`Generated fixtures written to ${outputDir}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
