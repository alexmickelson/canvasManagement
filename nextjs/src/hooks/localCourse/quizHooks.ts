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

export function getQuizNamesQueryConfig(
  courseName: string,
  moduleName: string
) {
  return {
    queryKey: localCourseKeys.quizNames(courseName, moduleName),
    queryFn: async (): Promise<string[]> => {
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
export const useQuizNamesQuery = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(getQuizNamesQueryConfig(courseName, moduleName));
};

export const useQuizQuery = (moduleName: string, quizName: string) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(getQuizQueryConfig(courseName, moduleName, quizName));
};

export const useQuizzesQueries = (moduleName: string, quizNames: string[]) => {
  const { courseName } = useCourseContext();
  return useSuspenseQueries({
    queries: quizNames.map((name) =>
      getQuizQueryConfig(courseName, moduleName, name)
    ),
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
    queryKey: localCourseKeys.quiz(courseName, moduleName, quizName),
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
          queryKey: localCourseKeys.quiz(
            courseName,
            previousModuleName,
            previousQuizName
          ),
        });
        queryClient.removeQueries({
          queryKey: localCourseKeys.quizNames(courseName, previousModuleName),
        });
      }
      queryClient.setQueryData(
        localCourseKeys.quiz(courseName, moduleName, quizName),
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
        queryKey: localCourseKeys.quizNames(courseName, moduleName),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.quiz(courseName, moduleName, quizName),
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
        localCourseKeys.quiz(courseName, moduleName, quizName),
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
        queryKey: localCourseKeys.quizNames(courseName, moduleName),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.quiz(courseName, moduleName, quizName),
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
        queryKey: localCourseKeys.quizNames(courseName, moduleName),
      });
    },
    onSuccess: async (_, { moduleName, quizName }) => {
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.quizNames(courseName, moduleName),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.quiz(courseName, moduleName, quizName),
      });
    },
  });
};
