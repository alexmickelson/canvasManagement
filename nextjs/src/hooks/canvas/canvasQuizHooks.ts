import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useLocalCourseSettingsQuery } from "../localCourse/localCoursesHooks";
import { canvasQuizService } from "@/services/canvas/canvasQuizService";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";

export const canvasQuizKeys = {
  quizzes: (canvasCourseId: number) => ["canvas", canvasCourseId, "quizzes"],
};

export const useCanvasQuizzesQuery = () => {
  const { data: settings } = useLocalCourseSettingsQuery();

  return useSuspenseQuery({
    queryKey: canvasQuizKeys.quizzes(settings.canvasId),
    queryFn: async () => canvasQuizService.getAll(settings.canvasId),
  });
};

export const useAddQuizToCanvasMutation = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quiz: LocalQuiz) => {
      const assignmentGroup = settings.assignmentGroups.find(
        (g) => g.name === quiz.localAssignmentGroupName
      );
      console.log("starting");
      await canvasQuizService.create(
        settings.canvasId,
        quiz,
        assignmentGroup?.canvasId
      );
      console.log("ending");
    },
    onSuccess: () => {
      console.log("invalidating");
      queryClient.invalidateQueries({
        queryKey: canvasQuizKeys.quizzes(settings.canvasId),
      });
    },
  });
};

export const useDeleteQuizFromCanvasMutation = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
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
