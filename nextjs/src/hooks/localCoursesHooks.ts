import { LocalCourse } from "@/models/local/localCourse";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";

export const localCourseKeys = {
  allCourses: ["all courses"] as const,
  courseDetail: (courseName: string) => ["all courses", courseName] as const,
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

export const useLocalCourseDetailsQuery = (courseName: string) => {
  const { data: courses } = useLocalCoursesQuery();
  return useSuspenseQuery({
    queryKey: localCourseKeys.courseDetail(courseName),
    queryFn: () => {
      const course = courses.find((c) => c.settings.name === courseName);
      if (!course) {
        console.log(courses);
        console.log(courseName);
        throw Error(`Could not find course with name ${courseName}`);
      }
      return course;
    },
  });
};
