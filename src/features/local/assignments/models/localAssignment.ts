import { IModuleItem } from "../../modules/IModuleItem";
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
  classroom50Slug?: string;
}

export const zodLocalAssignment = z.object({
  name: z.string(),
  description: z.string(),
  lockAt: z
    .string()
    .optional()
    .describe("Date and time when the assignment locks (MM/DD/YYYY HH:MM:SS)"),
  dueAt: z.string().describe("Due date and time (MM/DD/YYYY HH:MM:SS)"),
  localAssignmentGroupName: z.string().optional(),
  submissionTypes: zodAssignmentSubmissionType.array(),
  allowedFileUploadExtensions: z.string().array(),
  rubric: zodRubricItem.array(),
  classroom50Slug: z
    .string()
    .optional()
    .describe(
      "Classroom 50 assignment slug; the student accept URL is derived from course classroom50 settings + this slug"
    ),
});

export const localAssignmentMarkdown = {
  parseMarkdown: assignmentMarkdownParser.parseMarkdown,
  toMarkdown: assignmentMarkdownSerializer.toMarkdown,
};
