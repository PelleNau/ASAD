import type { WorksheetArtifact } from "@asad/schemas";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

type WorksheetLevelMeta = {
  chip: string;
  title: string;
  guidance: string[];
  accent: string;
};

function getLevelMeta(level: WorksheetArtifact["level"]): WorksheetLevelMeta {
  switch (level) {
    case "BEGINNER":
      return {
        chip: "NIVA 1",
        title: "Lasa pa raderna",
        guidance: ["Svaren finns direkt i texten."],
        accent: "#d85f21"
      };
    case "INTERMEDIATE":
      return {
        chip: "NIVA 2",
        title: "Lasa mellan raderna",
        guidance: ["Tolka texten, tank efter, dra slutsatser."],
        accent: "#b94d18"
      };
    case "ADVANCED":
      return {
        chip: "NIVA 3",
        title: "Lasa bortom raderna",
        guidance: ["Tank langre, resonera och koppla till dig sjalv."],
        accent: "#8f3f1d"
      };
    case "MIXED":
      return {
        chip: "MIX",
        title: "Blandad lasforstaelse",
        guidance: [
          "Kombinera svar direkt ur texten med tolkning och egen reflektion."
        ],
        accent: "#c06a2f"
      };
    case "CREATIVE":
      return {
        chip: "SKAPA",
        title: "Kreativt arbete",
        guidance: ["Skriv, beratta eller skapa vidare utifran texten."],
        accent: "#9a5d1f"
      };
  }
}

function getPromptForAnswerFormat(answerFormat: string): string {
  switch (answerFormat) {
    case "short_text":
      return "Skriv kort svar.";
    case "long_text":
      return "Skriv med egna ord.";
    case "oral":
      return "Beratta muntligt eller skriv kort.";
    case "drawing":
      return "Rita eller skriv.";
    default:
      return "";
  }
}

function renderAnswerSpace(answerFormat: string): string {
  switch (answerFormat) {
    case "short_text":
      return `<div class="answer-lines answer-lines-short"><span></span><span></span></div>`;
    case "long_text":
      return `<div class="answer-lines answer-lines-long"><span></span><span></span><span></span><span></span></div>`;
    case "oral":
      return `<div class="answer-pill">Muntligt svar fungerar ocksa</div>`;
    case "drawing":
      return `<div class="answer-box"></div>`;
    default:
      return "";
  }
}

function renderQuestionList(artifact: WorksheetArtifact): string {
  let questionNumber = 0;

  return artifact.sections
    .map((section) => {
      const items = section.items
        .map((item) => {
          questionNumber += 1;

          return `
            <li class="question-item">
              <div class="question-row">
                <span class="question-index">${questionNumber}.</span>
                <div class="question-body">
                  <span class="question-text">${escapeHtml(item.prompt)}</span>
                  <div class="question-meta">
                    <span class="skill-tag">${escapeHtml(item.skillType)}</span>
                    <span class="answer-tag">${escapeHtml(getPromptForAnswerFormat(item.answerFormat))}</span>
                  </div>
                </div>
              </div>
              ${renderAnswerSpace(item.answerFormat)}
            </li>
          `;
        })
        .join("");

      return `
        <section class="section">
          <div class="section-header">
            <h2>${escapeHtml(section.heading)}</h2>
            ${section.description ? `<p class="section-description">${escapeHtml(section.description)}</p>` : ""}
          </div>
          <ol class="question-list">${items}</ol>
        </section>
      `;
    })
    .join("");
}

