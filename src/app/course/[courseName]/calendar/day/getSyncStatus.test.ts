import { describe, it, expect } from "vitest";
import { getSyncStatus } from "./getAssignmentSyncStatus";
import { LocalAssignment } from "@/features/local/assignments/models/localAssignment";
import { CanvasAssignment } from "@/features/canvas/models/assignments/canvasAssignment";
import { AssignmentSubmissionType } from "@/features/local/assignments/models/assignmentSubmissionType";
import {
  DayOfWeek,
  LocalCourseSettings,
} from "@/features/local/course/localCourseSettings";

const baseSettings: LocalCourseSettings = {
  name: "test course",
  assignmentGroups: [],
  daysOfWeek: [DayOfWeek.Monday, DayOfWeek.Wednesday],
  startDate: "01/01/2024 00:00:00",
  endDate: "05/01/2024 00:00:00",
  defaultDueTime: { hour: 23, minute: 59 },
  canvasId: 100,
  defaultAssignmentSubmissionTypes: [],
  defaultFileUploadTypes: [],
  holidays: [],
  assets: [],
};

const baseLocalAssignment: LocalAssignment = {
  name: "Test Assignment",
  description: "hello world",
  dueAt: "08/21/2023 23:59:00",
  submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
  rubric: [],
  allowedFileUploadExtensions: [],
};

const baseCanvasAssignment: CanvasAssignment = {
  id: 1,
  name: "Test Assignment",
  description: "<p>hello world</p>",
  created_at: "2023-08-01T00:00:00Z",
  has_overrides: false,
  course_id: 100,
  html_url: "",
  submissions_download_url: "",
  assignment_group_id: 0,
  due_date_required: false,
  max_name_length: 255,
  peer_reviews: false,
  automatic_peer_reviews: false,
  position: 1,
  grading_type: "points",
  published: true,
  unpublishable: false,
  only_visible_to_overrides: false,
  locked_for_user: false,
  moderated_grading: false,
  grader_count: 0,
  allowed_attempts: -1,
  is_quiz_assignment: false,
  submission_types: ["online_upload"],
  due_at: "08/21/2023 23:59:00",
};

describe("getSyncStatus - assignment", () => {
  it("returns localOnly when no canvas item", () => {
    const result = getSyncStatus({
      item: baseLocalAssignment,
      canvasItem: undefined,
      type: "assignment",
      settings: baseSettings,
    });
    expect(result.status).toBe("localOnly");
  });

  it("returns incomplete when not published", () => {
    const result = getSyncStatus({
      item: baseLocalAssignment,
      canvasItem: { ...baseCanvasAssignment, published: false },
      type: "assignment",
      settings: baseSettings,
    });
    expect(result.status).toBe("incomplete");
    expect(result.message).toContain("not published");
  });

  it("returns incomplete when due date missing in canvas", () => {
    const result = getSyncStatus({
      item: baseLocalAssignment,
      canvasItem: { ...baseCanvasAssignment, due_at: undefined },
      type: "assignment",
      settings: baseSettings,
    });
    expect(result.status).toBe("incomplete");
    expect(result.message).toContain("due date");
  });

  it("returns incomplete when lock date missing in canvas but set locally", () => {
    const result = getSyncStatus({
      item: { ...baseLocalAssignment, lockAt: "08/21/2023 23:59:00" },
      canvasItem: { ...baseCanvasAssignment, lock_at: undefined },
      type: "assignment",
      settings: baseSettings,
    });
    expect(result.status).toBe("incomplete");
    expect(result.message).toContain("lock date");
  });

  it("returns incomplete when assignment group differs", () => {
    const settings: LocalCourseSettings = {
      ...baseSettings,
      assignmentGroups: [
        { id: "group-1", name: "Homework", weight: 30, canvasId: 42 },
      ],
    };
    const result = getSyncStatus({
      item: {
        ...baseLocalAssignment,
        localAssignmentGroupName: "Homework",
      },
      canvasItem: {
        ...baseCanvasAssignment,
        assignment_group_id: 99, // different from canvasId 42
      },
      type: "assignment",
      settings,
    });
    expect(result.status).toBe("incomplete");
    expect(result.message).toBe("assignment group is different");
  });

  it("returns published when assignment groups match", () => {
    const settings: LocalCourseSettings = {
      ...baseSettings,
      assignmentGroups: [
        { id: "group-1", name: "Homework", weight: 30, canvasId: 42 },
      ],
    };
    const result = getSyncStatus({
      item: {
        ...baseLocalAssignment,
        localAssignmentGroupName: "Homework",
      },
      canvasItem: {
        ...baseCanvasAssignment,
        assignment_group_id: 42,
      },
      type: "assignment",
      settings,
    });
    expect(result.status).toBe("published");
  });

  it("returns published when assignment group has no canvasId", () => {
    const settings: LocalCourseSettings = {
      ...baseSettings,
      assignmentGroups: [
        { id: "group-1", name: "Homework", weight: 30 }, // no canvasId
      ],
    };
    const result = getSyncStatus({
      item: {
        ...baseLocalAssignment,
        localAssignmentGroupName: "Homework",
      },
      canvasItem: {
        ...baseCanvasAssignment,
        assignment_group_id: 99,
      },
      type: "assignment",
      settings,
    });
    expect(result.status).toBe("published");
  });

  it("returns published when local assignment group name is unset", () => {
    const result = getSyncStatus({
      item: baseLocalAssignment,
      canvasItem: baseCanvasAssignment,
      type: "assignment",
      settings: baseSettings,
    });
    expect(result.status).toBe("published");
  });
});
