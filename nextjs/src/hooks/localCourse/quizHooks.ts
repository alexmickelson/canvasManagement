"use client";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { localCourseKeys } from "./localCourseKeys";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { axiosClient } from "@/services/axiosUtils";

export function getAllQuizzesQueryConfig(
  courseName: string,
  moduleName: string
) {
  return {
    queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, "Quiz"),
    queryFn: async (): Promise<LocalQuiz[]> => {
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/quizzes";
      const response = await axiosClient.get(url);
      return response.data;
    },
  };
}

export const useQuizQuery = (moduleName: string, quizName: string) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(getQuizQueryConfig(courseName, moduleName, quizName));
};

const useAllQuizzesQuery = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(getAllQuizzesQueryConfig(courseName, moduleName));
};
export const useQuizzesQueries = (moduleName: string) => {
  const { courseName } = useCourseContext();
  const { data: allQuizzes } = useAllQuizzesQuery(moduleName);
  return useSuspenseQueries({
    queries: allQuizzes.map((quiz) => ({
      ...getQuizQueryConfig(courseName, moduleName, quiz.name),
      queryFn: () => quiz,
    })),
    combine: (results) => ({
      data: results.map((r) => r.data),
      pending: results.some((r) => r.isPending),
    }),
  });
};

export function getQuizQueryConfig(
  courseName: string,
  moduleName: string,
  quizName: string
) {
  return {
    queryKey: localCourseKeys.itemOfType(
      courseName,
      moduleName,
      quizName,
      "Quiz"
    ),
    queryFn: async (): Promise<LocalQuiz> => {
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/quizzes/" +
        encodeURIComponent(quizName);
      const response = await axiosClient.get(url);
      return response.data;
    },
  };
}

export const useUpdateQuizMutation = () => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      quiz,
      moduleName,
      quizName,
      previousModuleName,
      previousQuizName,
    }: {
      quiz: LocalQuiz;
      moduleName: string;
      quizName: string;
      previousModuleName: string;
      previousQuizName: string;
    }) => {
      if (
        previousQuizName &&
        previousModuleName &&
        (previousQuizName !== quiz.name || previousModuleName !== moduleName)
      ) {
        queryClient.removeQueries({
          queryKey: localCourseKeys.itemOfType(
            courseName,
            previousModuleName,
            previousQuizName,
            "Quiz"
          ),
        });
        queryClient.removeQueries({
          queryKey: localCourseKeys.allItemsOfType(
            courseName,
            previousModuleName,
            "Quiz"
          ),
        });
      }
      queryClient.setQueryData(
        localCourseKeys.itemOfType(courseName, moduleName, quizName, "Quiz"),
        quiz
      );
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/quizzes/" +
        encodeURIComponent(quizName);
      await axiosClient.put(url, {
        quiz,
        previousModuleName,
        previousQuizName,
      });

      // queryClient.fetchQuery(
      //   getQuizNamesQueryConfig(courseName, previousModuleName)
      // );
    },
    onSuccess: async (_, { moduleName, quizName }) => {
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.allItemsOfType(
          courseName,
          moduleName,
          "Quiz"
        ),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          quizName,
          "Quiz"
        ),
      });
    },
  });
};

export const useCreateQuizMutation = () => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      quiz,
      moduleName,
      quizName,
    }: {
      quiz: LocalQuiz;
      moduleName: string;
      quizName: string;
    }) => {
      queryClient.setQueryData(
        localCourseKeys.itemOfType(courseName, moduleName, quizName, "Quiz"),
        quiz
      );
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/quizzes/" +
        encodeURIComponent(quizName);
      await axiosClient.post(url, quiz);
    },
    onSuccess: async (_, { moduleName, quizName }) => {
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.allItemsOfType(
          courseName,
          moduleName,
          "Quiz"
        ),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          quizName,
          "Quiz"
        ),
      });
    },
  });
};

export const useDeleteQuizMutation = () => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      moduleName,
      quizName,
    }: {
      moduleName: string;
      quizName: string;
    }) => {
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/quizzes/" +
        encodeURIComponent(quizName);
      await axiosClient.delete(url);
      queryClient.removeQueries({
        queryKey: localCourseKeys.allItemsOfType(
          courseName,
          moduleName,
          "Quiz"
        ),
      });
    },
    onSuccess: async (_, { moduleName, quizName }) => {
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.allItemsOfType(
          courseName,
          moduleName,
          "Quiz"
        ),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          quizName,
          "Quiz"
        ),
      });
    },
  });
};
