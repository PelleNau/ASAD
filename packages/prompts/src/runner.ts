import type {
  MaterialArtifactType,
  StoryRecord,
  TeacherNotesArtifact,
  WorksheetArtifact
} from "@asad/schemas";

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
            teacherIntent: "Kontrollerar grundlaggande forstaelse av huvudperson."
          },
          {
            id: "q2",
            prompt: "Hur kanner sig huvudpersonen i borjan av berattelsen?",
            skillType: "inference",
            answerFormat: "short_text",
            teacherIntent: "Tranar elevens formaga att tolka kanslor i text."
          },
          {
            id: "q3",
            prompt: "Vad tycker du ar viktigt i berattelsen, och varfor?",
            skillType: "reflection",
            answerFormat: "long_text",
            teacherIntent: "Oppnar for egen tolkning och resonemang."
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

export class StaticPromptRunner implements PromptRunner {
  async run(context: PromptExecutionContext): Promise<PromptExecutionResult> {
    switch (context.artifactType) {
      case "worksheet":
      case "answer_sheet":
        return buildWorksheetFromStory(context.story);
      case "teacher_notes":
        return buildTeacherNotesFromStory(context.story);
      default:
        throw new Error(`StaticPromptRunner does not yet support artifact type: ${context.artifactType}`);
    }
  }
}
