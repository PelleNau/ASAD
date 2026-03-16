import type { StoryRecord, WorksheetArtifact } from "@asad/schemas";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

type WorksheetLevelMeta = {
  heading: string;
  guidance: string[];
  headingColor: string;
  stripeColors: string[];
  questionMarkerMode: "number" | "mixed_dot";
};

export type WorksheetRenderVariant = "worksheet" | "answer_sheet";

export type WorksheetRenderContext = {
  story?: Pick<StoryRecord, "illustrationUrl" | "illustrationAlt" | "illustrationAssetId">;
  variant?: WorksheetRenderVariant;
};

function getLevelMeta(level: WorksheetArtifact["level"]): WorksheetLevelMeta {
  switch (level) {
    case "BEGINNER":
      return {
        heading: "LASFORSTAELSE NIVA 1",
        guidance: ["Lasa pa raderna (svaren finns direkt i texten)"],
        headingColor: "#f2a03b",
        stripeColors: ["#f2a03b"],
        questionMarkerMode: "number"
      };
    case "INTERMEDIATE":
      return {
        heading: "LASFORSTAELSE NIVA 2",
        guidance: ["Lasa mellan raderna (tolka, tank efter, dra slutsatser)"],
        headingColor: "#ee7d41",
        stripeColors: ["#e66932"],
        questionMarkerMode: "number"
      };
    case "ADVANCED":
      return {
        heading: "LASFORSTAELSE NIVA 3",
        guidance: ["Lasa bortom raderna (tank langre, koppla till dig sjalv)"],
        headingColor: "#df5c58",
        stripeColors: ["#df5c58"],
        questionMarkerMode: "number"
      };
    case "MIXED":
      return {
        heading: "LASFORSTAELSE MIX",
        guidance: [
          "Fragor 1 - 3: svaren finns direkt i texten",
          "Fragor 4 - 5: tolka texten, tank efter, dra slutsatser",
          "Fraga 6: tank langre, resonera, koppla till dig sjalv"
        ],
        headingColor: "#dc5158",
        stripeColors: ["#f2a03b", "#ee7d41", "#b52628"],
        questionMarkerMode: "mixed_dot"
      };
    case "CREATIVE":
      return {
        heading: "KREATIVT ARBETE",
        guidance: ["Skriv med egna ord eller beratta muntligt"],
        headingColor: "#b52628",
        stripeColors: ["#b52628"],
        questionMarkerMode: "number"
      };
  }
}

function getMixedDotColor(index: number): string {
  if (index < 3) {
    return "#f2a03b";
  }

  if (index < 5) {
    return "#e66932";
  }

  return "#b52628";
}

function renderIllustrationPanel(story?: Pick<StoryRecord, "illustrationUrl" | "illustrationAlt" | "illustrationAssetId">): string {
  if (story?.illustrationUrl) {
    return `
      <div class="illustration-frame">
        <img class="illustration-image" src="${escapeHtml(story.illustrationUrl)}" alt="${escapeHtml(
          story.illustrationAlt ?? ""
        )}" />
      </div>
    `;
  }

  return `
    <div class="illustration-frame">
      <div class="illustration-sky"></div>
      <div class="illustration-moon"></div>
      <div class="illustration-swirl"></div>
      <div class="illustration-person"></div>
      <div class="illustration-roof"></div>
      <div class="illustration-caption">${escapeHtml(story?.illustrationAssetId ?? "illustration")}</div>
    </div>
  `;
}

function renderQuestionList(artifact: WorksheetArtifact, meta: WorksheetLevelMeta, variant: WorksheetRenderVariant): string {
  const items = artifact.sections.flatMap((section) => section.items);

  return items
    .map((item, index) => {
      const marker =
        meta.questionMarkerMode === "mixed_dot"
          ? `<span class="question-dot" style="background:${getMixedDotColor(index)}"></span>`
          : `<span class="question-number">${index + 1}.</span>`;

      return `
        <li class="question-item">
          <div class="question-marker">${marker}</div>
          <div class="question-copy">
            <div class="question-text">${escapeHtml(item.prompt)}</div>
            ${
              variant === "answer_sheet"
                ? `<div class="answer-key">${
                    item.sampleAnswer
                      ? `<span class="answer-key-label">Forslag pa svar:</span> ${escapeHtml(item.sampleAnswer)}`
                      : `<span class="answer-key-label">Forslag pa svar:</span> Oppet resonemangssvar.`
                  }</div>`
                : ""
            }
          </div>
        </li>
      `;
    })
    .join("");
}

function renderMetaFields(artifact: WorksheetArtifact): string {
  const fields = [
    `<div class="meta-row"><span class="meta-label">Arskurs:</span><span class="meta-line meta-line-short"></span></div>`
  ];

  const secondary: string[] = [];

  if (artifact.printNotes.showNameField) {
    secondary.push(`<div class="meta-row meta-row-inline"><span class="meta-label">Namn:</span><span class="meta-line"></span></div>`);
  }

  if (artifact.printNotes.showDateField) {
    secondary.push(`<div class="meta-row meta-row-inline"><span class="meta-label">Datum:</span><span class="meta-line meta-line-date"></span></div>`);
  }

  fields.push(`<div class="meta-inline">${secondary.join("")}</div>`);

  return fields.join("");
}

