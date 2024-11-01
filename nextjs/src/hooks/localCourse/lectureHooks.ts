import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { lectureKeys } from "./lectureKeys";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import {
  getLectures,
  updateLecture,
} from "@/services/fileStorage/lectureFileStorageService";
import { Lecture } from "@/models/local/lecture";
import { useLocalCourseSettingsQuery } from "./localCoursesHooks";

export const getLecturesQueryConfig = (courseName: string) =>
  ({
    queryKey: lectureKeys.allLectures(courseName),
    queryFn: async () => await getLectures(courseName),
  } as const);

export const useLecturesByWeekQuery = () => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(getLecturesQueryConfig(courseName));
};

export const useLectureUpdateMutation = () => {
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lecture: Lecture) => {
      await updateLecture(courseName, settings, lecture);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: lectureKeys.allLectures(courseName),
      });
    },
  });
};
