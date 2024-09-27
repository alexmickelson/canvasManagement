"use client";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
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

export const useUpdatePageMutation = () => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      page,
      moduleName,
      pageName,
      previousModuleName,
      previousPageName,
    }: {
      page: LocalCoursePage;
      moduleName: string;
      pageName: string;
      previousModuleName: string;
      previousPageName: string;
    }) => {
      if (
        previousPageName &&
        previousModuleName &&
        (previousPageName !== page.name || previousModuleName !== moduleName)
      ) {
        queryClient.removeQueries({
          queryKey: localCourseKeys.itemOfType(
            courseName,
            previousModuleName,
            previousPageName,
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
      }
      queryClient.setQueryData(
        localCourseKeys.itemOfType(courseName, moduleName, pageName, "Page"),
        page
      );
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/pages/" +
        encodeURIComponent(pageName);
      await axiosClient.put(url, {
        page,
        previousModuleName,
        previousPageName,
      });
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

export const useCreatePageMutation = () => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      page,
      moduleName,
      pageName,
    }: {
      page: LocalCoursePage;
      moduleName: string;
      pageName: string;
    }) => {
      queryClient.setQueryData(
        localCourseKeys.itemOfType(courseName, moduleName, pageName, "Page"),
        page
      );
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/pages/" +
        encodeURIComponent(pageName);
      await axiosClient.post(url, page);
    },
    onSuccess: (_, { moduleName, pageName }) => {
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(
          courseName,
          moduleName,
          pageName,
          "Page"
        ),
      });
      queryClient.invalidateQueries({
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
