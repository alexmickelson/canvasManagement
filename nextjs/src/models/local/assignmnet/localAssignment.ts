import { AssignmentSubmissionType } from "./assignmentSubmissionType";
import { RubricItem } from "./rubricItem";

export interface LocalAssignment {
  name: string;
  description: string;
  lockAt?: string; // 21/08/2023 23:59:00
  dueAt: string; // 21/08/2023 23:59:00
  localAssignmentGroupName?: string;
  submissionTypes: AssignmentSubmissionType[];
  allowedFileUploadExtensions: string[];
  rubric: RubricItem[];
}
