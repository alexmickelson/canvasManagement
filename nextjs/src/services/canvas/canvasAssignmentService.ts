import { CanvasAssignment } from "@/models/canvas/assignments/canvasAssignment";
import { canvasServiceUtils } from "./canvasServiceUtils";

export const canvasAssignmentService = {
  async getAll(courseId: number): Promise<CanvasAssignment[]> {
    const url = `courses/${courseId}/assignments`;
    const assignments = await canvasServiceUtils.paginatedRequest<
      CanvasAssignment[]
    >({ url });
    return assignments.flatMap((assignments) =>
      assignments.map((a) => ({
        ...a,
        due_at: a.due_at ? new Date(a.due_at).toLocaleString() : undefined, // timezones?
        lock_at: a.lock_at ? new Date(a.lock_at).toLocaleString() : undefined, // timezones?
      }))
    );
  },
};
