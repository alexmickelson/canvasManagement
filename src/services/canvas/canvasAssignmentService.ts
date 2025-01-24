import { CanvasAssignment } from "@/models/canvas/assignments/canvasAssignment";
import { canvasApi, paginatedRequest } from "./canvasServiceUtils";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { axiosClient } from "../axiosUtils";
import { markdownToHTMLSafe } from "../htmlMarkdownUtils";
import { CanvasRubricCreationResponse } from "@/models/canvas/assignments/canvasRubricCreationResponse";
import { assignmentPoints } from "@/models/local/assignment/utils/assignmentPointsUtils";
import { getDateFromString } from "@/models/local/utils/timeUtils";
import { getRubricCriterion } from "./canvasRubricUtils";
import { LocalCourseSettings } from "@/models/local/localCourseSettings";

export const canvasAssignmentService = {
  async getAll(courseId: number): Promise<CanvasAssignment[]> {
    console.log("getting canvas assignments");
    const url = `${canvasApi}/courses/${courseId}/assignments`; //per_page=100
    const assignments = await paginatedRequest<CanvasAssignment[]>({ url });
    return assignments.map((a) => ({
      ...a,
      due_at: a.due_at ? new Date(a.due_at).toLocaleString() : undefined, // timezones?
      lock_at: a.lock_at ? new Date(a.lock_at).toLocaleString() : undefined, // timezones?
    }));
  },

  async create(
    canvasCourseId: number,
    localAssignment: LocalAssignment,
    settings: LocalCourseSettings,
    canvasAssignmentGroupId?: number
  ) {
    console.log(`Creating assignment: ${localAssignment.name}`);
    const url = `${canvasApi}/courses/${canvasCourseId}/assignments`;
    const content = markdownToHTMLSafe(localAssignment.description, settings);
    const body = {
      assignment: {
        name: localAssignment.name,
        submission_types: localAssignment.submissionTypes.map((t) =>
          t.toString()
        ),
        allowed_extensions: localAssignment.allowedFileUploadExtensions.map(
          (e) => e.toString()
        ),
        description: content,
        due_at: getDateFromString(localAssignment.dueAt)?.toISOString(),
        lock_at:
          localAssignment.lockAt &&
          getDateFromString(localAssignment.lockAt)?.toISOString(),
        points_possible: assignmentPoints(localAssignment.rubric),
        assignment_group_id: canvasAssignmentGroupId,
      },
    };

    const response = await axiosClient.post<CanvasAssignment>(url, body);
    const canvasAssignment = response.data;

    await createRubric(canvasCourseId, canvasAssignment.id, localAssignment);

    return canvasAssignment.id;
  },

  async update(
    courseId: number,
    canvasAssignmentId: number,
    localAssignment: LocalAssignment,
    settings: LocalCourseSettings,
    canvasAssignmentGroupId?: number
  ) {
    console.log(`Updating assignment: ${localAssignment.name}`);
    const url = `${canvasApi}/courses/${courseId}/assignments/${canvasAssignmentId}`;
    const body = {
      assignment: {
        name: localAssignment.name,
        submission_types: localAssignment.submissionTypes.map((t) =>
          t.toString()
        ),
        allowed_extensions: localAssignment.allowedFileUploadExtensions.map(
          (e) => e.toString()
        ),
        description: markdownToHTMLSafe(localAssignment.description, settings),
        due_at: getDateFromString(localAssignment.dueAt)?.toISOString(),
        lock_at:
          localAssignment.lockAt &&
          getDateFromString(localAssignment.lockAt)?.toISOString(),
        points_possible: assignmentPoints(localAssignment.rubric),
        assignment_group_id: canvasAssignmentGroupId,
      },
    };

    await axiosClient.put(url, body);
    await createRubric(courseId, canvasAssignmentId, localAssignment);
  },

  async delete(
    courseId: number,
    assignmentCanvasId: number,
    assignmentName: string
  ) {
    console.log(`Deleting assignment from Canvas: ${assignmentName}`);
    const url = `${canvasApi}/courses/${courseId}/assignments/${assignmentCanvasId}`;
    const response = await axiosClient.delete(url);

    if (!response.status.toString().startsWith("2")) {
      console.error(`Failed to delete assignment: ${assignmentName}`);
      throw new Error("Failed to delete assignment");
    }
  },
};

const createRubric = async (
  courseId: number,
  assignmentCanvasId: number,
  localAssignment: LocalAssignment
) => {
  const criterion = getRubricCriterion(localAssignment.rubric);

  const rubricBody = {
    rubric_association_id: assignmentCanvasId,
    rubric: {
      title: `Rubric for Assignment: ${localAssignment.name}`,
      association_id: assignmentCanvasId,
      association_type: "Assignment",
      use_for_grading: true,
      criteria: criterion,
    },
    rubric_association: {
      association_id: assignmentCanvasId,
      association_type: "Assignment",
      purpose: "grading",
      use_for_grading: true,
    },
  };

  const rubricUrl = `${canvasApi}/courses/${courseId}/rubrics`;
  const rubricResponse = await axiosClient.post<CanvasRubricCreationResponse>(
    rubricUrl,
    rubricBody
  );

  if (!rubricResponse.data) throw new Error("Failed to create rubric");

  const assignmentPointAdjustmentUrl = `${canvasApi}/courses/${courseId}/assignments/${assignmentCanvasId}`;
  const assignmentPointAdjustmentBody = {
    assignment: { points_possible: assignmentPoints(localAssignment.rubric) },
  };

  await axiosClient.put(
    assignmentPointAdjustmentUrl,
    assignmentPointAdjustmentBody
  );
};
