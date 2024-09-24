"use client";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { localCourseKeys } from "./localCourseKeys";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { axiosClient } from "@/services/axiosUtils";

export function getPageNamesQueryConfig(
  courseName: string,
  moduleName: string
) {
  return {
    queryKey: localCourseKeys.pageNames(courseName, moduleName),
    queryFn: async (): Promise<string[]> => {
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/pages";
      const response = await axiosClient.get(url);
      return response.data;
    },
  };
}

export const usePageNamesQuery = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(getPageNamesQueryConfig(courseName, moduleName));
};

export const usePageQuery = (moduleName: string, pageName: string) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(getPageQueryConfig(courseName, moduleName, pageName));
};

export const usePagesQueries = (moduleName: string, pageNames: string[]) => {
  const { courseName } = useCourseContext();
  return useSuspenseQueries({
    queries: pageNames.map((name) =>
      getPageQueryConfig(courseName, moduleName, name)
    ),
    combine: (results) => ({
      data: results.map((r) => r.data),
      pending: results.some((r) => r.isPending),
    }),
  });
};

export function getPageQueryConfig(
  courseName: string,
  moduleName: string,
  pageName: string
) {
  return {
    queryKey: localCourseKeys.page(courseName, moduleName, pageName),
    queryFn: async (): Promise<LocalCoursePage> => {
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/pages/" +
        encodeURIComponent(pageName);
      try {
        const response = await axiosClient.get(url);
        return response.data;
      } catch (e) {
        console.log("error getting page", e, url);
        debugger;
        throw e;
      }
    },
  };
}

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
          queryKey: localCourseKeys.page(
            courseName,
            previousModuleName,
            previousPageName
          ),
        });
        queryClient.removeQueries({
          queryKey: localCourseKeys.pageNames(courseName, moduleName),
        });
      }
      queryClient.setQueryData(
        localCourseKeys.page(courseName, moduleName, pageName),
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
        queryKey: localCourseKeys.pageNames(courseName, moduleName),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.page(courseName, moduleName, pageName),
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
        localCourseKeys.page(courseName, moduleName, pageName),
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
        queryKey: localCourseKeys.page(courseName, moduleName, pageName),
      });
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.pageNames(courseName, moduleName),
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
        queryKey: localCourseKeys.page(courseName, moduleName, pageName),
      });
      queryClient.removeQueries({
        queryKey: localCourseKeys.pageNames(courseName, moduleName),
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
        queryKey: localCourseKeys.pageNames(courseName, moduleName),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.page(courseName, moduleName, pageName),
      });
    },
  });
};