export function renderWorksheetHtml(artifact: WorksheetArtifact): string {
  const levelMeta = getLevelMeta(artifact.level);
  const nameField = artifact.printNotes.showNameField
    ? `<div class="meta-field"><span>Namn</span><strong></strong></div>`
    : "";
  const dateField = artifact.printNotes.showDateField
    ? `<div class="meta-field"><span>Datum</span><strong></strong></div>`
    : "";
  const yearField = `<div class="meta-field"><span>Arskurs</span><strong></strong></div>`;
  const guidanceItems = levelMeta.guidance
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `
    <!doctype html>
    <html lang="sv">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(artifact.title)}</title>
        <style>
          :root {
            --paper: #f4efe7;
            --card: #fffdf8;
            --ink: #1d1916;
            --muted: #6e6258;
            --accent: ${levelMeta.accent};
            --line: #ddcfc1;
            --soft: #efe4d8;
          }
          @page {
            size: A4;
            margin: 0;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--paper);
            color: var(--ink);
            font-family: Georgia, "Times New Roman", serif;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 14mm 14mm 12mm;
            background:
              radial-gradient(circle at top right, rgba(216, 95, 33, 0.08), transparent 30%),
              linear-gradient(180deg, #f7f1ea 0%, #f4efe7 100%);
          }
          .sheet {
            min-height: 269mm;
            background: var(--card);
            border: 1px solid rgba(110, 98, 88, 0.16);
            border-radius: 22px;
            box-shadow: 0 16px 40px rgba(65, 43, 25, 0.08);
            overflow: hidden;
          }
          .hero {
            display: grid;
            grid-template-columns: 1.4fr 0.8fr;
            gap: 12mm;
            padding: 14mm 14mm 10mm;
            background:
              linear-gradient(135deg, rgba(216, 95, 33, 0.10), rgba(216, 95, 33, 0.02)),
              linear-gradient(180deg, #f7ecdf 0%, #fbf8f2 100%);
            border-bottom: 1px solid rgba(110, 98, 88, 0.18);
          }
          .eyebrow-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
          }
          .eyebrow {
            color: var(--accent);
            font: 700 11px/1.2 Arial, sans-serif;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .school-chip {
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: 999px;
            background: rgba(216, 95, 33, 0.12);
            color: var(--accent);
            font: 700 10px/1 Arial, sans-serif;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          h1 {
            margin: 0 0 8px;
            font-size: 31px;
            font-weight: 400;
            line-height: 1.05;
          }
          .subtitle {
            margin: 0 0 12px;
            color: var(--muted);
            font: 600 13px/1.4 Arial, sans-serif;
            letter-spacing: 0.04em;
            text-transform: uppercase;
          }
          .credits {
            color: var(--muted);
            font: 400 12px/1.5 Arial, sans-serif;
          }
          .level-card {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 12px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.72);
            border: 1px solid rgba(216, 95, 33, 0.18);
          }
          .level-chip {
            display: inline-flex;
            width: fit-content;
            align-items: center;
            padding: 5px 10px;
            border-radius: 999px;
            background: var(--accent);
            color: white;
            font: 700 11px/1 Arial, sans-serif;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .level-title {
            margin: 14px 0 6px;
            font-size: 22px;
            line-height: 1.15;
          }
          .level-guidance {
            margin: 0;
            padding-left: 18px;
            color: var(--muted);
            font: 400 13px/1.5 Arial, sans-serif;
          }
          .meta {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
            padding: 10mm 14mm 0;
            font: 400 13px/1.4 Arial, sans-serif;
          }
          .meta-field {
            display: grid;
            gap: 6px;
          }
          .meta-field span {
            color: var(--muted);
            font: 700 11px/1 Arial, sans-serif;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .meta-field strong {
            display: block;
            height: 28px;
            border-bottom: 1.5px solid var(--line);
          }
          .instructions {
            margin: 0;
            padding: 8mm 14mm 0;
            color: var(--ink);
            font: 400 14px/1.55 Arial, sans-serif;
          }
          .content {
            padding: 8mm 14mm 10mm;
          }
          .section {
            margin: 0 0 24px;
            padding: 14px 16px 16px;
            border: 1px solid var(--line);
            border-radius: 18px;
            background: linear-gradient(180deg, #fffdfa 0%, #fffaf3 100%);
          }
          .section-header {
            margin: 0 0 14px;
          }
          h2 {
            margin: 0 0 4px;
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
            margin: 0 0 16px;
            padding-bottom: 14px;
            border-bottom: 1px solid rgba(221, 207, 193, 0.7);
            font: 400 15px/1.5 Arial, sans-serif;
          }
          .question-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
          }
          .question-row {
            display: grid;
            grid-template-columns: 34px 1fr;
            gap: 10px;
          }
          .question-index {
            display: inline-flex;
            width: 28px;
            height: 28px;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            background: rgba(216, 95, 33, 0.12);
            color: var(--accent);
            font: 700 13px/1 Arial, sans-serif;
          }
          .question-body {
            min-width: 0;
          }
          .question-text {
            display: block;
            margin-bottom: 7px;
          }
          .question-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 10px;
          }
          .skill-tag,
          .answer-tag,
          .answer-pill {
            display: inline-flex;
            width: fit-content;
            padding: 4px 8px;
            border-radius: 999px;
            background: var(--soft);
            color: var(--muted);
            font: 700 10px/1.2 Arial, sans-serif;
            letter-spacing: 0.04em;
            text-transform: uppercase;
          }
          .answer-lines {
            display: grid;
            gap: 8px;
            margin-left: 44px;
          }
          .answer-lines span {
            display: block;
            border-bottom: 1px solid var(--line);
          }
          .answer-lines-short span {
            min-height: 12px;
          }
          .answer-lines-long span {
            min-height: 16px;
          }
          .answer-box {
            height: 90px;
            margin-left: 44px;
            border: 1px dashed var(--line);
            border-radius: 12px;
            background: repeating-linear-gradient(
              -45deg,
              rgba(221, 207, 193, 0.1),
              rgba(221, 207, 193, 0.1) 8px,
              rgba(255, 255, 255, 0.2) 8px,
              rgba(255, 255, 255, 0.2) 16px
            );
          }
          .footer {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 0 14mm 10mm;
            color: var(--muted);
            font: 400 11px/1.4 Arial, sans-serif;
          }
          .footer strong {
            font-weight: 700;
          }
          @media print {
            body {
              background: white;
            }
            .page {
              padding: 0;
            }
            .sheet {
              border: none;
              border-radius: 0;
              box-shadow: none;
              min-height: 297mm;
            }
          }
        </style>
      </head>
      <body>
        <main class="page">
          <section class="sheet">
            <header class="hero">
              <div>
                <div class="eyebrow-row">
                  <div class="school-chip">For School</div>
                  <div class="eyebrow">Arbetsblad</div>
                </div>
                <h1>${escapeHtml(artifact.title)}</h1>
                <p class="subtitle">${escapeHtml(artifact.subtitle)}</p>
                <div class="credits">
                  <strong>A Story A Day</strong><br />
                  Litterart lararstod for utskrift
                </div>
              </div>
              <aside class="level-card">
                <div class="level-chip">${escapeHtml(levelMeta.chip)}</div>
                <div>
                  <h2 class="level-title">${escapeHtml(levelMeta.title)}</h2>
                  <ul class="level-guidance">${guidanceItems}</ul>
                </div>
              </aside>
            </header>
            <div class="meta">
              ${yearField}
              ${nameField}
              ${dateField}
            </div>
            <p class="instructions">${escapeHtml(artifact.studentInstructions)}</p>
            <div class="content">
              ${renderQuestionList(artifact)}
            </div>
            <footer class="footer">
              <div>Utskriftsmall for klassrumsbruk</div>
              <div><strong>${escapeHtml(levelMeta.chip)}</strong> · ${escapeHtml(levelMeta.title)}</div>
            </footer>
          </section>
        </main>
      </body>
    </html>
  `;
}
