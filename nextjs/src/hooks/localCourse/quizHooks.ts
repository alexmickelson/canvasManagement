"use client";
import {
  getAllItemsQueryConfig,
  getItemQueryConfig,
  useCreateItemMutation,
  useDeleteItemMutation,
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

export const useCreateQuizMutation = () => useCreateItemMutation("Quiz")

export const useDeleteQuizMutation = () =>
  useDeleteItemMutation("Quiz");