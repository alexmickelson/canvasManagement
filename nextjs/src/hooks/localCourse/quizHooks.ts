"use client";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { localCourseKeys } from "./localCourseKeys";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { axiosClient } from "@/services/axiosUtils";
import {
  getAllItemsQueryConfig,
  getItemQueryConfig,
  useItemQuery,
  useItemsQueries,
  useUpdateItemMutation,
} from "./courseItemHooks";

export function getAllQuizzesQueryConfig(
  courseName: string,
  moduleName: string
) {
  return getAllItemsQueryConfig(courseName, moduleName, "Quiz");
}

export function getQuizQueryConfig(
  courseName: string,
  moduleName: string,
  quizName: string
) {
  return getItemQueryConfig(courseName, moduleName, quizName, "Quiz");
}

export const useQuizQuery = (moduleName: string, quizName: string) =>
  useItemQuery(moduleName, quizName, "Quiz");

export const useQuizzesQueries = (moduleName: string) =>
  useItemsQueries(moduleName, "Quiz");

export const useUpdateQuizMutation = () => useUpdateItemMutation("Quiz")

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
