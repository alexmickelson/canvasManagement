import { describe, it, expect } from "vitest";
import { LocalAssignment } from "../assignments/models/localAssignment";
import { AssignmentSubmissionType } from "../assignments/models/assignmentSubmissionType";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import { DayOfWeek, LocalCourseSettings } from "../course/localCourseSettings";

describe("AssignmentHtmlTest", () => {
  it("github classroom share link is replaced in html", () => {
    const name = "test assignment";
    const assignment: LocalAssignment = {
      name,
      description: `here is the description 
[Github Classroom](insert_github_classroom_url)`,
      dueAt: "08/21/2023 23:59:00",
      lockAt: "08/21/2023 23:59:00",
      submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
      localAssignmentGroupName: "Final Project",
      rubric: [],
      allowedFileUploadExtensions: [],
      githubClassroomAssignmentShareLink: "findme",
    };
    const settings: LocalCourseSettings = {
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
    };
    const html = markdownToHTMLSafe({
      markdownString: assignment.description,
      settings,
      convertImages: false,
      replaceText: [
        {
          source: "insert_github_classroom_url",
          destination: "findme",
        },
      ],
    });

    expect(html).toContain(`href="findme"`);
  });
});
