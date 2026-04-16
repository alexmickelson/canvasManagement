import { getWeekNumber } from "../calendar/calendarMonthUtils";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import {
  getDateFromString,
  getDateFromStringOrThrow,
} from "@/features/local/utils/timeUtils";

export function useWeekLabel(dueAt: string): string {
  const { data: settings } = useLocalCourseSettingsQuery();
  const date = getDateFromString(dueAt);

  if (!date) return "";

  const startDate = getDateFromStringOrThrow(
    settings.startDate,
    "week label hook",
  );
  const weekNum = getWeekNumber(startDate, date);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  return `${dayName} Week ${weekNum}`;
}
