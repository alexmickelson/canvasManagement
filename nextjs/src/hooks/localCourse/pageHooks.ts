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

export function getAllPagesQueryConfig(courseName: string, moduleName: string) {
  return {
    queryKey: localCourseKeys.allItemsOfType(courseName, moduleName, "Page"),
    queryFn: async (): Promise<LocalCoursePage[]> => {
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

export function getPageQueryConfig(
  courseName: string,
  moduleName: string,
  pageName: string
) {
  return {
    queryKey: localCourseKeys.itemOfType(courseName, moduleName, pageName, "Page"),
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
        throw e;
      }
    },
  };
}

export const usePageQuery = (moduleName: string, pageName: string) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(getPageQueryConfig(courseName, moduleName, pageName));
};

const useAllPagesQuery = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(getAllPagesQueryConfig(courseName, moduleName));
};

export const usePagesQueries = (moduleName: string) => {
  const { courseName } = useCourseContext();
  const { data: allPages } = useAllPagesQuery(moduleName);
  return useSuspenseQueries({
    queries: allPages.map((page) => ({
      ...getPageQueryConfig(courseName, moduleName, page.name),
      queryFn: () => page,
    })),
    combine: (results) => ({
      data: results.map((r) => r.data),
      pending: results.some((r) => r.isPending),
    }),
  });
};

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
          queryKey: localCourseKeys.itemOfType(courseName, moduleName, pageName, "Page"),
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
        queryKey: localCourseKeys.itemOfType(courseName, moduleName, pageName, "Page"),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(courseName, moduleName, pageName, "Page"),
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
        queryKey: localCourseKeys.itemOfType(courseName, moduleName, pageName, "Page"),
      });
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(courseName, moduleName, pageName, "Page"),
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
        queryKey: localCourseKeys.itemOfType(courseName, moduleName, pageName, "Page"),
      });
      queryClient.removeQueries({
        queryKey: localCourseKeys.itemOfType(courseName, moduleName, pageName, "Page"),
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
        queryKey: localCourseKeys.itemOfType(courseName, moduleName, pageName, "Page"),
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.itemOfType(courseName, moduleName, pageName, "Page"),
      });
    },
  });
};
