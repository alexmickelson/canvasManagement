import { LocalCourse } from "@/models/local/localCourse";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";

export const localCourseKeys = {
  allCourses: ["all courses"] as const,
};

export const useLocalCoursesQuery = () =>
  useSuspenseQuery({
    queryKey: localCourseKeys.allCourses,
    queryFn: async (): Promise<LocalCourse[]> => {
      const url = `/api/courses`;
      const response = await axios.get(url);
      return response.data;
    },
  });
