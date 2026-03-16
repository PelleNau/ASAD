import OpenAI from "openai";
import type {
  MaterialArtifactType,
  StoryRecord,
  TeacherNotesArtifact,
  WorksheetArtifact
} from "@asad/schemas";
import { teacherNotesArtifactSchema, worksheetArtifactSchema } from "@asad/schemas";

export type PromptExecutionContext = {
  story: StoryRecord;
  artifactType: MaterialArtifactType;
  promptFamily: string;
  promptVersion: string;
  model: string;
};

export type PromptExecutionResult = WorksheetArtifact | TeacherNotesArtifact;

export interface PromptRunner {
  run(context: PromptExecutionContext): Promise<PromptExecutionResult>;
}

type ArtifactSchema = typeof worksheetArtifactSchema | typeof teacherNotesArtifactSchema;

type ArtifactPromptDefinition = {
  systemPrompt: string;
  userPrompt: string;
  schema: ArtifactSchema;
};

const PROMPT_SCHEMA_VERSION = "0.1.0";

function buildWorksheetFromStory(story: StoryRecord): WorksheetArtifact {
  return {
    artifactType: "worksheet",
    storyId: story.storyId,
    level: "BEGINNER",
    title: story.title,
    subtitle: "LASFORSTAELSE",
    studentInstructions: "Las texten och svara pa fragorna.",
    sections: [
      {
        type: "questions",
        heading: "Fraga och svar",
        description: "Svaren finns direkt i texten eller kan resoneras fram.",
        items: [
          {
            id: "q1",
            prompt: "Vem handlar berattelsen om?",
            skillType: "retrieval",
            answerFormat: "short_text",
            teacherIntent: "Kontrollerar grundlaggande forstaelse av huvudperson.",
            sampleAnswer: "Berattelsen handlar om huvudpersonen och hens upplevelse av att vara radd."
          },
          {
            id: "q2",
            prompt: "Hur kanner sig huvudpersonen i borjan av berattelsen?",
            skillType: "inference",
            answerFormat: "short_text",
            teacherIntent: "Tranar elevens formaga att tolka kanslor i text.",
            sampleAnswer: "Huvudpersonen verkar orolig och radd."
          },
          {
            id: "q3",
            prompt: "Vad tycker du ar viktigt i berattelsen, och varfor?",
            skillType: "reflection",
            answerFormat: "long_text",
            teacherIntent: "Oppnar for egen tolkning och resonemang.",
            sampleAnswer: "Ett rimligt svar lyfter att modet vaxer fram nar huvudpersonen vagar prova trots sin radsla."
          }
        ]
      }
    ],
    printNotes: {
      showNameField: true,
      showDateField: true
    }
  };
}

function buildTeacherNotesFromStory(story: StoryRecord): TeacherNotesArtifact {
  return {
    artifactType: "teacher_notes",
    storyId: story.storyId,
    title: `${story.title} - lararstod`,
    summary: "Kort lararstod baserat pa berattelsens innehall och tema.",
    learningFocus: ["lasforstaelse", "tolkning", "muntligt resonemang"],
    beforeReading: ["Forforsta centrala ord och tala om illustrationens ledtradar."],
    duringReading: ["Pausa vid viktiga handelser och lat eleverna forutse vad som hander sen."],
    afterReading: ["Lata eleverna resonera om budskap och koppla till egna erfarenheter."],
    differentiation: {
      support: ["Las hogt tillsammans och anvand bildstod."],
      stretch: ["Lat eleverna motivera sina svar med stod i texten."]
    },
    sensitiveTopics: [],
    extensionActivities: ["Lat eleverna skriva en alternativ avslutning."]
  };
}

function buildStoryContext(story: StoryRecord): string {
  return [
    `Story ID: ${story.storyId}`,
    `Language: ${story.language}`,
    `Title: ${story.title}`,
    `Target age band: ${story.targetAgeBand ?? "unspecified"}`,
    `Themes: ${story.themes.length > 0 ? story.themes.join(", ") : "none provided"}`,
    `Teaching hooks: ${story.teachingHooks.length > 0 ? story.teachingHooks.join(", ") : "none provided"}`,
    `Illustration asset ID: ${story.illustrationAssetId}`,
    `Illustration URL: ${story.illustrationUrl ?? "none provided"}`,
    "Story text:",
    story.storyText
  ].join("\n");
}

