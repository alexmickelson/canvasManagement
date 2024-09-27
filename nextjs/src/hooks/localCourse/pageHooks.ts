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

export function getAllPagesQueryConfig(courseName: string, moduleName: string) {
  return getAllItemsQueryConfig(courseName, moduleName, "Page");
}

export function getPageQueryConfig(
  courseName: string,
  moduleName: string,
  pageName: string
) {
  return getItemQueryConfig(courseName, moduleName, pageName, "Page");
}

export const usePageQuery = (moduleName: string, pageName: string) =>
  useItemQuery(moduleName, pageName, "Page");

export const usePagesQueries = (moduleName: string) =>
  useItemsQueries(moduleName, "Page");

export const useUpdatePageMutation = () => useUpdateItemMutation("Page");
export const useCreatePageMutation = () => useCreateItemMutation("Page");
export const useDeletePageMutation = () => useDeleteItemMutation("Page");
