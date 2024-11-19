import { canvasAssignmentService } from "@/services/canvas/canvasAssignmentService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalCourseSettingsQuery } from "../localCourse/localCoursesHooks";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { canvasModuleService } from "@/services/canvas/canvasModuleService";
import {
  useAddCanvasModuleMutation,
  useCanvasModulesQuery,
} from "./canvasModuleHooks";

export const canvasAssignmentKeys = {
  assignments: (canvasCourseId: number) =>
    ["canvas", canvasCourseId, "assignments"] as const,
};

export const useCanvasAssignmentsQuery = () => {
  const [settings] = useLocalCourseSettingsQuery();

  return useQuery({
    queryKey: canvasAssignmentKeys.assignments(settings.canvasId),
    queryFn: async () => canvasAssignmentService.getAll(settings.canvasId),
  });
};


export const useAddAssignmentToCanvasMutation = () => {
  const [settings] = useLocalCourseSettingsQuery();
  const { data: canvasModules } = useCanvasModulesQuery();
  const addModule = useAddCanvasModuleMutation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assignment,
      moduleName,
    }: {
      assignment: LocalAssignment;
      moduleName: string;
    }) => {
      if (!canvasModules) {
        console.log("cannot add assignment until modules loaded");
        return;
      }

      const assignmentGroup = settings.assignmentGroups.find(
        (g) => g.name === assignment.localAssignmentGroupName
      );

      const canvasAssignmentId = await canvasAssignmentService.create(
        settings.canvasId,
        assignment,
        settings,
        assignmentGroup?.canvasId
      );
      const canvasModule = canvasModules.find((c) => c.name === moduleName);
      const moduleId = canvasModule
        ? canvasModule.id
        : await addModule.mutateAsync(moduleName);

      await canvasModuleService.createModuleItem(
        settings.canvasId,
        moduleId,
        assignment.name,
        "Assignment",
        canvasAssignmentId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasAssignmentKeys.assignments(settings.canvasId),
      });
    },
  });
};

export const useUpdateAssignmentInCanvasMutation = () => {
  const [settings] = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assignment,
      canvasAssignmentId,
    }: {
      assignment: LocalAssignment;
      canvasAssignmentId: number;
    }) => {
      const assignmentGroup = settings.assignmentGroups.find(
        (g) => g.name === assignment.localAssignmentGroupName
      );
      await canvasAssignmentService.update(
        settings.canvasId,
        canvasAssignmentId,
        assignment,
        settings,
        assignmentGroup?.canvasId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasAssignmentKeys.assignments(settings.canvasId),
      });
    },
  });
};

export const useDeleteAssignmentFromCanvasMutation = () => {
  const [settings] = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      canvasAssignmentId,
      assignmentName,
    }: {
      canvasAssignmentId: number;
      assignmentName: string;
    }) => {
      await canvasAssignmentService.delete(
        settings.canvasId,
        canvasAssignmentId,
        assignmentName
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasAssignmentKeys.assignments(settings.canvasId),
      });
    },
  });
};
