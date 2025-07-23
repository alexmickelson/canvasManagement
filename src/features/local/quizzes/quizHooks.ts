"use client";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { useTRPC } from "@/services/serverFunctions/trpcClient";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const useQuizQuery = (moduleName: string, quizName: string) => {
  const { courseName } = useCourseContext();
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.quiz.getQuiz.queryOptions({
      courseName,
      moduleName,
      quizName,
    })
  );
};

export const useQuizzesQueries = (moduleName: string) => {
  const { courseName } = useCourseContext();
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.quiz.getAllQuizzes.queryOptions({
      courseName,
      moduleName,
    })
  );
};

export const useUpdateQuizMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.quiz.updateQuiz.mutationOptions({
      onSuccess: (
        _,
        { courseName, moduleName, quizName, previousModuleName }
      ) => {
        if (moduleName !== previousModuleName) {
          queryClient.invalidateQueries({
            queryKey: trpc.quiz.getAllQuizzes.queryKey({
              courseName,
              moduleName: previousModuleName,
            }),
          });
        }
        queryClient.invalidateQueries({
          queryKey: trpc.quiz.getAllQuizzes.queryKey({
            courseName,
            moduleName,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.quiz.getQuiz.queryKey({
            courseName,
            moduleName,
            quizName,
          }),
        });
      },
    })
  );
};

export const useCreateQuizMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.quiz.createQuiz.mutationOptions({
      onSuccess: (_, { courseName, moduleName }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.quiz.getAllQuizzes.queryKey({
            courseName,
            moduleName,
          }),
        });
      },
    })
  );
};

export const useDeleteQuizMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.quiz.deleteQuiz.mutationOptions({
      onSuccess: (_, { courseName, moduleName, quizName }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.quiz.getAllQuizzes.queryKey({
            courseName,
            moduleName,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.quiz.getQuiz.queryKey({
            courseName,
            moduleName,
            quizName,
          }),
        });
      },
    })
  );
};
