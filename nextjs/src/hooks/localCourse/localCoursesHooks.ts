"use client";
import { LocalCourseSettings } from "@/models/local/localCourse";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { localCourseKeys } from "./localCourseKeys";
import {
  useAssignmentNamesQuery,
  useAssignmentsQueries,
} from "./assignmentHooks";
import { usePageNamesQuery, usePagesQueries } from "./pageHooks";
import { useQuizNamesQuery, useQuizzesQueries } from "./quizHooks";
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
// export const useModuleDataQuery = (moduleName: string) => {
//   console.log("running");
//   const { data: assignmentNames } = useAssignmentNamesQuery(moduleName);
//   const { data: quizNames } = useQuizNamesQuery(moduleName);
//   const { data: pageNames } = usePageNamesQuery(moduleName);

//   const { data: assignments } = useAssignmentsQueries(
//     moduleName,
//     assignmentNames
//   );
//   const { data: quizzes } = useQuizzesQueries(moduleName, quizNames);
//   const { data: pages } = usePagesQueries(moduleName, pageNames);

//   return {
//     assignments,
//     quizzes,
//     pages,
//   };
//   // return useMemo(
//   //   () => ({
//   //     assignments,
//   //     quizzes,
//   //     pages,
//   //   }),
//   //   [assignments, pages, quizzes]
//   // );
// };

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
