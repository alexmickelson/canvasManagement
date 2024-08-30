import { LocalCourse, LocalCourseSettings } from "@/models/local/localCourse";
import { LocalModule } from "@/models/local/localModules";
import {
  useMutation,
  useQueryClient,
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
      ["course details", courseName, "modules", moduleName, "assignments"] as const,
    moduleQuizzeNames: (courseName: string, moduleName: string) =>
      ["course details", courseName, "modules", moduleName, "quizzes"] as const,
    modulePageNames: (courseName: string, moduleName: string) =>
      ["course details", courseName, "modules", moduleName, "pages"] as const,
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

export const useLocalCourseModuleNamesQuery = (courseName: string) =>
  useSuspenseQuery({
    queryKey: localCourseKeys.moduleNames(courseName),
    queryFn: async (): Promise<string[]> => {
      const url = `/api/courses/${courseName}/modules`;
      const response = await axios.get(url);
      return response.data;
    },
  });


export const useUpdateCourseMutation = (courseName: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      updatedCourse: LocalCourse;
      previousCourse: LocalCourse;
    }) => {
      const url = `/api/courses/${courseName}`;
      await axios.put(url, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.settings(courseName),
      });
    },
    scope: {
      id: "all courses",
    },
  });
};
