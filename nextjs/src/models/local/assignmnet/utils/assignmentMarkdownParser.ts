import { AssignmentSubmissionType } from "../assignmentSubmissionType";
import { LocalAssignment } from "../localAssignment";
import { RubricItem } from "../rubricItem";

const assignmentRubricToMarkdown = (assignment: LocalAssignment) => {
  return assignment.rubric
    .map((item: RubricItem) => {
      const pointLabel = item.points > 1 ? "pts" : "pt";
      return `- ${item.points}${pointLabel}: ${item.label}`;
    })
    .join("\n");
};

const settingsToMarkdown = (assignment: LocalAssignment) => {
  const printableDueDate = assignment.dueAt.toString().replace("\u202F", " ");
  const printableLockAt =
    assignment.lockAt?.toString().replace("\u202F", " ") || "";

  const submissionTypesMarkdown = assignment.submissionTypes
    .map((submissionType: AssignmentSubmissionType) => `- ${submissionType}`)
    .join("\n");

  const allowedFileUploadExtensionsMarkdown =
    assignment.allowedFileUploadExtensions
      .map((fileExtension: string) => `- ${fileExtension}`)
      .join("\n");

  const settingsMarkdown = [
    `Name: ${assignment.name}`,
    `LockAt: ${printableLockAt}`,
    `DueAt: ${printableDueDate}`,
    `AssignmentGroupName: ${assignment.localAssignmentGroupName}`,
    `SubmissionTypes:\n${submissionTypesMarkdown}`,
    `AllowedFileUploadExtensions:\n${allowedFileUploadExtensionsMarkdown}`,
  ].join("\n");

  return settingsMarkdown;
};

export const assignmentMarkdownStringifier = {
  toMarkdown(assignment: LocalAssignment): string {
    const settingsMarkdown = settingsToMarkdown(assignment);
    const rubricMarkdown = assignmentRubricToMarkdown(assignment);
    const assignmentMarkdown = `${settingsMarkdown}\n---\n\n${assignment.description}\n\n## Rubric\n\n${rubricMarkdown}`;

    return assignmentMarkdown;
  },
};
