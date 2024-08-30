import { LocalCourse, LocalCourseSettings } from "@/models/local/localCourse";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import axios from "axios";

export const localCourseKeys = {
  allCourses: ["all courses"] as const,
  courseSettings: (courseName: string) =>
    ["course details", courseName, "settings"] as const,
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
    queryKey: localCourseKeys.courseSettings(courseName),
    queryFn: async (): Promise<LocalCourseSettings> => {
      const url = `/api/courses/${courseName}/settings`;
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
        queryKey: localCourseKeys.courseSettings(courseName),
      });
    },
    scope: {
      id: "all courses",
    },
  });
};
