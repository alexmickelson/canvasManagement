import { LocalCourse } from "@/models/local/localCourse";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import axios from "axios";

export const localCourseKeys = {
  allCourses: ["all courses"] as const,
  courseDetail: (courseName: string) => ["course details", courseName] as const,
};

export const useLocalCourseNamesQuery = () =>
  useSuspenseQuery({
    queryKey: localCourseKeys.allCourses,
    queryFn: async (): Promise<LocalCourse[]> => {
      const url = `/api/courses`;
      const response = await axios.get(url);
      return response.data;
    },
    select: (courses) => courses.map((c) => c.settings.name),
  });

export const useLocalCourseDetailsQuery = (courseName: string) => {
  return useSuspenseQuery({
    queryKey: localCourseKeys.courseDetail(courseName),
    queryFn: async (): Promise<LocalCourse> => {
      const url = `/api/courses/${courseName}`;
      const response = await axios.get(url);
      return response.data;
    },
  });
};

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
        queryKey: localCourseKeys.courseDetail(courseName),
      });
    },
    scope: {
      id: "all courses",
    },
  });
};
