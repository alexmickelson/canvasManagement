import { CanvasAssignmentGroup } from "@/models/canvas/assignments/canvasAssignmentGroup";
import { CanvasCourseModel } from "@/models/canvas/courses/canvasCourseModel";
import { LocalAssignmentGroup } from "@/models/local/assignment/localAssignmentGroup";
import { LocalCourseSettings } from "@/models/local/localCourseSettings";
import { canvasAssignmentGroupService } from "@/services/canvas/canvasAssignmentGroupService";
import { canvasService } from "@/services/canvas/canvasService";
import { trpc } from "@/services/trpc/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUpdateLocalCourseSettingsMutation } from "../localCourse/localCoursesHooks";

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

export const useSetAssignmentGroupsMutation = (canvasId: number) => {
  const updateSettingsMutation = useUpdateLocalCourseSettingsMutation();
  const { data: canvasAssignmentGroups } = useAssignmentGroupsQuery(canvasId);
  return useMutation({
    mutationFn: async (settings: LocalCourseSettings) => {
      if (typeof canvasAssignmentGroups === "undefined") {
        console.log("cannot apply groups if no groups loaded");
        return;
      }
      const localAssignmentGroups = settings.assignmentGroups;

      const localNames = localAssignmentGroups.map((g) => g.name);
      const groupsToDelete = canvasAssignmentGroups.filter(
        (c: CanvasAssignmentGroup) => !localNames.includes(c.name)
      );
      console.log("updating canvas groups", groupsToDelete);
      await Promise.all(
        groupsToDelete.map(
          async (g: CanvasAssignmentGroup) =>
            await canvasAssignmentGroupService.delete(canvasId, g.id, g.name)
        )
      );
      const updatedGroups = await Promise.all(
        localAssignmentGroups.map(
          async (group): Promise<LocalAssignmentGroup> => {
            const canvasGroup = canvasAssignmentGroups.find(
              (c: CanvasAssignmentGroup) => c.name === group.name
            );
            if (!canvasGroup) {
              const newGroup = await canvasAssignmentGroupService.create(
                canvasId,
                group
              );
              return {
                ...group,
                canvasId: newGroup.canvasId,
              };
            } else {
              if (canvasGroup.group_weight !== group.weight) {
                await canvasAssignmentGroupService.update(canvasId, group);
              }
              return {
                ...group,
                canvasId: canvasGroup.id,
              };
            }
          }
        )
      );

      const updatedSettings: LocalCourseSettings = {
        ...settings,
        assignmentGroups: updatedGroups,
      };
      console.log(
        "finished updating canvas assignment groups, updating settings of file system",
        updatedSettings
      );
      await updateSettingsMutation.mutateAsync({ settings: updatedSettings });
    },
  });
};

export const useAssignmentGroupsQuery = (canvasId: number) => {
  return useQuery({
    queryKey: canvasCourseKeys.assignmentGroups(canvasId),
    queryFn: async (): Promise<CanvasAssignmentGroup[]> =>
      await canvasAssignmentGroupService.getAll(canvasId),
  });
};
