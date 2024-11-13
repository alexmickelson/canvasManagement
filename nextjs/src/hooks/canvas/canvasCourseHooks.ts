import { CanvasAssignmentGroup } from "@/models/canvas/assignments/canvasAssignmentGroup";
import { CanvasCourseModel } from "@/models/canvas/courses/canvasCourseModel";
import { LocalAssignmentGroup } from "@/models/local/assignment/localAssignmentGroup";
import { canvasAssignmentGroupService } from "@/services/canvas/canvasAssignmentGroupService";
import { canvasService } from "@/services/canvas/canvasService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const canvasCourseKeys = {
  courseDetails: (canavasId: number) =>
    ["canvas", canavasId, "course details"] as const,
  assignmentGroups: (canavasId: number) =>
    ["canvas", canavasId, "assignment groups"] as const,
  courseListInTerm: (canvasTermId: number | undefined) =>
    ["canvas courses in term", canvasTermId] as const,
};

export const useCourseListInTermQuery = (canvasTermId: number | undefined) =>
  useQuery({
    queryKey: canvasCourseKeys.courseListInTerm(canvasTermId),
    queryFn: async (): Promise<CanvasCourseModel[]> =>
      canvasTermId ? await canvasService.getCourses(canvasTermId) : [],
    enabled: !!canvasTermId,
  });

// export const useCanvasCourseQuery = (canvasId: number) =>
//   useQuery({
//     queryKey: canvasCourseKeys.courseDetails(canvasId),
//     queryFn: async () => await canvasService.getCourse(canvasId),
//   });

export const useSetAssignmentGroupsMutation = (canvasId: number) => {
  const { data: canvasAssignmentGroups } = useAssignmentGroupsQuery(canvasId);
  return useMutation({
    mutationFn: async (localAssignmentGroups: LocalAssignmentGroup[]) => {
      if (!canvasAssignmentGroups) return;

      const localNames = localAssignmentGroups.map((g) => g.name);
      const groupsToDelete = canvasAssignmentGroups.filter(
        (c: CanvasAssignmentGroup) => !localNames.includes(c.name)
      );
      await Promise.all([
        ...groupsToDelete.map(
          async (g: CanvasAssignmentGroup) =>
            await canvasAssignmentGroupService.delete(canvasId, g.id, g.name)
        ),
        ...localAssignmentGroups.map(async (group) => {
          const canvasGroup = canvasAssignmentGroups.find(
            (c: CanvasAssignmentGroup) => c.name === group.name
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
  return useQuery({
    queryKey: canvasCourseKeys.assignmentGroups(canvasId),
    queryFn: async (): Promise<CanvasAssignmentGroup[]> => await canvasAssignmentGroupService.getAll(canvasId),
  });
};
