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
  allAssignments: (courseName: string, moduleName: string) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "assignments",
      { type: "all assignments" },
    ] as const,
  quizNames: (courseName: string, moduleName: string) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "quizzes",
      { type: "names" },
    ] as const,
  pageNames: (courseName: string, moduleName: string) =>
    [
      "course details",
      courseName,
      "modules",
      moduleName,
      "pages",
      { type: "names" },
    ] as const,
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
