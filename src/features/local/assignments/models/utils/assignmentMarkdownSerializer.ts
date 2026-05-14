import { AssignmentSubmissionType } from "../assignmentSubmissionType";
import { LocalAssignment } from "../localAssignment";
import { RubricItem } from "../rubricItem";

const pointsLabel = (points: number) => (points > 1 || points < -1 ? "pts" : "pt");

const assignmentRubricToMarkdown = (assignment: LocalAssignment) => {
  return assignment.rubric
    .map((item: RubricItem) => {
      const mainLine = `- ${item.points}${pointsLabel(item.points)}: ${item.label}`;
      if (!item.ratings || item.ratings.length === 0) return mainLine;
      const ratingsLines = item.ratings
        .map((r) => `  - ${r.points}${pointsLabel(r.points)}: ${r.description}`)
        .join("\n");
      return `${mainLine}\n${ratingsLines}`;
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

  const settingsMarkdownArr = [
    `LockAt: ${printableLockAt}`,
    `DueAt: ${printableDueDate}`,
    `AssignmentGroupName: ${assignment.localAssignmentGroupName}`,
    `GithubClassroomAssignmentLink: ${assignment.githubClassroomAssignmentLink ?? ""}`,
    `GithubClassroomAssignmentShareLink: ${assignment.githubClassroomAssignmentShareLink ?? ""}`,
    `SubmissionTypes:\n${submissionTypesMarkdown}`,
    `AllowedFileUploadExtensions:\n${allowedFileUploadExtensionsMarkdown}`,
  ];
  return settingsMarkdownArr.join("\n");
};

export const assignmentMarkdownSerializer = {
  toMarkdown(assignment: LocalAssignment): string {
    try {
      const settingsMarkdown = settingsToMarkdown(assignment);
      const rubricMarkdown = assignmentRubricToMarkdown(assignment);
      const assignmentMarkdown = `${settingsMarkdown}\n---\n\n${assignment.description}\n\n## Rubric\n\n${rubricMarkdown}`;

      return assignmentMarkdown;
    } catch (e) {
      console.log(assignment);
      console.log("Error converting assignment to markdown");
      throw e;
    }
  },
};