function getPromptDefinition(context: PromptExecutionContext): ArtifactPromptDefinition {
  const sharedSystemPrompt = [
    "You generate structured teacher-support material for Swedish school stories.",
    "Return only valid JSON that matches the requested schema.",
    "Write concise, usable Swedish content.",
    "Do not invent story facts that are not supported by the provided text.",
    "Prefer simple classroom-ready phrasing over academic language."
  ].join(" ");

  const storyContext = buildStoryContext(context.story);

  switch (context.artifactType) {
    case "worksheet":
      return {
        systemPrompt: sharedSystemPrompt,
        userPrompt: [
          "Generate a worksheet artifact.",
          `Prompt family: ${context.promptFamily}`,
          `Prompt version: ${PROMPT_SCHEMA_VERSION}`,
          "Requirements:",
          "- artifactType must be worksheet",
          "- include 3 to 5 questions total",
          "- mix retrieval, inference, and reflection",
          "- studentInstructions must be short and printable",
          "- subtitle should be a short uppercase worksheet label",
          "- teacherIntent should explain why each question is pedagogically useful",
          "- sampleAnswer may be null for open reflection questions",
          storyContext
        ].join("\n"),
        schema: worksheetArtifactSchema
      };
    case "answer_sheet":
      return {
        systemPrompt: sharedSystemPrompt,
        userPrompt: [
          "Generate an answer sheet artifact using the worksheet schema.",
          `Prompt family: ${context.promptFamily}`,
          `Prompt version: ${PROMPT_SCHEMA_VERSION}`,
          "Requirements:",
          "- artifactType must be worksheet",
          "- include 3 to 5 questions total",
          "- every question must include a concise sampleAnswer",
          "- studentInstructions should indicate that this is a lararversion or facit",
          "- subtitle should be a short uppercase answer-sheet label",
          "- teacherIntent should remain included for backend/editorial use",
          storyContext
        ].join("\n"),
        schema: worksheetArtifactSchema
      };
    case "teacher_notes":
      return {
        systemPrompt: sharedSystemPrompt,
        userPrompt: [
          "Generate a teacher notes artifact.",
          `Prompt family: ${context.promptFamily}`,
          `Prompt version: ${PROMPT_SCHEMA_VERSION}`,
          "Requirements:",
          "- artifactType must be teacher_notes",
          "- provide concise bullets teachers can use directly",
          "- cover before, during, and after reading",
          "- include differentiation support and stretch ideas",
          "- avoid empty sections unless the story truly gives no material",
          storyContext
        ].join("\n"),
        schema: teacherNotesArtifactSchema
      };
    default:
      throw new Error(`No prompt definition available for artifact type: ${context.artifactType}`);
  }
}

function extractResponseText(response: unknown): string {
  const candidate = response as {
    output_text?: string;
    output?: Array<{
      content?: Array<{
        type?: string;
        text?: string;
      }>;
    }>;
  };

  if (typeof candidate.output_text === "string" && candidate.output_text.trim().length > 0) {
    return candidate.output_text;
  }

  const textChunks =
    candidate.output
      ?.flatMap((item) => item.content ?? [])
      .filter((item) => item.type === "output_text" && typeof item.text === "string")
      .map((item) => item.text?.trim() ?? "")
      .filter((text) => text.length > 0) ?? [];

  if (textChunks.length === 0) {
    throw new Error("OpenAI response did not include output text.");
  }

  return textChunks.join("\n");
}

function parseStructuredArtifact(rawText: string, schema: ArtifactSchema): PromptExecutionResult {
  const parsed = JSON.parse(rawText) as unknown;
  return schema.parse(parsed) as PromptExecutionResult;
}

export class StaticPromptRunner implements PromptRunner {
  async run(context: PromptExecutionContext): Promise<PromptExecutionResult> {
    switch (context.artifactType) {
      case "worksheet":
        return buildWorksheetFromStory(context.story);
      case "answer_sheet": {
        const artifact = buildWorksheetFromStory(context.story);
        return {
          ...artifact,
          subtitle: "FACIT",
          studentInstructions: "Lararversion med forslag pa svar."
        };
      }
      case "teacher_notes":
        return buildTeacherNotesFromStory(context.story);
      default:
        throw new Error(`StaticPromptRunner does not yet support artifact type: ${context.artifactType}`);
    }
  }
}

export type OpenAIPromptRunnerOptions = {
  apiKey: string;
  model?: string;
};

export class OpenAIPromptRunner implements PromptRunner {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(options: OpenAIPromptRunnerOptions) {
    this.client = new OpenAI({ apiKey: options.apiKey });
    this.model = options.model ?? "gpt-4o-mini";
  }

  async run(context: PromptExecutionContext): Promise<PromptExecutionResult> {
    const definition = getPromptDefinition(context);
    const response = await this.client.responses.create({
      model: this.model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: definition.systemPrompt
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: definition.userPrompt
            }
          ]
        }
      ]
    });

    return parseStructuredArtifact(extractResponseText(response), definition.schema);
  }
}

export type PromptRunnerFactoryOptions = {
  apiKey?: string;
  model?: string;
};

export function createPromptRunner(options: PromptRunnerFactoryOptions = {}): PromptRunner {
  if (options.apiKey && options.apiKey.trim().length > 0) {
    return new OpenAIPromptRunner({
      apiKey: options.apiKey,
      model: options.model
    });
  }

  return new StaticPromptRunner();
}
