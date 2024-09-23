import { canvasAssignmentService } from "@/services/canvas/canvasAssignmentService";
import { canvasService } from "@/services/canvas/canvasService";
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
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
  // assignment: (canvasCourseId: number, assignmentName: string) =>
  //   ["canvas", canvasCourseId, "assignment", assignmentName] as const,
};

export const useCanvasAssignmentsQuery = () => {
  const { data: settings } = useLocalCourseSettingsQuery();

  return useSuspenseQuery({
    queryKey: canvasAssignmentKeys.assignments(settings.canvasId),
    queryFn: async () => canvasAssignmentService.getAll(settings.canvasId),
  });
};

// export const useCanvasAssignmentsQuery = () => {
//   const { data: settings } = useLocalCourseSettingsQuery();
//   const { data: allAssignments } = useInnerCanvasAssignmentsQuery();

//   return useSuspenseQueries({
//     queries: allAssignments.map((a) => ({
//       queryKey: canvasAssignmentKeys.assignment(settings.canvasId, a.name),
//       queryFn: () => a,
//     })),
//     combine: (results) => ({
//       data: results.map((r) => r.data),
//       pending: results.some((r) => r.isPending),
//     }),
//   });
// };

export const useAddAssignmentToCanvasMutation = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
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
      const assignmentGroup = settings.assignmentGroups.find(
        (g) => g.name === assignment.localAssignmentGroupName
      );
      const canvasAssignmentId = await canvasAssignmentService.create(
        settings.canvasId,
        assignment,
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
  const { data: settings } = useLocalCourseSettingsQuery();
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
  const { data: settings } = useLocalCourseSettingsQuery();
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
