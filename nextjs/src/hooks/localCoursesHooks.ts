import { LocalCourse } from "@/models/local/localCourse";
import {
  dataTagSymbol,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
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
      queryClient.invalidateQueries({ queryKey: localCourseKeys.allCourses }); //optimize?
    },
    scope: {
      id: "update course",
    },
  });
};
