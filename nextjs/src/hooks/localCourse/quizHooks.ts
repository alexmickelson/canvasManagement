import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { localCourseKeys } from "./localCourseKeys";

export const useQuizNamesQuery = (courseName: string, moduleName: string) =>
  useSuspenseQuery({
    queryKey: localCourseKeys.quizNames(courseName, moduleName),
    queryFn: async (): Promise<string[]> => {
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/quizzes";
      const response = await axios.get(url);
      return response.data;
    },
  });

export const useQuizQuery = (
  courseName: string,
  moduleName: string,
  quizName: string
) => useSuspenseQuery(getQuizQueryConfig(courseName, moduleName, quizName));

export const useQuizzesQueries = (
  courseName: string,
  moduleName: string,
  quizNames: string[]
) =>
  useSuspenseQueries({
    queries: quizNames.map((name) =>
      getQuizQueryConfig(courseName, moduleName, name)
    ),
    combine: (results) => ({
      data: results.map((r) => r.data),
      pending: results.some((r) => r.isPending),
    }),
  });

function getQuizQueryConfig(
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
      const response = await axios.get(url);
      return response.data;
    },
  };
}

export const useUpdateQuizMutation = (courseName: string) => {
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
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/quizzes/" +
        encodeURIComponent(quizName);
      await axios.put(url, quiz);
    },
    onSuccess: (_, { moduleName, quizName }) => {
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.quiz(courseName, moduleName, quizName),
      });
      // queryClient.invalidateQueries({
      //   queryKey: localCourseKeys.quizNames(courseName, moduleName),
      // });
    },
  });
};
