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

export const canvasAssignmentKeys = {
  assignments: (canvasCourseId: number) =>
    ["canvas", canvasCourseId, "assignments"] as const,
  assignment: (canvasCourseId: number, assignmentName: string) =>
    ["canvas", canvasCourseId, "assignment", assignmentName] as const,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmnet: LocalAssignment) => {
      const assignmentGroup = settings.assignmentGroups.find(
        (g) => g.name === assignmnet.localAssignmentGroupName
      );
      await canvasAssignmentService.create(
        settings.canvasId,
        assignmnet,
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
