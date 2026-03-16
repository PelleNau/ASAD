import type { MaterialArtifactType } from "@asad/schemas";

export type PromptFamily = {
  key: string;
  purpose: string;
  artifactTypes: MaterialArtifactType[];
};

const promptFamilies: PromptFamily[] = [
  {
    key: "ASAD_SAGA_MATERIAL_GENERATOR",
    purpose: "Top-level orchestration of story material generation.",
    artifactTypes: ["worksheet", "teacher_notes", "vocabulary_sheet", "discussion_guide", "curriculum_alignment", "answer_sheet"]
  },
  {
    key: "ASAD_WORKSHEET_FORMAT_STANDARD",
    purpose: "Defines the semantic structure for worksheet outputs.",
    artifactTypes: ["worksheet", "answer_sheet"]
  },
  {
    key: "ASAD_LEVEL_DIFFERENTIATION",
    purpose: "Produces differentiated worksheet variants from the same story.",
    artifactTypes: ["worksheet", "answer_sheet"]
  },
  {
    key: "ASAD_VOCABULARY_EXTRACTOR",
    purpose: "Extracts and structures teachable vocabulary.",
    artifactTypes: ["vocabulary_sheet"]
  },
  {
    key: "ASAD_DISCUSSION_GUIDE",
    purpose: "Generates oral discussion materials and prompts.",
    artifactTypes: ["discussion_guide"]
  },
  {
    key: "ASAD_TEACHER_NOTES_GENERATOR",
    purpose: "Generates teacher-facing notes and lesson guidance.",
    artifactTypes: ["teacher_notes"]
  },
  {
    key: "ASAD_CURRICULUM_ALIGNMENT",
    purpose: "Maps generated materials to curriculum targets.",
    artifactTypes: ["curriculum_alignment"]
  }
];

export function getPromptFamilyCatalog(): PromptFamily[] {
  return promptFamilies;
}

export function getPromptFamilyForArtifact(artifactType: MaterialArtifactType): PromptFamily {
  const match = promptFamilies.find((family) => family.artifactTypes.includes(artifactType));

  if (!match) {
    throw new Error(`No prompt family registered for artifact type: ${artifactType}`);
  }

  return match;
}

