export type PrintTemplate = {
  id: string;
  artifactType: string;
  description: string;
};

const templates: PrintTemplate[] = [
  {
    id: "worksheet-standard-v1",
    artifactType: "worksheet",
    description: "Primary printable worksheet template matching the ASAD design system."
  },
  {
    id: "teacher-notes-v1",
    artifactType: "teacher_notes",
    description: "Teacher notes print template."
  }
];

export function getTemplateCatalog(): PrintTemplate[] {
  return templates;
}
