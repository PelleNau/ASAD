import type { WorksheetArtifact } from "@asad/schemas";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function renderQuestionList(artifact: WorksheetArtifact): string {
  return artifact.sections
    .map((section) => {
      const items = section.items
        .map(
          (item, index) => `
            <li class="question-item">
              <span class="question-index">${index + 1}.</span>
              <span class="question-text">${escapeHtml(item.prompt)}</span>
            </li>
          `
        )
        .join("");

      return `
        <section class="section">
          <h2>${escapeHtml(section.heading)}</h2>
          ${section.description ? `<p class="section-description">${escapeHtml(section.description)}</p>` : ""}
          <ol class="question-list">${items}</ol>
        </section>
      `;
    })
    .join("");
}

export function renderWorksheetHtml(artifact: WorksheetArtifact): string {
  const nameField = artifact.printNotes.showNameField
    ? `<div class="meta-field">Namn: ________________________</div>`
    : "";
  const dateField = artifact.printNotes.showDateField
    ? `<div class="meta-field">Datum: ________________________</div>`
    : "";

  return `
    <!doctype html>
    <html lang="sv">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(artifact.title)}</title>
        <style>
          :root {
            --bg: #e9e4e3;
            --card: #ffffff;
            --ink: #111111;
            --muted: #595959;
            --accent: #e2591a;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--bg);
            color: var(--ink);
            font-family: Georgia, "Times New Roman", serif;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 16mm;
            background: var(--card);
          }
          .eyebrow {
            color: var(--accent);
            font: 700 12px/1.2 Arial, sans-serif;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          h1 {
            margin: 8px 0 4px;
            font-size: 28px;
            font-weight: 400;
          }
          .subtitle {
            margin: 0 0 16px;
            color: var(--muted);
            font: 400 14px/1.4 Arial, sans-serif;
          }
          .meta {
            display: flex;
            gap: 24px;
            margin: 0 0 20px;
            font: 400 13px/1.4 Arial, sans-serif;
          }
          .instructions {
            margin: 0 0 24px;
            font: 400 14px/1.5 Arial, sans-serif;
          }
          .section {
            margin: 0 0 24px;
          }
          h2 {
            margin: 0 0 6px;
            font-size: 18px;
          }
          .section-description {
            margin: 0 0 12px;
            color: var(--muted);
            font: 400 13px/1.4 Arial, sans-serif;
          }
          .question-list {
            margin: 0;
            padding: 0;
            list-style: none;
          }
          .question-item {
            display: grid;
            grid-template-columns: 24px 1fr;
            gap: 8px;
            margin: 0 0 12px;
            font: 400 15px/1.5 Arial, sans-serif;
          }
          .question-index {
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <main class="page">
          <div class="eyebrow">ASAD Worksheet</div>
          <h1>${escapeHtml(artifact.title)}</h1>
          <p class="subtitle">${escapeHtml(artifact.subtitle)}</p>
          <div class="meta">
            ${nameField}
            ${dateField}
          </div>
          <p class="instructions">${escapeHtml(artifact.studentInstructions)}</p>
          ${renderQuestionList(artifact)}
        </main>
      </body>
    </html>
  `;
}
