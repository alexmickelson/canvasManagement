import { canvasServiceUtils } from "./canvasServiceUtils";
import { axiosClient } from "../axiosUtils";
import { CanvasAssignmentGroup } from "@/models/canvas/assignments/canvasAssignmentGroup";
import { LocalAssignmentGroup } from "@/models/local/assignment/localAssignmentGroup";
import { rateLimitAwareDelete } from "./canvasWebRequestor";

const baseCanvasUrl = "https://snow.instructure.com/api/v1";

export const canvasAssignmentGroupService = {
  async getAll(courseId: number): Promise<CanvasAssignmentGroup[]> {
    console.log("Requesting assignment groups");
    const url = `${baseCanvasUrl}/courses/${courseId}/assignment_groups`;
    const assignmentGroups = await canvasServiceUtils.paginatedRequest<
      CanvasAssignmentGroup[]
    >({
      url,
    });
    return assignmentGroups.flatMap((groupList) => groupList);
  },

  async create(
    canvasCourseId: number,
    localAssignmentGroup: LocalAssignmentGroup
  ): Promise<LocalAssignmentGroup> {
    console.log(`Creating assignment group: ${localAssignmentGroup.name}`);
    const url = `${baseCanvasUrl}/courses/${canvasCourseId}/assignment_groups`;
    const body = {
      name: localAssignmentGroup.name,
      group_weight: localAssignmentGroup.weight,
    };

    const { data: canvasAssignmentGroup } =
      await axiosClient.post<CanvasAssignmentGroup>(url, body);

    return {
      ...localAssignmentGroup,
      canvasId: canvasAssignmentGroup.id,
    };
  },

  async update(
    canvasCourseId: number,
    localAssignmentGroup: LocalAssignmentGroup
  ): Promise<void> {
    console.log(`Updating assignment group: ${localAssignmentGroup.name}`);
    if (!localAssignmentGroup.canvasId) {
      throw new Error("Cannot update assignment group if canvas ID is null");
    }
    const url = `${baseCanvasUrl}/courses/${canvasCourseId}/assignment_groups/${localAssignmentGroup.canvasId}`;
    const body = {
      name: localAssignmentGroup.name,
      group_weight: localAssignmentGroup.weight,
    };

    await axiosClient.put(url, body);
  },

  async delete(
    canvasCourseId: number,
    canvasAssignmentGroupId: number
    , assignmentGroupName: string
  ): Promise<void> {
    console.log(`Deleting assignment group: ${assignmentGroupName}`);
    const url = `${baseCanvasUrl}/courses/${canvasCourseId}/assignment_groups/${canvasAssignmentGroupId}`;
    await rateLimitAwareDelete(url);
  },
};
