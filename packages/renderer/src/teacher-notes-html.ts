import type { StoryRecord, TeacherNotesArtifact } from "@asad/schemas";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function renderList(items: string[]): string {
  if (items.length === 0) {
    return `<p class="empty">Inget innehall tillgangligt i den har sektionen.</p>`;
  }

  return `
    <ul class="list">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

export type TeacherNotesRenderContext = {
  story?: Pick<StoryRecord, "illustrationUrl" | "illustrationAlt">;
};

export function renderTeacherNotesHtml(
  artifact: TeacherNotesArtifact,
  context: TeacherNotesRenderContext = {}
): string {
  return `
    <!doctype html>
    <html lang="sv">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(artifact.title)}</title>
        <style>
          :root {
            --bg: #f6f0e8;
            --paper: #fffdfa;
            --line: #dccfbe;
            --ink: #2a2520;
            --muted: #6a5e53;
            --accent: #d9652c;
          }
          @page {
            size: A4;
            margin: 0;
          }
          * { box-sizing: border-box; }
          html, body {
            margin: 0;
            background: var(--bg);
            color: var(--ink);
            font-family: Arial, Helvetica, sans-serif;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 18mm;
          }
          .sheet {
            min-height: calc(297mm - 36mm);
            padding: 18mm;
            border-radius: 18px;
            border: 1px solid rgba(82, 57, 31, 0.12);
            background: var(--paper);
            box-shadow: 0 18px 40px rgba(75, 53, 34, 0.08);
          }
          .top {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 12mm;
            align-items: start;
            margin-bottom: 10mm;
          }
          .eyebrow {
            color: var(--accent);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }
          .title {
            margin: 10px 0 8px;
            font: 400 31px/1.05 Georgia, "Times New Roman", serif;
          }
          .summary {
            margin: 0;
            color: var(--muted);
            font-size: 13px;
            line-height: 1.5;
          }
          .story-image {
            width: 100%;
            border-radius: 14px;
            border: 1px solid rgba(82, 57, 31, 0.12);
            display: block;
            background: #f1e7da;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10mm;
          }
          .card {
            padding: 14px;
            border: 1px solid var(--line);
            border-radius: 16px;
            background: rgba(255,255,255,0.7);
          }
          .card.full {
            grid-column: 1 / -1;
          }
          .heading {
            margin: 0 0 8px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--accent);
          }
          .list {
            margin: 0;
            padding-left: 18px;
            font-size: 13px;
            line-height: 1.5;
          }
          .list li + li {
            margin-top: 6px;
          }
          .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .chip {
            padding: 6px 10px;
            border-radius: 999px;
            background: #f0e4d7;
            color: #5f4d40;
            font-size: 12px;
            font-weight: 700;
          }
          .split {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }
          .empty {
            margin: 0;
            color: var(--muted);
            font-size: 13px;
          }
          @media print {
            html, body {
              background: white;
            }
            .sheet {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <main class="page">
          <section class="sheet">
            <header class="top">
              <div>
                <div class="eyebrow">Lararnoteringar</div>
                <h1 class="title">${escapeHtml(artifact.title)}</h1>
                <p class="summary">${escapeHtml(artifact.summary)}</p>
              </div>
              ${
                context.story?.illustrationUrl
                  ? `<img class="story-image" src="${escapeHtml(context.story.illustrationUrl)}" alt="${escapeHtml(
                      context.story.illustrationAlt ?? ""
                    )}" />`
                  : `<div class="story-image" style="aspect-ratio:1/1;"></div>`
              }
            </header>

            <section class="grid">
              <article class="card full">
                <h2 class="heading">Larandefokus</h2>
                <div class="chips">
                  ${artifact.learningFocus.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("")}
                </div>
              </article>

              <article class="card">
                <h2 class="heading">Fore lasning</h2>
                ${renderList(artifact.beforeReading)}
              </article>

              <article class="card">
                <h2 class="heading">Under lasning</h2>
                ${renderList(artifact.duringReading)}
              </article>

              <article class="card">
                <h2 class="heading">Efter lasning</h2>
                ${renderList(artifact.afterReading)}
              </article>

              <article class="card">
                <h2 class="heading">Kansliga teman</h2>
                ${renderList(artifact.sensitiveTopics)}
              </article>

              <article class="card full">
                <h2 class="heading">Differentiering</h2>
                <div class="split">
                  <div>
                    <h3 class="heading" style="margin-top:0;">Stod</h3>
                    ${renderList(artifact.differentiation.support)}
                  </div>
                  <div>
                    <h3 class="heading" style="margin-top:0;">Utmaning</h3>
                    ${renderList(artifact.differentiation.stretch)}
                  </div>
                </div>
              </article>

              <article class="card full">
                <h2 class="heading">Fortsatt arbete</h2>
                ${renderList(artifact.extensionActivities)}
              </article>
            </section>
          </section>
        </main>
      </body>
    </html>
  `;
}
