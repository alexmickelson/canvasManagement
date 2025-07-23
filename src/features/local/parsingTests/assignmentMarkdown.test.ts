import { describe, it, expect } from "vitest";
import { LocalAssignment } from "../assignments/models/localAssignment";
import { AssignmentSubmissionType } from "../assignments/models/assignmentSubmissionType";
import { assignmentMarkdownSerializer } from "../assignments/models/utils/assignmentMarkdownSerializer";
import { assignmentMarkdownParser } from "../assignments/models/utils/assignmentMarkdownParser";

describe("AssignmentMarkdownTests", () => {
  it("can parse assignment settings", () => {
    const name = "test assignment";
    const assignment: LocalAssignment = {
      name,
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
    const parsedAssignment = assignmentMarkdownParser.parseMarkdown(
      assignmentMarkdown,
      name
    );

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignment with empty rubric can be parsed", () => {
    const name = "test assignment";
    const assignment: LocalAssignment = {
      name,
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
    const parsedAssignment = assignmentMarkdownParser.parseMarkdown(
      assignmentMarkdown,
      name
    );

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignment with empty submission types can be parsed", () => {
    const name = "test assignment";
    const assignment: LocalAssignment = {
      name,
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
    const parsedAssignment = assignmentMarkdownParser.parseMarkdown(
      assignmentMarkdown,
      name
    );

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignment without lockAt date can be parsed", () => {
    const name = "test assignment";
    const assignment: LocalAssignment = {
      name,
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
    const parsedAssignment = assignmentMarkdownParser.parseMarkdown(
      assignmentMarkdown,
      name
    );

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignment without description can be parsed", () => {
    const name = "test assignment";
    const assignment: LocalAssignment = {
      name,
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
    const parsedAssignment = assignmentMarkdownParser.parseMarkdown(
      assignmentMarkdown,
      name
    );

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignments can have three dashes", () => {
    const name = "test assignment";
    const assignment: LocalAssignment = {
      name,
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
    const parsedAssignment = assignmentMarkdownParser.parseMarkdown(
      assignmentMarkdown,
      name
    );

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignments can restrict upload types", () => {
    const name = "test assignment";
    const assignment: LocalAssignment = {
      name,
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
    const parsedAssignment = assignmentMarkdownParser.parseMarkdown(
      assignmentMarkdown,
      name
    );

    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignment with githubClassroomAssignmentShareLink and githubClassroomAssignmentLink can be parsed", () => {
    const name = "test assignment";
    const assignment: LocalAssignment = {
      name,
      description: "here is the description",
      dueAt: "08/21/2023 23:59:00",
      lockAt: "08/21/2023 23:59:00",
      submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
      localAssignmentGroupName: "Final Project",
      rubric: [],
      allowedFileUploadExtensions: [],
      githubClassroomAssignmentShareLink: "https://github.com/share-link",
      githubClassroomAssignmentLink: "https://github.com/assignment-link",
    };

    const assignmentMarkdown =
      assignmentMarkdownSerializer.toMarkdown(assignment);
    const parsedAssignment = assignmentMarkdownParser.parseMarkdown(
      assignmentMarkdown,
      name
    );

    expect(parsedAssignment.githubClassroomAssignmentShareLink).toEqual(
      "https://github.com/share-link"
    );
    expect(parsedAssignment.githubClassroomAssignmentLink).toEqual(
      "https://github.com/assignment-link"
    );
    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignment without githubClassroomAssignmentShareLink and githubClassroomAssignmentLink can be parsed", () => {
    const name = "test assignment";
    const assignment: LocalAssignment = {
      name,
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
    const parsedAssignment = assignmentMarkdownParser.parseMarkdown(
      assignmentMarkdown,
      name
    );

    expect(parsedAssignment.githubClassroomAssignmentShareLink).toBeUndefined();
    expect(parsedAssignment.githubClassroomAssignmentLink).toBeUndefined();
    expect(parsedAssignment).toEqual(assignment);
  });
});
