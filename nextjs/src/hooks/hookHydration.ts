import { QueryClient } from "@tanstack/react-query";
import { localCourseKeys } from "./localCourse/localCourseKeys";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { LocalCourseSettings } from "@/models/local/localCourse";
// https://tanstack.com/query/latest/docs/framework/react/guides/ssr
export const hydrateCourses = async (queryClient: QueryClient) => {
  const allSettings = await fileStorageService.getAllCoursesSettings();
  const courseNames = allSettings.map((s) => s.name);
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
  const courseName = courseSettings.name
  const moduleNames = await fileStorageService.getModuleNames(courseName);
  const modulesData = await Promise.all(
    moduleNames.map(async (moduleName) => {
      const [assignmentNames, pageNames, quizNames] = await Promise.all([
        await fileStorageService.getAssignmentNames(courseName, moduleName),
        await fileStorageService.getPageNames(courseName, moduleName),
        await fileStorageService.getQuizNames(courseName, moduleName),
      ]);

      const [assignments, quizzes, pages] = await Promise.all([
        await Promise.all(
          assignmentNames.map(
            async (assignmentName) =>
              await fileStorageService.getAssignment(
                courseName,
                moduleName,
                assignmentName
              )
          )
        ),
        await Promise.all(
          quizNames.map(
            async (quizName) =>
              await fileStorageService.getQuiz(courseName, moduleName, quizName)
          )
        ),
        await Promise.all(
          pageNames.map(
            async (pageName) =>
              await fileStorageService.getPage(courseName, moduleName, pageName)
          )
        ),
      ]);

      return {
        moduleName,
        assignmentNames,
        pageNames,
        quizNames,
        assignments,
        quizzes,
        pages,
      };
    })
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
    modulesData.map(
      async ({
        moduleName,
        assignmentNames,
        pageNames,
        quizNames,
        assignments,
        quizzes,
        pages,
      }) => {
        await queryClient.prefetchQuery({
          queryKey: localCourseKeys.assignmentNames(courseName, moduleName),
          queryFn: () => assignmentNames,
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
        await queryClient.prefetchQuery({
          queryKey: localCourseKeys.quizNames(courseName, moduleName),
          queryFn: () => quizNames,
        });
        await Promise.all(
          quizzes.map(
            async (quiz) =>
              await queryClient.prefetchQuery({
                queryKey: localCourseKeys.quiz(
                  courseName,
                  moduleName,
                  quiz.name
                ),
                queryFn: () => quiz,
              })
          )
        );
        await queryClient.prefetchQuery({
          queryKey: localCourseKeys.pageNames(courseName, moduleName),
          queryFn: () => pageNames,
        });
        await Promise.all(
          pages.map(
            async (page) =>
              await queryClient.prefetchQuery({
                queryKey: localCourseKeys.page(
                  courseName,
                  moduleName,
                  page.name
                ),
                queryFn: () => page,
              })
          )
        );
      }
    )
  );
};
