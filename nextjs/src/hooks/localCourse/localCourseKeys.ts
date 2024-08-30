export const localCourseKeys = {
  allCourses: ["all courses"] as const,
  settings: (courseName: string) =>
    ["course details", courseName, "settings"] as const,
  moduleNames: (courseName: string) =>
    [
      "course details",
      courseName,
      "modules",
      { type: "names" } as const,
    ] as const,
  assignmentNames: (courseName: string, moduleName: string) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "assignments",
    ] as const,
  quizNames: (courseName: string, moduleName: string) =>
    ["course details", courseName, "modules", moduleName, "quizzes"] as const,
  pageNames: (courseName: string, moduleName: string) =>
    ["course details", courseName, "modules", moduleName, "pages"] as const,
  assignment: (
    courseName: string,
    moduleName: string,
    assignmentName: string
  ) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "assignments",
      assignmentName,
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
