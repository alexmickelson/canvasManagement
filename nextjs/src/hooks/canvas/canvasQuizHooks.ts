import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocalCourseSettingsQuery } from "../localCourse/localCoursesHooks";
import { canvasQuizService } from "@/services/canvas/canvasQuizService";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import {
  useAddCanvasModuleMutation,
  useCanvasModulesQuery,
} from "./canvasModuleHooks";
import { canvasModuleService } from "@/services/canvas/canvasModuleService";

export const canvasQuizKeys = {
  quizzes: (canvasCourseId: number) =>
    ["canvas", canvasCourseId, "quizzes"] as const,
};

export const useCanvasQuizzesQuery = () => {
  const [settings] = useLocalCourseSettingsQuery();

  return useQuery({
    queryKey: canvasQuizKeys.quizzes(settings.canvasId),
    queryFn: async () => canvasQuizService.getAll(settings.canvasId),
  });
};

export const useAddQuizToCanvasMutation = () => {
  const [settings] = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();
  const { data: canvasModules } = useCanvasModulesQuery();
  const addModule = useAddCanvasModuleMutation();

  return useMutation({
    mutationFn: async ({
      quiz,
      moduleName,
    }: {
      quiz: LocalQuiz;
      moduleName: string;
    }) => {
      if (!canvasModules) {
        console.log("cannot add quiz until modules loaded");
        return;
      }
      const assignmentGroup = settings.assignmentGroups.find(
        (g) => g.name === quiz.localAssignmentGroupName
      );
      const canvasQuizId = await canvasQuizService.create(
        settings.canvasId,
        quiz,
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
        quiz.name,
        "Quiz",
        canvasQuizId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasQuizKeys.quizzes(settings.canvasId),
      });
    },
  });
};

export const useDeleteQuizFromCanvasMutation = () => {
  const [settings] = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (canvasQuizId: number) => {
      await canvasQuizService.delete(settings.canvasId, canvasQuizId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: canvasQuizKeys.quizzes(settings.canvasId),
      });
    },
  });
};
