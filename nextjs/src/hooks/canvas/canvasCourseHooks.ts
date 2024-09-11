import { LocalAssignmentGroup } from "@/models/local/assignment/localAssignmentGroup";
import { canvasAssignmentGroupService } from "@/services/canvas/canvasAssignmentGroupService";
import { canvasService } from "@/services/canvas/canvasService";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

export const canvasCourseKeys = {
  courseDetails: (canavasId: number) =>
    ["canvas", canavasId, "course details"] as const,
  assignmentGroups: (canavasId: number) =>
    ["canvas", canavasId, "assignment groups"] as const,
};

export const useCanvasCourseQuery = (canvasId: number) =>
  useSuspenseQuery({
    queryKey: canvasCourseKeys.courseDetails(canvasId),
    queryFn: async () => await canvasService.getCourse(canvasId),
  });

export const useSetAssignmentGroupsMutation = (canvasId: number) => {
  const { data: canvasAssignmentGroups } = useAssignmentGroupsQuery(canvasId);
  return useMutation({
    mutationFn: async (localAssignmentGroups: LocalAssignmentGroup[]) => {
      const localNames = localAssignmentGroups.map((g) => g.name);
      const groupsToDelete = canvasAssignmentGroups.filter(
        (c) => !localNames.includes(c.name)
      );
      await Promise.all([
        ...groupsToDelete.map(
          async (g) =>
            await canvasAssignmentGroupService.delete(canvasId, g.id, g.name)
        ),
        ...localAssignmentGroups.map(async (group) => {
          const canvasGroup = canvasAssignmentGroups.find(
            (c) => c.name === group.name
          );
          if (!canvasGroup) {
            await canvasAssignmentGroupService.create(canvasId, group);
          } else {
            if (canvasGroup.group_weight !== group.weight)
              await canvasAssignmentGroupService.update(canvasId, group);
          }
        }),
      ]);
    },
  });
};

export const useAssignmentGroupsQuery = (canvasId: number) => {
  return useSuspenseQuery({
    queryKey: canvasCourseKeys.assignmentGroups(canvasId),
    queryFn: async () => await canvasAssignmentGroupService.getAll(canvasId),
  });
};
