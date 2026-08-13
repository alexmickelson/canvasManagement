import { describe, it, expect } from "vitest";
import { LocalAssignment } from "../assignments/models/localAssignment";
import { AssignmentSubmissionType } from "../assignments/models/assignmentSubmissionType";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import { DayOfWeek, LocalCourseSettings } from "../course/localCourseSettings";
import { getClassroomReplaceText } from "../classroom50/classroom50UrlUtils";

const testSettings = (
  classroom50?: LocalCourseSettings["classroom50"]
): LocalCourseSettings => ({
  name: "test empty course",
  assignmentGroups: [],
  daysOfWeek: [DayOfWeek.Monday, DayOfWeek.Wednesday],
  startDate: "07/09/2024 23:59:00",
  endDate: "07/09/2024 23:59:00",
  defaultDueTime: { hour: 1, minute: 59 },
  canvasId: 0,
  defaultAssignmentSubmissionTypes: [],
  defaultFileUploadTypes: [],
  holidays: [],
  assets: [],
  classroom50,
});

const testAssignment = (
  description: string,
  classroom50Slug?: string
): LocalAssignment => ({
  name: "test assignment",
  description,
  dueAt: "08/21/2023 23:59:00",
  lockAt: "08/21/2023 23:59:00",
  submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
  localAssignmentGroupName: "Final Project",
  rubric: [],
  allowedFileUploadExtensions: [],
  classroom50Slug,
});

describe("AssignmentHtmlTest", () => {
  it("classroom url token is replaced with the derived accept url", () => {
    const assignment = testAssignment(
      `here is the description
[Accept the assignment](insert_classroom_url)`,
      "my-slug"
    );
    const settings = testSettings({ org: "my-org", classroom: "my-class" });

    const html = markdownToHTMLSafe({
      markdownString: assignment.description,
      settings,
      convertImages: false,
      replaceText: getClassroomReplaceText({ assignment, settings, strict: true }),
    });

    expect(html).toContain(
      `href="https://classroom50.org/my-org/my-class/assignments/my-slug"`
    );
  });

  it("legacy github classroom token also resolves to the accept url", () => {
    const assignment = testAssignment(
      `here is the description
[Github Classroom](insert_github_classroom_url)`,
      "my-slug"
    );
    const settings = testSettings({ org: "my-org", classroom: "my-class" });

    const html = markdownToHTMLSafe({
      markdownString: assignment.description,
      settings,
      convertImages: false,
      replaceText: getClassroomReplaceText({ assignment, settings, strict: true }),
    });

    expect(html).toContain(
      `href="https://classroom50.org/my-org/my-class/assignments/my-slug"`
    );
  });

  it("a custom base url is used when configured", () => {
    const assignment = testAssignment(
      `[Accept](insert_classroom_url)`,
      "my-slug"
    );
    const settings = testSettings({
      org: "my-org",
      classroom: "my-class",
      baseUrl: "https://classroom.example.edu/",
    });

    const html = markdownToHTMLSafe({
      markdownString: assignment.description,
      settings,
      convertImages: false,
      replaceText: getClassroomReplaceText({ assignment, settings }),
    });

    expect(html).toContain(
      `href="https://classroom.example.edu/my-org/my-class/assignments/my-slug"`
    );
  });

  it("strict mode throws when the token is used without a slug", () => {
    const assignment = testAssignment(`[Accept](insert_classroom_url)`);
    const settings = testSettings({ org: "my-org", classroom: "my-class" });

    expect(() =>
      markdownToHTMLSafe({
        markdownString: assignment.description,
        settings,
        convertImages: false,
        replaceText: getClassroomReplaceText({
          assignment,
          settings,
          strict: true,
        }),
      })
    ).toThrow();
  });

  it("strict mode throws when the course has no classroom50 settings", () => {
    const assignment = testAssignment(
      `[Accept](insert_classroom_url)`,
      "my-slug"
    );
    const settings = testSettings();

    expect(() =>
      markdownToHTMLSafe({
        markdownString: assignment.description,
        settings,
        convertImages: false,
        replaceText: getClassroomReplaceText({
          assignment,
          settings,
          strict: true,
        }),
      })
    ).toThrow();
  });

  it("assignment without the token in the description does not throw", () => {
    const assignment = testAssignment(
      `here is the description without a classroom url`
    );
    const settings = testSettings();

    expect(() => {
      markdownToHTMLSafe({
        markdownString: assignment.description,
        settings,
        convertImages: false,
        replaceText: getClassroomReplaceText({
          assignment,
          settings,
          strict: true,
        }),
      });
    }).not.toThrow();
  });
});
