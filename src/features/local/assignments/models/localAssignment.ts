import { IModuleItem } from "../../../../models/local/IModuleItem";
import {
  AssignmentSubmissionType,
  zodAssignmentSubmissionType,
} from "./assignmentSubmissionType";
import { RubricItem, zodRubricItem } from "./rubricItem";
import { assignmentMarkdownParser } from "./utils/assignmentMarkdownParser";
import { assignmentMarkdownSerializer } from "./utils/assignmentMarkdownSerializer";
import { z } from "zod";

export interface LocalAssignment extends IModuleItem {
  name: string;
  description: string;
  lockAt?: string; // 08/21/2023 23:59:00
  dueAt: string; // 08/21/2023 23:59:00
  localAssignmentGroupName?: string;
  submissionTypes: AssignmentSubmissionType[];
  allowedFileUploadExtensions: string[];
  rubric: RubricItem[];
  githubClassroomAssignmentShareLink?: string;
  githubClassroomAssignmentLink?: string;
}

export const zodLocalAssignment = z.object({
  name: z.string(),
  description: z.string(),
  lockAt: z.string().optional(),
  dueAt: z.string(),
  localAssignmentGroupName: z.string().optional(),
  submissionTypes: zodAssignmentSubmissionType.array(),
  allowedFileUploadExtensions: z.string().array(),
  rubric: zodRubricItem.array(),
  githubClassroomAssignmentShareLink: z.string().optional(),
  githubClassroomAssignmentLink: z.string().optional(),
});

export const localAssignmentMarkdown = {
  parseMarkdown: assignmentMarkdownParser.parseMarkdown,
  toMarkdown: assignmentMarkdownSerializer.toMarkdown,
};
