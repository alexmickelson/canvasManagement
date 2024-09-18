import { CanvasAssignment } from "@/models/canvas/assignments/canvasAssignment";
import { canvasApi, canvasServiceUtils } from "./canvasServiceUtils";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { axiosClient } from "../axiosUtils";
import { markdownToHTMLSafe } from "../htmlMarkdownUtils";
import { CanvasRubricCreationResponse } from "@/models/canvas/assignments/canvasRubricCreationResponse";
import { assignmentPoints } from "@/models/local/assignment/utils/assignmentPointsUtils";

const createRubric = async (
  courseId: number,
  assignmentCanvasId: number,
  localAssignment: LocalAssignment
) => {
  const criterion = localAssignment.rubric.map((rubricItem, i) => ({
    description: rubricItem.label,
    points: rubricItem.points,
    ratings: [
      { description: "Full Marks", points: rubricItem.points },
      { description: "No Marks", points: 0 },
    ],
  }));

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
    assignment: { points_possible: assignmentPoints(localAssignment) },
  };

  await axiosClient.put(
    assignmentPointAdjustmentUrl,
    assignmentPointAdjustmentBody
  );
};

export const canvasAssignmentService = {
  async getAll(courseId: number): Promise<CanvasAssignment[]> {
    const url = `${canvasApi}/courses/${courseId}/assignments`;
    const { data: assignments } = await axiosClient.get<CanvasAssignment[]>(
      url
    );
    return assignments.map((a) => ({
      ...a,
      due_at: a.due_at ? new Date(a.due_at).toLocaleString() : undefined, // timezones?
      lock_at: a.lock_at ? new Date(a.lock_at).toLocaleString() : undefined, // timezones?
    }));
  },

  async create(
    canvasCourseId: number,
    localAssignment: LocalAssignment,
    canvasAssignmentGroupId?: number
  ) {
    console.log(`Creating assignment: ${localAssignment.name}`);
    const url = `${canvasApi}/courses/${canvasCourseId}/assignments`;
    const body = {
      name: localAssignment.name,
      submission_types: localAssignment.submissionTypes.map((t) =>
        t.toString()
      ),
      allowed_extensions: localAssignment.allowedFileUploadExtensions.map((e) =>
        e.toString()
      ),
      description: markdownToHTMLSafe(localAssignment.description),
      due_at: localAssignment.dueAt,
      lock_at: localAssignment.lockAt,
      points_possible: assignmentPoints(localAssignment),
      assignment_group_id: canvasAssignmentGroupId,
    };

    const response = await axiosClient.post<CanvasAssignment>(url, body);
    const canvasAssignment = response.data;

    if (!canvasAssignment) throw new Error("Created Canvas assignment is null");

    await createRubric(canvasCourseId, canvasAssignment.id, localAssignment);

    return canvasAssignment.id;
  },

  async update(
    courseId: number,
    canvasAssignmentId: number,
    localAssignment: LocalAssignment,
    canvasAssignmentGroupId?: number
  ) {
    console.log(`Updating assignment: ${localAssignment.name}`);
    const url = `${canvasApi}/courses/${courseId}/assignments/${canvasAssignmentId}`;
    const body = {
      name: localAssignment.name,
      submission_types: localAssignment.submissionTypes.map((t) =>
        t.toString()
      ),
      allowed_extensions: localAssignment.allowedFileUploadExtensions.map((e) =>
        e.toString()
      ),
      description: markdownToHTMLSafe(localAssignment.description),
      due_at: localAssignment.dueAt,
      lock_at: localAssignment.lockAt,
      points_possible: assignmentPoints(localAssignment),
      assignment_group_id: canvasAssignmentGroupId,
    };

    await axiosClient.put(url, body);
    await createRubric(courseId, canvasAssignmentId, localAssignment);
  },

  async delete(
    courseId: number,
    assignmentCanvasId: number,
    assignmentName: string
  ): Promise<void> {
    console.log(`Deleting assignment from Canvas: ${assignmentName}`);
    const url = `${canvasApi}/courses/${courseId}/assignments/${assignmentCanvasId}`;
    const response = await axiosClient.delete(url);

    if (!response.status.toString().startsWith("2")) {
      console.error(`Failed to delete assignment: ${assignmentName}`);
      throw new Error("Failed to delete assignment");
    }
  },
};
