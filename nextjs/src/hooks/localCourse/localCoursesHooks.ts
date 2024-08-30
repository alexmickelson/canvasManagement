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

export const useLocalCourseNamesQuery = () =>
  useSuspenseQuery({
    queryKey: localCourseKeys.allCourses,
    queryFn: async (): Promise<string[]> => {
      const url = `/api/courses`;
      const response = await axios.get(url);
      return response.data;
    },
  });

export const useLocalCourseSettingsQuery = (courseName: string) =>
  useSuspenseQuery({
    queryKey: localCourseKeys.settings(courseName),
    queryFn: async (): Promise<LocalCourseSettings> => {
      const url = `/api/courses/${courseName}/settings`;
      const response = await axios.get(url);
      return response.data;
    },
  });

export const useModuleNamesQuery = (courseName: string) =>
  useSuspenseQuery({
    queryKey: localCourseKeys.moduleNames(courseName),
    queryFn: async (): Promise<string[]> => {
      const url = `/api/courses/${courseName}/modules`;
      const response = await axios.get(url);
      return response.data;
    },
  });

export const useModuleDataQuery = (courseName: string, moduleName: string) => {
  const { data: assignmentNames } = useAssignmentNamesQuery(
    courseName,
    moduleName
  );
  const { data: quizNames } = useQuizNamesQuery(courseName, moduleName);
  const { data: pageNames } = usePageNamesQuery(courseName, moduleName);

  const { data: assignments } = useAssignmentsQueries(
    courseName,
    moduleName,
    assignmentNames
  );
  const { data: quizzes } = useQuizzesQueries(
    courseName,
    moduleName,
    quizNames
  );
  const { data: pages } = usePagesQueries(courseName, moduleName, pageNames);

  
  return {
    assignments,
    quizzes,
    pages,
  };
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
