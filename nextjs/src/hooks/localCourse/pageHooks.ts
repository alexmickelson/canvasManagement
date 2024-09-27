"use client";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { localCourseKeys } from "./localCourseKeys";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { axiosClient } from "@/services/axiosUtils";
import {
  getAllItemsQueryConfig,
  getItemQueryConfig,
  useCreateItemMutation,
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

export const useDeletePageMutation = () => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      moduleName,
      pageName,
    }: {
      moduleName: string;
      pageName: string;
    }) => {
      queryClient.removeQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          pageName,
          "Page"
        ),
      });
      queryClient.removeQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          pageName,
          "Page"
        ),
      });
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/pages/" +
        encodeURIComponent(pageName);
      await axiosClient.delete(url);
    },
    onSuccess: async (_, { moduleName, pageName }) => {
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          pageName,
          "Page"
        ),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          pageName,
          "Page"
        ),
      });
    },
  });
};
