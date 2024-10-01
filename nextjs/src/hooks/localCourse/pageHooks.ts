"use client";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useItemQuery,
  useItemsQueries,
  useUpdateItemMutation,
} from "./courseItemHooks";

export const usePageQuery = (moduleName: string, pageName: string) =>
  useItemQuery(moduleName, pageName, "Page");

export const usePagesQueries = (moduleName: string) =>
  useItemsQueries(moduleName, "Page");

export const useUpdatePageMutation = () => useUpdateItemMutation("Page");
export const useCreatePageMutation = () => useCreateItemMutation("Page");
export const useDeletePageMutation = () => useDeleteItemMutation("Page");
