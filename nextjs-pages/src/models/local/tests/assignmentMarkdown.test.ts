import { describe, it, expect } from "vitest";
import { LocalAssignment } from "../assignment/localAssignment";
import { AssignmentSubmissionType } from "../assignment/assignmentSubmissionType";
import { assignmentMarkdownSerializer } from "../assignment/utils/assignmentMarkdownSerializer";
import { assignmentMarkdownParser } from "../assignment/utils/assignmentMarkdownParser";

describe("AssignmentMarkdownTests", () => {
  it("can parse assignment settings", () => {
    const assignment: LocalAssignment = {
      name: "test assignment",
      description: "here is the description",
      dueAt: "08/21/2023 23:59:00",
      lockAt: "08/21/2023 23:59:00",
      submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
      localAssignmentGroupName: "Final Project",
      rubric: [
        { points: 4, label: "do task 1" },
        { points: 2, label: "do task 2" },
      ],
      allowedFileUploadExtensions: [],
    };

    const assignmentMarkdown =
      assignmentMarkdownSerializer.toMarkdown(assignment);
    const parsedAssignment =
      assignmentMarkdownParser.parseMarkdown(assignmentMarkdown);

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignment with empty rubric can be parsed", () => {
    const assignment: LocalAssignment = {
      name: "test assignment",
      description: "here is the description",
      dueAt: "08/21/2023 23:59:00",
      lockAt: "08/21/2023 23:59:00",
      submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
      localAssignmentGroupName: "Final Project",
      rubric: [],
      allowedFileUploadExtensions: [],
    };

    const assignmentMarkdown =
      assignmentMarkdownSerializer.toMarkdown(assignment);
    const parsedAssignment =
      assignmentMarkdownParser.parseMarkdown(assignmentMarkdown);

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignment with empty submission types can be parsed", () => {
    const assignment: LocalAssignment = {
      name: "test assignment",
      description: "here is the description",
      dueAt: "08/21/2023 23:59:00",
      lockAt: "08/21/2023 23:59:00",
      submissionTypes: [],
      localAssignmentGroupName: "Final Project",
      rubric: [
        { points: 4, label: "do task 1" },
        { points: 2, label: "do task 2" },
      ],
      allowedFileUploadExtensions: [],
    };

    const assignmentMarkdown =
      assignmentMarkdownSerializer.toMarkdown(assignment);
    const parsedAssignment =
      assignmentMarkdownParser.parseMarkdown(assignmentMarkdown);

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignment without lockAt date can be parsed", () => {
    const assignment: LocalAssignment = {
      name: "test assignment",
      description: "here is the description",
      dueAt: "08/21/2023 23:59:00",
      lockAt: undefined,
      submissionTypes: [],
      localAssignmentGroupName: "Final Project",
      rubric: [
        { points: 4, label: "do task 1" },
        { points: 2, label: "do task 2" },
      ],
      allowedFileUploadExtensions: [],
    };

    const assignmentMarkdown =
      assignmentMarkdownSerializer.toMarkdown(assignment);
    const parsedAssignment =
      assignmentMarkdownParser.parseMarkdown(assignmentMarkdown);

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignment without description can be parsed", () => {
    const assignment: LocalAssignment = {
      name: "test assignment",
      description: "",
      dueAt: "08/21/2023 23:59:00",
      lockAt: "08/21/2023 23:59:00",
      submissionTypes: [],
      localAssignmentGroupName: "Final Project",
      rubric: [
        { points: 4, label: "do task 1" },
        { points: 2, label: "do task 2" },
      ],
      allowedFileUploadExtensions: [],
    };

    const assignmentMarkdown =
      assignmentMarkdownSerializer.toMarkdown(assignment);
    const parsedAssignment =
      assignmentMarkdownParser.parseMarkdown(assignmentMarkdown);

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignments can have three dashes", () => {
    const assignment: LocalAssignment = {
      name: "test assignment",
      description: "test assignment\n---\nsomestuff",
      dueAt: "08/21/2023 23:59:00",
      lockAt: "08/21/2023 23:59:00",
      submissionTypes: [],
      localAssignmentGroupName: "Final Project",
      rubric: [],
      allowedFileUploadExtensions: [],
    };

    const assignmentMarkdown =
      assignmentMarkdownSerializer.toMarkdown(assignment);
    const parsedAssignment =
      assignmentMarkdownParser.parseMarkdown(assignmentMarkdown);

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignments can restrict upload types", () => {
    const assignment: LocalAssignment = {
      name: "test assignment",
      description: "here is the description",
      dueAt: "08/21/2023 23:59:00",
      lockAt: "08/21/2023 23:59:00",
      submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
      allowedFileUploadExtensions: ["pdf", "txt"],
      localAssignmentGroupName: "Final Project",
      rubric: [],
    };

    const assignmentMarkdown =
      assignmentMarkdownSerializer.toMarkdown(assignment);
    const parsedAssignment =
      assignmentMarkdownParser.parseMarkdown(assignmentMarkdown);

    expect(parsedAssignment).toEqual(assignment);
  });
});
