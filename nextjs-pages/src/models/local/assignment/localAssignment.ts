import { IModuleItem } from "../IModuleItem";
import { AssignmentSubmissionType } from "./assignmentSubmissionType";
import { RubricItem } from "./rubricItem";
import { assignmentMarkdownParser } from "./utils/assignmentMarkdownParser";
import { assignmentMarkdownSerializer } from "./utils/assignmentMarkdownSerializer";

export interface LocalAssignment extends IModuleItem {
  name: string;
  description: string;
  lockAt?: string; // 08/21/2023 23:59:00
  dueAt: string; // 08/21/2023 23:59:00
  localAssignmentGroupName?: string;
  submissionTypes: AssignmentSubmissionType[];
  allowedFileUploadExtensions: string[];
  rubric: RubricItem[];
}

export const localAssignmentMarkdown = {
  parseMarkdown: assignmentMarkdownParser.parseMarkdown,
  toMarkdown: assignmentMarkdownSerializer.toMarkdown,
};
