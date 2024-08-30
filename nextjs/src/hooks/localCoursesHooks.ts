import { LocalAssignment } from "@/models/local/assignmnet/localAssignment";
import { LocalCourse, LocalCourseSettings } from "@/models/local/localCourse";
import { LocalModule } from "@/models/local/localModules";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import axios from "axios";

export const localCourseKeys = {
  allCourses: ["all courses"] as const,
  settings: (courseName: string) =>
    ["course details", courseName, "settings"] as const,
  moduleNames: (courseName: string) =>
    [
      "course details",
      courseName,
      "modules",
      { type: "names" } as const,
    ] as const,
  moduleAssignmentNames: (courseName: string, moduleName: string) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "assignments",
    ] as const,
  moduleQuizzeNames: (courseName: string, moduleName: string) =>
    ["course details", courseName, "modules", moduleName, "quizzes"] as const,
  modulePageNames: (courseName: string, moduleName: string) =>
    ["course details", courseName, "modules", moduleName, "pages"] as const,
  assignment: (
    courseName: string,
    moduleName: string,
    assignmentName: string
  ) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "assignments",
      assignmentName,
    ] as const,
  quiz: (courseName: string, moduleName: string, quizName: string) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "quizzes",
      quizName,
    ] as const,
  page: (courseName: string, moduleName: string, pageName: string) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "pages",
      pageName,
    ] as const,
};

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

export const useModuleAssignmentNamesQuery = (
  courseName: string,
  moduleName: string
) =>
  useSuspenseQuery({
    queryKey: localCourseKeys.moduleAssignmentNames(courseName, moduleName),
    queryFn: async (): Promise<string[]> => {
      const url = `/api/courses/${courseName}/modules/${moduleName}/assignments`;
      const response = await axios.get(url);
      return response.data;
    },
  });
export const useModuleQuizNamesQuery = (
  courseName: string,
  moduleName: string
) =>
  useSuspenseQuery({
    queryKey: localCourseKeys.moduleQuizzeNames(courseName, moduleName),
    queryFn: async (): Promise<string[]> => {
      const url = `/api/courses/${courseName}/modules/${moduleName}/quizzes`;
      const response = await axios.get(url);
      return response.data;
    },
  });

export const useModulePageNamesQuery = (
  courseName: string,
  moduleName: string
) =>
  useSuspenseQuery({
    queryKey: localCourseKeys.modulePageNames(courseName, moduleName),
    queryFn: async (): Promise<string[]> => {
      const url = `/api/courses/${courseName}/modules/${moduleName}/pages`;
      const response = await axios.get(url);
      return response.data;
    },
  });

export const useAssignmentQuery = (
  courseName: string,
  moduleName: string,
  assignmentName: string
) =>
  useSuspenseQuery({
    queryKey: localCourseKeys.assignment(
      courseName,
      moduleName,
      assignmentName
    ),
    queryFn: async (): Promise<LocalAssignment> => {
      const url = `/api/courses/${courseName}/modules/${moduleName}/assignments/${assignmentName}`;
      const response = await axios.get(url);
      return response.data;
    },
  });

export const useQuizQuery = (
  courseName: string,
  moduleName: string,
  quizName: string
) =>
  useSuspenseQuery({
    queryKey: localCourseKeys.quiz(courseName, moduleName, quizName),
    queryFn: async (): Promise<LocalQuiz> => {
      const url = `/api/courses/${courseName}/modules/${moduleName}/quizzes/${quizName}`;
      const response = await axios.get(url);
      return response.data;
    },
  });

export const usePageQuery = (
  courseName: string,
  moduleName: string,
  pageName: string
) =>
  useSuspenseQuery({
    queryKey: localCourseKeys.quiz(courseName, moduleName, pageName),
    queryFn: async (): Promise<LocalCoursePage> => {
      const url = `/api/courses/${courseName}/modules/${moduleName}/pages/${pageName}`;
      const response = await axios.get(url);
      return response.data;
    },
  });

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
