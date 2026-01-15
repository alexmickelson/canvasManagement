import { CalendarItemsInterface } from "../context/calendarItemsContext";
import { getLectureUrl, getModuleItemUrl } from "@/services/urlUtils";

export type CourseItemType = "assignment" | "quiz" | "page" | "lecture";

export interface OrderedCourseItem {
  type: CourseItemType;
  name: string;
  moduleName?: string;
  date: string;
  url: string;
}

export function getOrderedItems(
  courseName: string,
  ...calendars: CalendarItemsInterface[]
): OrderedCourseItem[] {
  const itemTypes = [
    { key: "assignments" as const, type: "assignment" as const },
    { key: "quizzes" as const, type: "quiz" as const },
    { key: "pages" as const, type: "page" as const },
  ];

  return calendars
    .flatMap((calendar) =>
      Object.entries(calendar).flatMap(([date, modules]) =>
        Object.entries(modules).flatMap(([moduleName, moduleData]) =>
          itemTypes.flatMap(({ key, type }) =>
            (moduleData[key] || []).map((item) => ({
              type,
              name: item.name,
              moduleName,
              date,
              url: getModuleItemUrl(courseName, moduleName, type, item.name),
            }))
          )
        )
      )
    )
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.name.localeCompare(b.name);
    });
}

export function getOrderedLectures(
  weeks: { lectures: { date: string }[] }[],
  courseName: string
): OrderedCourseItem[] {
  return weeks
    .flatMap((week) => week.lectures)
    .map((lecture) => ({
      type: "lecture",
      name: lecture.date,
      date: lecture.date,
      url: getLectureUrl(courseName, lecture.date),
    }));
}

export function getNavigationLinks(
  list: OrderedCourseItem[],
  type: CourseItemType,
  name: string,
  moduleName?: string
) {
  const index = list.findIndex((item) => {
    if (type === "lecture") return item.date === name;
    return (
      item.name === name && item.type === type && item.moduleName === moduleName
    );
  });

  if (index === -1) return { previousUrl: null, nextUrl: null };

  const previousIndex = (index - 1 + list.length) % list.length;
  const nextIndex = (index + 1) % list.length;

  return {
    previousUrl: list[previousIndex].url,
    nextUrl: list[nextIndex].url,
  };
}
