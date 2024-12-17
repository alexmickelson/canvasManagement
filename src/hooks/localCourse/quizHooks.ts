"use client";

import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { trpc } from "@/services/serverFunctions/trpcClient";

export const useQuizQuery = (moduleName: string, quizName: string) => {
  const { courseName } = useCourseContext();
  return trpc.quiz.getQuiz.useSuspenseQuery({
    courseName,
    moduleName,
    quizName,
  });
};

export const useQuizzesQueries = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return trpc.quiz.getAllQuizzes.useSuspenseQuery({
    courseName,
    moduleName,
  });
};

export const useUpdateQuizMutation = () => {
  const utils = trpc.useUtils();
  return trpc.quiz.updateQuiz.useMutation({
    onSuccess: (
      _,
      { courseName, moduleName, quizName, previousModuleName }
    ) => {
      if (moduleName !== previousModuleName)
        utils.quiz.getAllQuizzes.invalidate({
          courseName,
          moduleName: previousModuleName,
        },
        { refetchType: "all" });
      utils.quiz.getAllQuizzes.invalidate({ courseName, moduleName },
        { refetchType: "all" });
      utils.quiz.getQuiz.invalidate({ courseName, moduleName, quizName });
    },
  });
};
export const useCreateQuizMutation = () => {
  const utils = trpc.useUtils();
  return trpc.quiz.createQuiz.useMutation({
    onSuccess: (_, { courseName, moduleName }) => {
      utils.quiz.getAllQuizzes.invalidate({ courseName, moduleName });
    },
  });
};
export const useDeleteQuizMutation = () => {
  const utils = trpc.useUtils();
  return trpc.quiz.deleteQuiz.useMutation({
    onSuccess: (_, { courseName, moduleName, quizName }) => {
      utils.quiz.getAllQuizzes.invalidate(
        { courseName, moduleName },
        { refetchType: "all" }
      );
      utils.quiz.getQuiz.invalidate({ courseName, moduleName, quizName });
    },
  });
};