function renderStripes(colors: string[]): string {
  return `
    <div class="stripes">
      ${colors.map((color) => `<span style="background:${color}"></span>`).join("")}
    </div>
  `;
}

export function renderWorksheetHtml(
  artifact: WorksheetArtifact,
  context: WorksheetRenderContext = {}
): string {
  const meta = getLevelMeta(artifact.level);
  const variant = context.variant ?? "worksheet";
  const guidance = meta.guidance.map((line) => `<div class="guidance-line">${escapeHtml(line)}</div>`).join("");
  const sectionTitle = variant === "answer_sheet" ? "FACIT" : "ARBETSBLAD";
  const footerWordmark = variant === "answer_sheet" ? "LARARVERSION" : "FOR SCHOOL";
  const subtitleHeading = variant === "answer_sheet" ? artifact.subtitle || "FACIT" : meta.heading;

  return `
    <!doctype html>
    <html lang="sv">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(artifact.title)}</title>
        <style>
          :root {
            --ink: #343434;
            --muted: #595959;
            --rule: #cfcfcf;
            --orange: #f2a03b;
            --orange-deep: #e66932;
            --red: #b52628;
          }
          @page {
            size: A4;
            margin: 0;
          }
          * { box-sizing: border-box; }
          html, body {
            margin: 0;
            background: white;
          }
          body {
            color: var(--ink);
            font-family: Arial, Helvetica, sans-serif;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 22mm 22mm 18mm 22mm;
          }
          .top {
            display: grid;
            grid-template-columns: 1fr 80mm;
            gap: 10mm;
            align-items: start;
          }
          .title {
            margin: 12px 0 4px;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 28px;
            font-weight: 400;
            line-height: 1.05;
            color: #2f2a27;
          }
          .credits {
            margin: 0;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 11px;
            color: #453e39;
          }
          .illustration-frame {
            position: relative;
            width: 100%;
            aspect-ratio: 1 / 1;
            overflow: hidden;
            border-radius: 8px;
            background: linear-gradient(180deg, #0f1830 0%, #213049 58%, #35495c 100%);
          }
          .illustration-image {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .illustration-sky {
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 75% 18%, rgba(255,255,255,0.22) 0 2%, transparent 2.5%),
              radial-gradient(circle at 55% 14%, rgba(255,255,255,0.24) 0 1.6%, transparent 2%),
              radial-gradient(circle at 22% 34%, rgba(255,255,255,0.18) 0 1.4%, transparent 1.8%);
          }
          .illustration-moon {
            position: absolute;
            top: 10%;
            left: 60%;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 4px solid #d7f1ff;
            border-right-color: transparent;
            border-bottom-color: transparent;
            transform: rotate(35deg);
            opacity: 0.9;
          }
          .illustration-swirl {
            position: absolute;
            inset: 18% 12% 18% 18%;
            border-radius: 48% 52% 44% 56% / 46% 45% 55% 54%;
            background:
              radial-gradient(circle at 30% 36%, rgba(243, 151, 168, 0.4), transparent 22%),
              radial-gradient(circle at 60% 45%, rgba(114, 168, 193, 0.28), transparent 26%),
              linear-gradient(145deg, rgba(157, 204, 214, 0.42), rgba(86, 98, 118, 0.45));
            border: 3px solid rgba(211, 232, 238, 0.62);
            box-shadow: inset 0 0 0 2px rgba(255,255,255,0.14);
          }
          .illustration-person {
            position: absolute;
            left: 27%;
            top: 41%;
            width: 22%;
            height: 30%;
            border-radius: 40% 45% 28% 38%;
            background:
              radial-gradient(circle at 55% 20%, #d6b0a5 0 18%, transparent 19%),
              linear-gradient(180deg, #7b2c40 0 28%, #3b8da5 28% 100%);
            transform: rotate(8deg);
            box-shadow: 18px -4px 0 -6px rgba(55, 27, 42, 0.72);
          }
          .illustration-roof {
            position: absolute;
            left: 8%;
            right: 8%;
            bottom: 0;
            height: 18%;
            background:
              linear-gradient(135deg, transparent 0 6%, #412e36 6% 36%, transparent 36% 44%, #543843 44% 72%, transparent 72%),
              linear-gradient(180deg, transparent 0 42%, #111826 42% 100%);
          }
          .illustration-caption {
            position: absolute;
            right: 8px;
            bottom: 8px;
            padding: 4px 6px;
            border-radius: 999px;
            background: rgba(255,255,255,0.14);
            color: rgba(255,255,255,0.86);
            font-size: 8px;
            letter-spacing: 0.04em;
          }
          .section-title {
            margin: 18px 0 2px;
            font-size: 17px;
            font-weight: 800;
            letter-spacing: 0.08em;
            color: #2a2a2a;
          }
          .level-heading {
            margin: 0;
            font-size: 18px;
            font-weight: 400;
            letter-spacing: 0.06em;
            color: ${variant === "answer_sheet" ? "#b52628" : meta.headingColor};
          }
          .guidance {
            margin: 3px 0 6px;
            font-size: 11px;
            line-height: 1.35;
            color: #333;
          }
          .guidance-line + .guidance-line {
            margin-top: 1px;
          }
          .stripes {
            display: grid;
            gap: 3px;
            width: 112mm;
            margin: 8px 0 18px;
          }
          .stripes span {
            display: block;
            height: 5px;
          }
          .meta-block {
            margin-bottom: 18px;
          }
          .meta-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0 0 10px;
            font-size: 12px;
            color: #3c3c3c;
          }
          .meta-label {
            min-width: max-content;
            font-weight: 700;
          }
          .meta-line {
            display: block;
            width: 86mm;
            border-bottom: 1px solid #6c6c6c;
            transform: translateY(2px);
          }
          .meta-line-short {
            width: 36mm;
          }
          .meta-line-date {
            width: 52mm;
          }
          .meta-inline {
            display: flex;
            gap: 8mm;
            align-items: center;
          }
          .question-list {
            margin: 0;
            padding: 0;
            list-style: none;
          }
          .question-item {
            display: grid;
            grid-template-columns: 14px 1fr;
            gap: 8px;
            margin: 0 0 24px;
            font-size: 12px;
            line-height: 1.35;
            color: #3a3a3a;
          }
          .question-marker {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 1px;
          }
          .question-number {
            font-weight: 400;
            color: #3b3b3b;
          }
          .question-dot {
            display: block;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            transform: translateY(3px);
          }
          .question-text {
            padding-top: 0;
          }
          .answer-key {
            margin-top: 6px;
            font-size: 11px;
            line-height: 1.45;
            color: #5a5a5a;
          }
          .answer-key-label {
            font-weight: 700;
            color: #363636;
          }
          .footer {
            position: relative;
            margin-top: 30px;
            padding-top: 14px;
            border-top: 1px solid var(--rule);
            display: flex;
            justify-content: space-between;
            align-items: end;
            gap: 10px;
          }
          .copyright {
            max-width: 92mm;
            font-size: 7px;
            line-height: 1.35;
            color: #585858;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: Arial, Helvetica, sans-serif;
          }
          .brand-mark {
            position: relative;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid #ef6b2f;
          }
          .brand-mark::before,
          .brand-mark::after {
            content: "";
            position: absolute;
            top: 6px;
            width: 8px;
            height: 8px;
            border: 3px solid #ef6b2f;
            border-radius: 50%;
            background: white;
          }
          .brand-mark::before {
            left: 2px;
          }
          .brand-mark::after {
            right: 2px;
          }
          .brand-heart {
            position: absolute;
            left: 6px;
            top: 10px;
            width: 12px;
            height: 12px;
            transform: rotate(45deg);
            background: #ef6b2f;
          }
          .brand-heart::before,
          .brand-heart::after {
            content: "";
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ef6b2f;
          }
          .brand-heart::before {
            left: -6px;
          }
          .brand-heart::after {
            top: -6px;
          }
          .brand-wordmark {
            text-align: right;
            line-height: 0.95;
          }
          .brand-top {
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 0.04em;
            color: #ef6b2f;
          }
          .brand-bottom {
            font-size: 10px;
            letter-spacing: 0.1em;
            color: #888;
          }
          @media print {
            html, body {
              background: white;
            }
          }
        </style>
      </head>
      <body>
        <main class="page">
          <section class="top">
            <div class="top-copy">
              <h1 class="title">${escapeHtml(artifact.title)}</h1>
              <p class="credits">Text: Emma Andersson Illustration: Jonn Clemente</p>

              <div class="section-title">${escapeHtml(sectionTitle)}</div>
              <p class="level-heading">${escapeHtml(subtitleHeading)}</p>
              <div class="guidance">${guidance}</div>
              ${renderStripes(variant === "answer_sheet" ? ["#b52628"] : meta.stripeColors)}
            </div>
            ${renderIllustrationPanel(context.story)}
          </section>

          <section class="meta-block">
            ${renderMetaFields(artifact)}
          </section>

          <ol class="question-list">
            ${renderQuestionList(artifact, meta, variant)}
          </ol>

          <footer class="footer">
            <div class="copyright">
              All rights reserved A story a day© 2026. Prohibited to copy or distribute for commercial
              use in any way, or use without license approved by A story a day AB.
            </div>
            <div class="brand">
              <div class="brand-mark"><span class="brand-heart"></span></div>
              <div class="brand-wordmark">
                <div class="brand-top">ASTORYADAY</div>
                <div class="brand-bottom">${escapeHtml(footerWordmark)}</div>
              </div>
            </div>
          </footer>
        </main>
      </body>
    </html>
  `;
}
