import { canvasApi, paginatedRequest } from "./canvasServiceUtils";
import { CanvasAssignmentGroup } from "@/features/canvas/models/assignments/canvasAssignmentGroup";
import { LocalAssignmentGroup } from "@/features/local/assignments/models/localAssignmentGroup";
import { rateLimitAwareDelete, rateLimitAwarePost } from "./canvasWebRequestUtils";
import { axiosClient } from "@/services/axiosUtils";

export const canvasAssignmentGroupService = {
  async getAll(courseId: number): Promise<CanvasAssignmentGroup[]> {
    console.log("Requesting assignment groups");
    const url = `${canvasApi}/courses/${courseId}/assignment_groups`;
    const assignmentGroups = await paginatedRequest<CanvasAssignmentGroup[]>({
      url,
    });
    return assignmentGroups.flatMap((groupList) => groupList);
  },

  async create(
    canvasCourseId: number,
    localAssignmentGroup: LocalAssignmentGroup
  ): Promise<LocalAssignmentGroup> {
    console.log(`Creating assignment group: ${localAssignmentGroup.name}`);
    const url = `${canvasApi}/courses/${canvasCourseId}/assignment_groups`;
    const body = {
      name: localAssignmentGroup.name,
      group_weight: localAssignmentGroup.weight,
    };

    const { data: canvasAssignmentGroup } =
      await rateLimitAwarePost<CanvasAssignmentGroup>(url, body);

    return {
      ...localAssignmentGroup,
      canvasId: canvasAssignmentGroup.id,
    };
  },

  async update(
    canvasCourseId: number,
    localAssignmentGroup: LocalAssignmentGroup
  ): Promise<void> {
    console.log(
      `Updating assignment group: ${localAssignmentGroup.name}, ${localAssignmentGroup.canvasId}`
    );
    if (!localAssignmentGroup.canvasId) {
      throw new Error("Cannot update assignment group if canvas ID is null");
    }
    const url = `${canvasApi}/courses/${canvasCourseId}/assignment_groups/${localAssignmentGroup.canvasId}`;
    const body = {
      name: localAssignmentGroup.name,
      group_weight: localAssignmentGroup.weight,
    };

    await axiosClient.put(url, body);
  },

  async delete(
    canvasCourseId: number,
    canvasAssignmentGroupId: number,
    assignmentGroupName: string
  ): Promise<void> {
    console.log(`Deleting assignment group: ${assignmentGroupName}`);
    const url = `${canvasApi}/courses/${canvasCourseId}/assignment_groups/${canvasAssignmentGroupId}`;
    await rateLimitAwareDelete(url);
  },
};
