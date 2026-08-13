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

  it("assignment with classroom50Slug can be parsed", () => {
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
      classroom50Slug: "test-assignment",
    };

    const assignmentMarkdown =
      assignmentMarkdownSerializer.toMarkdown(assignment);
    const parsedAssignment = assignmentMarkdownParser.parseMarkdown(
      assignmentMarkdown,
      name
    );

    expect(parsedAssignment.classroom50Slug).toEqual("test-assignment");
    expect(parsedAssignment).toEqual(assignment);
  });

  it("assignment without classroom50Slug can be parsed", () => {
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

    expect(parsedAssignment.classroom50Slug).toBeUndefined();
    expect(parsedAssignment).toEqual(assignment);
  });

  it("legacy github classroom header lines are ignored", () => {
    const name = "test assignment";
    const markdownWithLegacyLines = `LockAt: 08/21/2023 23:59:00
DueAt: 08/21/2023 23:59:00
AssignmentGroupName: Final Project
GithubClassroomAssignmentLink: https://classroom.github.com/old
GithubClassroomAssignmentShareLink: https://classroom.github.com/a/abc
SubmissionTypes:
- online_upload
AllowedFileUploadExtensions:
---

here is the description

## Rubric

`;
    const parsedAssignment = assignmentMarkdownParser.parseMarkdown(
      markdownWithLegacyLines,
      name
    );

    expect(parsedAssignment.classroom50Slug).toBeUndefined();
    expect(parsedAssignment.dueAt).toEqual("08/21/2023 23:59:00");
    expect(parsedAssignment.description).toEqual("here is the description");
  });
});
