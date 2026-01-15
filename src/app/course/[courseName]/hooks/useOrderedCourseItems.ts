import {
  useCourseAssignmentsByModuleByDateQuery,
  useCoursePagesByModuleByDateQuery,
  useCourseQuizzesByModuleByDateQuery,
} from "@/features/local/modules/localCourseModuleHooks";
import { useLecturesSuspenseQuery } from "@/features/local/lectures/lectureHooks";
import { useCourseContext } from "../context/courseContext";
import { getOrderedItems, getOrderedLectures } from "./navigationLogic";

export function useOrderedCourseItems() {
  const { courseName } = useCourseContext();
  const { data: weeks } = useLecturesSuspenseQuery();

  const orderedItems = getOrderedItems(
    courseName,
    useCourseAssignmentsByModuleByDateQuery(),
    useCourseQuizzesByModuleByDateQuery(),
    useCoursePagesByModuleByDateQuery()
  );

  const orderedLectures = getOrderedLectures(weeks, courseName);

  return { orderedItems, orderedLectures };
}
