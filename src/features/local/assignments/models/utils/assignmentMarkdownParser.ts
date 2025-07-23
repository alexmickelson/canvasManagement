import {
  verifyDateOrThrow,
  verifyDateStringOrUndefined,
} from "../../../utils/timeUtils";
import { AssignmentSubmissionType } from "../assignmentSubmissionType";
import { LocalAssignment } from "../localAssignment";
import { RubricItem } from "../rubricItem";
import { extractLabelValue } from "./markdownUtils";

const parseFileUploadExtensions = (input: string) => {
  const allowedFileUploadExtensions: string[] = [];
  const regex = /- (.+)/;

  const words = input.split("AllowedFileUploadExtensions:");
  if (words.length < 2) return allowedFileUploadExtensions;

  const inputAfterSubmissionTypes = words[1];
  const lines = inputAfterSubmissionTypes
    .split("\n")
    .map((line) => line.trim());

  for (const line of lines) {
    const match = regex.exec(line);
    if (!match) {
      if (line === "") continue;
      else break;
    }

    allowedFileUploadExtensions.push(match[1].trim());
  }

  return allowedFileUploadExtensions;
};

const parseIndividualRubricItemMarkdown = (rawMarkdown: string) => {
  const pointsPattern = /\s*-\s*(-?\d+(?:\.\d+)?)\s*pt(s)?:/;
  const match = pointsPattern.exec(rawMarkdown);
  if (!match) {
    throw new Error(`Points not found: ${rawMarkdown}`);
  }

  const points = parseFloat(match[1]);
  const label = rawMarkdown.split(": ").slice(1).join(": ");

  const item: RubricItem = { points, label };
  return item;
};

const parseSettings = (input: string) => {
  const rawLockAt = extractLabelValue(input, "LockAt");
  const rawDueAt = extractLabelValue(input, "DueAt");
  const assignmentGroupName = extractLabelValue(input, "AssignmentGroupName");
  const submissionTypes = parseSubmissionTypes(input);
  const fileUploadExtensions = parseFileUploadExtensions(input);
  const githubClassroomAssignmentShareLink = extractLabelValue(
    input,
    "GithubClassroomAssignmentShareLink"
  );
  const githubClassroomAssignmentLink = extractLabelValue(
    input,
    "GithubClassroomAssignmentLink"
  );

  const dueAt = verifyDateOrThrow(rawDueAt, "DueAt");
  const lockAt = verifyDateStringOrUndefined(rawLockAt);

  return {
    assignmentGroupName,
    submissionTypes,
    fileUploadExtensions,
    dueAt,
    lockAt,
    githubClassroomAssignmentShareLink,
    githubClassroomAssignmentLink,
  };
};

const parseSubmissionTypes = (input: string): AssignmentSubmissionType[] => {
  const submissionTypes: AssignmentSubmissionType[] = [];
  const regex = /- (.+)/;

  const words = input.split("SubmissionTypes:");
  if (words.length < 2) return submissionTypes;

  const inputAfterSubmissionTypes = words[1]; // doesn't consider other settings that follow...
  const lines = inputAfterSubmissionTypes
    .split("\n")
    .map((line) => line.trim());

  for (const line of lines) {
    const match = regex.exec(line);
    if (!match) {
      if (line === "") continue;
      else break;
    }

    const typeString = match[1].trim();
    const type = Object.values(AssignmentSubmissionType).find(
      (t) => t === typeString
    );

    if (type) {
      submissionTypes.push(type);
    } else {
      console.warn(`Unknown submission type: ${typeString}`);
    }
  }

  return submissionTypes;
};

const parseRubricMarkdown = (rawMarkdown: string) => {
  if (!rawMarkdown.trim()) return [];

  const lines = rawMarkdown.trim().split("\n");
  return lines.map(parseIndividualRubricItemMarkdown);
};

export const assignmentMarkdownParser = {
  parseRubricMarkdown,
  parseMarkdown(input: string, name: string): LocalAssignment {
    const settingsString = input.split("---")[0];
    const {
      assignmentGroupName,
      submissionTypes,
      fileUploadExtensions,
      dueAt,
      lockAt,
      githubClassroomAssignmentShareLink,
      githubClassroomAssignmentLink,
    } = parseSettings(settingsString);

    const description = input
      .split("---\n")
      .slice(1)
      .join("---\n")
      .split("## Rubric")[0]
      .trim();

    const rubricString = input.split("## Rubric\n")[1];
    const rubric = parseRubricMarkdown(rubricString);

    const assignment: LocalAssignment = {
      name,
      localAssignmentGroupName: assignmentGroupName.trim(),
      submissionTypes: submissionTypes,
      allowedFileUploadExtensions: fileUploadExtensions,
      dueAt: dueAt,
      lockAt: lockAt,
      rubric: rubric,
      description: description,
    };
    if (githubClassroomAssignmentShareLink) {
      assignment.githubClassroomAssignmentShareLink =
        githubClassroomAssignmentShareLink;
    }
    if (githubClassroomAssignmentLink) {
      assignment.githubClassroomAssignmentLink = githubClassroomAssignmentLink;
    }
    return assignment;
  },
};
