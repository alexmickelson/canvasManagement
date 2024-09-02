"use client"
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { localCourseKeys } from "./localCourseKeys";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";

export const usePageNamesQuery = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery({
    queryKey: localCourseKeys.pageNames(courseName, moduleName),
    queryFn: async (): Promise<string[]> => {
      const url =
        "/api/courses/" +
        encodeURIComponent(courseName) +
        "/modules/" +
        encodeURIComponent(moduleName) +
        "/pages";
      const response = await axios.get(url);
      return response.data;
    },
  });
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

function getPageQueryConfig(
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
        const response = await axios.get(url);
        return response.data;
      } catch (e) {
        console.log("error getting page", e, url);
        debugger;
        throw e;
      }
    },
  };
}
