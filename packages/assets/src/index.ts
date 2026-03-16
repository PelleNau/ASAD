import { mkdirSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const LOCAL_ASSET_PUBLIC_PREFIX = "/assets/local/";

export type LocalIllustrationAsset = {
  assetId: string;
  kind: "illustration";
  fileName: string;
  mediaType: string;
  storagePath: string;
  publicPath: string;
  renderUrl: string;
  altText: string | null;
};

export type StoreIllustrationInput = {
  storyId: string;
  originalFileName: string;
  svgMarkup?: string;
  dataUrl?: string;
  altText?: string | null;
};

export type LocalAssetStore = {
  storeIllustration(input: StoreIllustrationInput): LocalIllustrationAsset;
};

export type LocalAssetReadResult = {
  status: 200 | 404 | 400;
  contentType: string | null;
  body: Uint8Array | null;
  storagePath: string | null;
  publicPath: string;
};

function sanitizeSegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function parseDataUrl(dataUrl: string): { mediaType: string; buffer: Buffer; extension: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    throw new Error("Unsupported illustration data URL format.");
  }

  const [, mediaType, base64Payload] = match;
  const extension = mediaType === "image/svg+xml" ? "svg" : mediaType.split("/")[1] ?? "bin";

  return {
    mediaType,
    buffer: Buffer.from(base64Payload, "base64"),
    extension
  };
}

export function createExampleIllustrationSvg(title: string): string {
  const safeTitle = title.replace(/[<&>"]/g, "");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${safeTitle}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#0d1731" />
          <stop offset="1" stop-color="#364b60" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="18" fill="url(#bg)" />
      <circle cx="304" cy="60" r="22" fill="none" stroke="#d9f3ff" stroke-width="8" />
      <path d="M320 42a18 18 0 1 1-18 18" fill="#0d1731" />
      <ellipse cx="228" cy="170" rx="118" ry="128" fill="rgba(194,228,239,0.28)" stroke="rgba(231,247,252,0.72)" stroke-width="6" />
      <path d="M92 330L148 278L184 320L234 260L298 330Z" fill="#202934" />
      <path d="M160 200c26-30 44-48 74-56c-8 28-3 58 12 94c-41 4-72-8-86-38z" fill="#d9dde2" />
      <circle cx="177" cy="184" r="16" fill="#d4aea0" />
      <path d="M150 206h40v84h-40z" fill="#2f95ad" />
      <path d="M143 205h54v18h-54z" fill="#732f43" />
      <text x="22" y="370" fill="rgba(255,255,255,0.82)" font-family="Arial, sans-serif" font-size="18">${safeTitle}</text>
    </svg>
  `.trim();
}

export function createLocalAssetStore(options: { rootDir: string }): LocalAssetStore {
  const assetRoot = path.resolve(options.rootDir, "artifacts", "assets");
  mkdirSync(assetRoot, { recursive: true });

  return {
    storeIllustration(input: StoreIllustrationInput): LocalIllustrationAsset {
      const storySlug = sanitizeSegment(input.storyId);
      const fileSlug = sanitizeSegment(path.parse(input.originalFileName).name || "illustration");
      const assetId = `${storySlug}-${fileSlug}`;

      let mediaType = "image/svg+xml";
      let extension = "svg";
      let buffer: Buffer;

      if (input.dataUrl) {
        const parsed = parseDataUrl(input.dataUrl);
        mediaType = parsed.mediaType;
        extension = parsed.extension;
        buffer = parsed.buffer;
      } else {
        const svgMarkup = input.svgMarkup ?? createExampleIllustrationSvg(input.storyId);
        buffer = Buffer.from(svgMarkup, "utf8");
      }

      const fileName = `${assetId}.${extension}`;
      const storagePath = path.join(assetRoot, fileName);
      const publicPath = `${LOCAL_ASSET_PUBLIC_PREFIX}${fileName}`;
      writeFileSync(storagePath, buffer);

      return {
        assetId,
        kind: "illustration",
        fileName,
        mediaType,
        storagePath,
        publicPath,
        renderUrl: publicPath,
        altText: input.altText ?? null
      };
    }
  };
}

function getContentTypeFromExtension(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase();

  switch (extension) {
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

export function resolveLocalAssetStoragePath(rootDir: string, publicPath: string): string | null {
  if (!publicPath.startsWith(LOCAL_ASSET_PUBLIC_PREFIX)) {
    return null;
  }

  const fileName = publicPath.slice(LOCAL_ASSET_PUBLIC_PREFIX.length);

  if (!fileName || fileName.includes("/") || fileName.includes("\\")) {
    return null;
  }

  return path.resolve(rootDir, "artifacts", "assets", fileName);
}

export async function readLocalAsset(rootDir: string, publicPath: string): Promise<LocalAssetReadResult> {
  const storagePath = resolveLocalAssetStoragePath(rootDir, publicPath);

  if (!storagePath) {
    return {
      status: 400,
      contentType: null,
      body: null,
      storagePath: null,
      publicPath
    };
  }

  try {
    const body = await readFile(storagePath);

    return {
      status: 200,
      contentType: getContentTypeFromExtension(storagePath),
      body: new Uint8Array(body),
      storagePath,
      publicPath
    };
  } catch {
    return {
      status: 404,
      contentType: null,
      body: null,
      storagePath,
      publicPath
    };
  }
}
