import { CanvasAssignmentGroup } from "@/features/canvas/models/assignments/canvasAssignmentGroup";
import { CanvasCourseModel } from "@/features/canvas/models/courses/canvasCourseModel";
import { LocalAssignmentGroup } from "@/features/local/assignments/models/localAssignmentGroup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LocalCourseSettings } from "@/features/local/course/localCourseSettings";
import { useUpdateLocalCourseSettingsMutation } from "@/features/local/course/localCoursesHooks";
import { canvasAssignmentGroupService } from "../services/canvasAssignmentGroupService";
import { canvasService } from "../services/canvasService";

export const canvasCourseKeys = {
  courseDetails: (canavasId: number) =>
    ["canvas", canavasId, "course details"] as const,
  assignmentGroups: (canavasId: number) =>
    ["canvas", canavasId, "assignment groups"] as const,
  courseListInTerm: (canvasTermId: number | undefined) =>
    ["canvas courses in term", canvasTermId] as const,
  students: (canvasId: number) =>
    ["students in canvas course", canvasId] as const,
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
              const groupWithCanvasId = {
                ...group,
                canvasId: canvasGroup.id,
              };
              if (canvasGroup.group_weight !== group.weight) {
                await canvasAssignmentGroupService.update(
                  canvasId,
                  groupWithCanvasId
                );
              }
              return groupWithCanvasId;
            }
          }
        )
      );

      const updatedSettings: LocalCourseSettings = {
        ...settings,
        assignmentGroups: updatedGroups,
      };

      await updateSettingsMutation.mutateAsync({ settings: updatedSettings });
      return updatedSettings;
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

export const useCourseStudentsQuery = (canvasId: number) =>
  useQuery({
    queryKey: canvasCourseKeys.students(canvasId),
    queryFn: async () => await canvasService.getEnrolledStudents(canvasId),
  });
