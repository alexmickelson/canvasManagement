import { AssignmentSubmissionType } from "./assignmentSubmissionType";
import { RubricItem } from "./rubricItem";

export interface LocalAssignment {
  name: string;
  description: string;
  lockAt?: string; // ISO 8601 date string
  dueAt: string; // ISO 8601 date string
  localAssignmentGroupName?: string;
  submissionTypes: AssignmentSubmissionType[];
  allowedFileUploadExtensions: string[];
  rubric: RubricItem[];
}
