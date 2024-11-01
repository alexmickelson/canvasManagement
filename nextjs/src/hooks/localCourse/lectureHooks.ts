import { useSuspenseQuery } from "@tanstack/react-query";
import { lectureKeys } from "./lectureKeys";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { getLectures } from "@/services/fileStorage/lectureFileStorageService";

export const getLecturesQueryConfig = (courseName: string) =>
  ({
    queryKey: lectureKeys.allLectures(courseName),
    queryFn: async () => await getLectures(courseName),
  } as const);

export const useLecturesQuery = () => {
  const { courseName } = useCourseContext();
  return useSuspenseQuery(getLecturesQueryConfig(courseName));
};
