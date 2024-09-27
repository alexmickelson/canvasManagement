import { CourseItemType, typeToFolder } from "@/models/local/courseItemTypes";

export const localCourseKeys = {
  allCoursesSettings: ["all courses settings"] as const,
  allCoursesNames: ["all courses names"] as const,
  settings: (courseName: string) =>
    ["course details", courseName, "settings"] as const,
  moduleNames: (courseName: string) =>
    [
      "course details",
      courseName,
      "modules",
      { type: "names" } as const,
    ] as const,
  allItemsOfType: (
    courseName: string,
    moduleName: string,
    type: CourseItemType
  ) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      typeToFolder[type],
      { type: "all" },
    ] as const,
  itemOfType: (
    courseName: string,
    moduleName: string,
    name: string,
    type: CourseItemType
  ) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      typeToFolder[type],
      name,
    ] as const,
  allQuizzes: (courseName: string, moduleName: string) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "quizzes",
      { type: "all" },
    ] as const,
  allPages: (courseName: string, moduleName: string) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "pages",
      { type: "all" },
    ] as const,
  quiz: (courseName: string, moduleName: string, quizName: string) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "quizzes",
      quizName,
    ] as const,
  page: (courseName: string, moduleName: string, pageName: string) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "pages",
      pageName,
    ] as const,
};
