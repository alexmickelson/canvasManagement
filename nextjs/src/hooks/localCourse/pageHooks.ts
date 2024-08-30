import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { localCourseKeys } from "./localCoursesHooks";

export const usePageNamesQuery = (courseName: string, moduleName: string) =>
  useSuspenseQuery({
    queryKey: localCourseKeys.modulePageNames(courseName, moduleName),
    queryFn: async (): Promise<string[]> => {
      const url = `/api/courses/${courseName}/modules/${moduleName}/pages`;
      const response = await axios.get(url);
      return response.data;
    },
  });
export const usePageQuery = (
  courseName: string,
  moduleName: string,
  pageName: string
) => useSuspenseQuery(getPageQueryConfig(courseName, moduleName, pageName));

export const usePagesQueries = (
  courseName: string,
  moduleName: string,
  pageNames: string[]
) =>
  useSuspenseQueries({
    queries: pageNames.map((name) =>
      getPageQueryConfig(courseName, moduleName, name)
    ),
    combine: (results) => ({
      data: results.map((r) => r.data),
      pending: results.some((r) => r.isPending),
    }),
  });

function getPageQueryConfig(
  courseName: string,
  moduleName: string,
  pageName: string
) {
  return {
    queryKey: localCourseKeys.quiz(courseName, moduleName, pageName),
    queryFn: async (): Promise<LocalCoursePage> => {
      const url = `/api/courses/${courseName}/modules/${moduleName}/pages/${pageName}`;
      const response = await axios.get(url);
      return response.data;
    },
  };
}
