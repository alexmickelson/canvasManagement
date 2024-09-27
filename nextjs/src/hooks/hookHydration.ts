import { QueryClient } from "@tanstack/react-query";
import { localCourseKeys } from "./localCourse/localCourseKeys";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { LocalCourseSettings } from "@/models/local/localCourse";
import { canvasAssignmentService } from "@/services/canvas/canvasAssignmentService";
import { canvasAssignmentKeys } from "./canvas/canvasAssignmentHooks";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { canvasQuizService } from "@/services/canvas/canvasQuizService";
import { canvasPageService } from "@/services/canvas/canvasPageService";
import { canvasQuizKeys } from "./canvas/canvasQuizHooks";
import { canvasPageKeys } from "./canvas/canvasPageHooks";
// https://tanstack.com/query/latest/docs/framework/react/guides/ssr
export const hydrateCourses = async (queryClient: QueryClient) => {
  const allSettings = await fileStorageService.settings.getAllCoursesSettings();
  await queryClient.prefetchQuery({
    queryKey: localCourseKeys.allCoursesSettings,
    queryFn: () => allSettings,
  });

  await Promise.all(
    allSettings.map(async (settings) => {
      await hydrateCourse(queryClient, settings);
    })
  );
};

export const hydrateCourse = async (
  queryClient: QueryClient,
  courseSettings: LocalCourseSettings
) => {
  const courseName = courseSettings.name;
  const moduleNames = await fileStorageService.modules.getModuleNames(
    courseName
  );
  const modulesData = await Promise.all(
    moduleNames.map((moduleName) => loadAllModuleData(courseName, moduleName))
  );

  await queryClient.prefetchQuery({
    queryKey: localCourseKeys.settings(courseName),
    queryFn: () => courseSettings,
  });
  await queryClient.prefetchQuery({
    queryKey: localCourseKeys.moduleNames(courseName),
    queryFn: () => moduleNames,
  });

  await Promise.all(
    modulesData.map((d) => hydrateModuleData(d, courseName, queryClient))
  );
};

export const hydrateCanvasCourse = async (
  canvasCourseId: number,
  queryClient: QueryClient
) => {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: canvasAssignmentKeys.assignments(canvasCourseId),
      queryFn: async () => await canvasAssignmentService.getAll(canvasCourseId),
    }),
    queryClient.prefetchQuery({
      queryKey: canvasQuizKeys.quizzes(canvasCourseId),
      queryFn: async () => await canvasQuizService.getAll(canvasCourseId),
    }),
    queryClient.prefetchQuery({
      queryKey: canvasPageKeys.pagesInCourse(canvasCourseId),
      queryFn: async () => await canvasPageService.getAll(canvasCourseId),
    }),
  ]);
};

const loadAllModuleData = async (courseName: string, moduleName: string) => {
  const [assignmentNames, pages, quizzes] = await Promise.all([
    await fileStorageService.assignments.getAssignmentNames(
      courseName,
      moduleName
    ),
    await fileStorageService.pages.getPages(courseName, moduleName),
    await fileStorageService.quizzes.getQuizzes(courseName, moduleName),
  ]);

  const [assignments] = await Promise.all([
    await Promise.all(
      assignmentNames.map(async (assignmentName) => {
        try {
          return await fileStorageService.assignments.getAssignment(
            courseName,
            moduleName,
            assignmentName
          );
        } catch (error) {
          console.error(`Error fetching assignment: ${assignmentName}`, error);
          return null; // or any other placeholder value
        }
      })
    ),
  ]);

  const assignmentsLoaded = assignments.filter((a) => a !== null);
  return {
    moduleName,
    assignments: assignmentsLoaded,
    quizzes,
    pages,
  };
};

const hydrateModuleData = async (
  {
    moduleName,
    assignments,
    quizzes,
    pages,
  }: {
    moduleName: string;
    assignments: LocalAssignment[];
    quizzes: LocalQuiz[];
    pages: LocalCoursePage[];
  },
  courseName: string,
  queryClient: QueryClient
) => {
  await queryClient.prefetchQuery({
    queryKey: localCourseKeys.allAssignments(courseName, moduleName),
    queryFn: () => assignments,
  });
  await queryClient.prefetchQuery({
    queryKey: localCourseKeys.allQuizzes(courseName, moduleName),
    queryFn: () => quizzes,
  });
  await queryClient.prefetchQuery({
    queryKey: localCourseKeys.allPages(courseName, moduleName),
    queryFn: () => pages,
  });
  await Promise.all(
    assignments.map(
      async (assignment) =>
        await queryClient.prefetchQuery({
          queryKey: localCourseKeys.assignment(
            courseName,
            moduleName,
            assignment.name
          ),
          queryFn: () => assignment,
        })
    )
  );
  await Promise.all(
    quizzes.map(
      async (quiz) =>
        await queryClient.prefetchQuery({
          queryKey: localCourseKeys.quiz(courseName, moduleName, quiz.name),
          queryFn: () => quiz,
        })
    )
  );
  await Promise.all(
    pages.map(
      async (page) =>
        await queryClient.prefetchQuery({
          queryKey: localCourseKeys.page(courseName, moduleName, page.name),
          queryFn: () => page,
        })
    )
  );
};
