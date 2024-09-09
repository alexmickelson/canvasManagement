"use client";
import { LocalCourseSettings } from "@/models/local/localCourse";
import {
  useQueries,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { localCourseKeys } from "./localCourseKeys";
import {
  getAssignmentNamesQueryConfig,
  getAssignmentQueryConfig,
  useAssignmentNamesQuery,
  useAssignmentsQueries,
} from "./assignmentHooks";
import { getPageNamesQueryConfig, getPageQueryConfig, usePageNamesQuery, usePagesQueries } from "./pageHooks";
import { getQuizNamesQueryConfig, getQuizQueryConfig, useQuizNamesQuery, useQuizzesQueries } from "./quizHooks";
import { useMemo } from "react";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";

export const useLocalCourseNamesQuery = () =>
  useSuspenseQuery({
    queryKey: localCourseKeys.allCourses,
    queryFn: async (): Promise<string[]> => {
      const url = `/api/courses`;
      const response = await axios.get(url);
      return response.data;
    },
  });

export const useLocalCourseSettingsQuery = () => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery({
    queryKey: localCourseKeys.settings(courseName),
    queryFn: async (): Promise<LocalCourseSettings> => {
      const url = `/api/courses/${courseName}/settings`;
      const response = await axios.get(url);
      return response.data;
    },
  });
};

export const useModuleNamesQuery = () => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery({
    queryKey: localCourseKeys.moduleNames(courseName),
    queryFn: async (): Promise<string[]> => {
      const url = `/api/courses/${courseName}/modules`;
      const response = await axios.get(url);
      return response.data;
    },
  });
};

// dangerous? really slowed down page...
// maybe it only slowed down with react query devtools...
export const useModuleDataQuery = (moduleName: string) => {
  console.log("running");
  const { data: assignmentNames } = useAssignmentNamesQuery(moduleName);
  const { data: quizNames } = useQuizNamesQuery(moduleName);
  const { data: pageNames } = usePageNamesQuery(moduleName);

  const { data: assignments } = useAssignmentsQueries(
    moduleName,
    assignmentNames
  );
  const { data: quizzes } = useQuizzesQueries(moduleName, quizNames);
  const { data: pages } = usePagesQueries(moduleName, pageNames);

  return {
    assignments,
    quizzes,
    pages,
  };
  // return useMemo(
  //   () => ({
  //     assignments,
  //     quizzes,
  //     pages,
  //   }),
  //   [assignments, pages, quizzes]
  // );
};

export const useAllCourseDataQuery = () => {
  const { courseName } = useCourseContext();
  const { data: moduleNames } = useModuleNamesQuery();

  const { data: assignmentNamesAndModules } = useSuspenseQueries({
    queries: moduleNames.map((moduleName) =>
      getAssignmentNamesQueryConfig(courseName, moduleName)
    ),
    combine: (results) => ({
      data: results.flatMap((r, i) =>
        r.data.map((assignmentName) => ({
          moduleName: moduleNames[i],
          assignmentName,
        }))
      ),
      pending: results.some((r) => r.isPending),
    }),
  });

  const { data: assignmentsAndModules } = useSuspenseQueries({
    queries: assignmentNamesAndModules.map(
      ({ moduleName, assignmentName }, i) =>
        getAssignmentQueryConfig(courseName, moduleName, assignmentName)
    ),
    combine: (results) => ({
      data: results.flatMap((r, i) => ({
        moduleName: assignmentNamesAndModules[i].moduleName,
        assignment: r.data,
      })),
      pending: results.some((r) => r.isPending),
    }),
  });

  const {data: quizNamesAndModules } = useSuspenseQueries({
    queries: moduleNames.map((moduleName) =>
      getQuizNamesQueryConfig(courseName, moduleName)
    ),
    combine: (results) => ({
      data: results.flatMap((r, i) =>
        r.data.map((quizName) => ({
          moduleName: moduleNames[i],
          quizName: quizName,
        }))
      ),
      pending: results.some((r) => r.isPending),
    }),
  });

  const { data: quizzesAndModules } = useSuspenseQueries({
    queries: quizNamesAndModules.map(
      ({ moduleName, quizName }, i) =>
        getQuizQueryConfig(courseName, moduleName, quizName)
    ),
    combine: (results) => ({
      data: results.flatMap((r, i) => ({
        moduleName: quizNamesAndModules[i].moduleName,
        quiz: r.data,
      })),
      pending: results.some((r) => r.isPending),
    }),
  });

  const {data: pageNamesAndModules } = useSuspenseQueries({
    queries: moduleNames.map((moduleName) =>
      getPageNamesQueryConfig(courseName, moduleName)
    ),
    combine: (results) => ({
      data: results.flatMap((r, i) =>
        r.data.map((pageName) => ({
          moduleName: moduleNames[i],
          pageName,
        }))
      ),
      pending: results.some((r) => r.isPending),
    }),
  });

  const { data: pagesAndModules } = useSuspenseQueries({
    queries: pageNamesAndModules.map(
      ({ moduleName, pageName }, i) =>
        getPageQueryConfig(courseName, moduleName, pageName)
    ),
    combine: (results) => ({
      data: results.flatMap((r, i) => ({
        moduleName: pageNamesAndModules[i].moduleName,
        page: r.data,
      })),
      pending: results.some((r) => r.isPending),
    }),
  });


  return {  assignmentsAndModules, quizzesAndModules, pagesAndModules };
};

// export const useUpdateCourseMutation = (courseName: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (body: {
//       updatedCourse: LocalCourse;
//       previousCourse: LocalCourse;
//     }) => {
//       const url = `/api/courses/${courseName}`;
//       await axios.put(url, body);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: localCourseKeys.settings(courseName),
//       });
//     },
//     scope: {
//       id: "all courses",
//     },
//   });
// };
