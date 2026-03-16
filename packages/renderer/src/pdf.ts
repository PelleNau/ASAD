import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

export type PdfRenderOptions = {
  outputPath?: string;
  format?: "A4" | "Letter";
  printBackground?: boolean;
};

export async function renderHtmlToPdfBuffer(
  html: string,
  options: PdfRenderOptions = {}
): Promise<Uint8Array> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    const pdf = await page.pdf({
      format: options.format ?? "A4",
      printBackground: options.printBackground ?? true
    });

    return new Uint8Array(pdf);
  } finally {
    await browser.close();
  }
}

export async function renderHtmlToPdfFile(html: string, options: PdfRenderOptions & { outputPath: string }): Promise<string> {
  const pdf = await renderHtmlToPdfBuffer(html, options);
  const absolutePath = path.resolve(options.outputPath);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, pdf);

  return absolutePath;
}
