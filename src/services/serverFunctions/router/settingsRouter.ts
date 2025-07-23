import publicProcedure from "../procedures/public";
import { z } from "zod";
import { router } from "../trpcSetup";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import {
  prepAssignmentForNewSemester,
  prepLectureForNewSemester,
  prepPageForNewSemester,
  prepQuizForNewSemester,
} from "@/models/local/utils/semesterTransferUtils";
import {
  getGlobalSettings,
  updateGlobalSettings,
} from "@/services/fileStorage/globalSettingsFileStorageService";
import { getLectures, updateLecture } from "@/features/local/lectures/lectureFileStorageService";
import { zodLocalCourseSettings } from "@/features/local/course/localCourseSettings";

export const settingsRouter = router({
  allCoursesSettings: publicProcedure.query(async () => {
    return await fileStorageService.settings.getAllCoursesSettings();
  }),
  courseSettings: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
      })
    )
    .query(async ({ input: { courseName } }) => {
      const settingsList =
        await fileStorageService.settings.getAllCoursesSettings();
      const s = settingsList.find((s) => s.name === courseName);
      if (!s) {
        console.log(courseName, settingsList);
        throw Error("Could not find settings for course " + courseName);
      }
      return s;
    }),
  createCourse: publicProcedure
    .input(
      z.object({
        name: z.string(),
        directory: z.string(),
        settings: zodLocalCourseSettings,
        settingsFromCourseToImport: zodLocalCourseSettings.optional(),
      })
    )
    .mutation(
      async ({
        input: { settings, settingsFromCourseToImport, name, directory },
      }) => {
        console.log("creating in directory", directory);
        await fileStorageService.settings.createCourseSettings(
          settings,
          directory
        );

        const globalSettings = await getGlobalSettings();

        await updateGlobalSettings({
          ...globalSettings,
          courses: [
            ...globalSettings.courses,
            {
              name,
              path: directory,
            },
          ],
        });

        if (settingsFromCourseToImport) {
          const oldCourseName = settingsFromCourseToImport.name;
          const newCourseName = settings.name;
          const oldModules = await fileStorageService.modules.getModuleNames(
            oldCourseName
          );
          await Promise.all(
            oldModules.map(async (moduleName) => {
              await fileStorageService.modules.createModule(
                newCourseName,
                moduleName
              );

              const [oldAssignments, oldQuizzes, oldPages, oldLecturesByWeek] =
                await Promise.all([
                  fileStorageService.assignments.getAssignments(
                    oldCourseName,
                    moduleName
                  ),
                  await fileStorageService.quizzes.getQuizzes(
                    oldCourseName,
                    moduleName
                  ),
                  await fileStorageService.pages.getPages(
                    oldCourseName,
                    moduleName
                  ),
                  await getLectures(oldCourseName),
                ]);

              await Promise.all([
                ...oldAssignments.map(async (oldAssignment) => {
                  const newAssignment = prepAssignmentForNewSemester(
                    oldAssignment,
                    settingsFromCourseToImport.startDate,
                    settings.startDate
                  );
                  await fileStorageService.assignments.updateOrCreateAssignment(
                    {
                      courseName: newCourseName,
                      moduleName,
                      assignmentName: newAssignment.name,
                      assignment: newAssignment,
                    }
                  );
                }),
                ...oldQuizzes.map(async (oldQuiz) => {
                  const newQuiz = prepQuizForNewSemester(
                    oldQuiz,
                    settingsFromCourseToImport.startDate,
                    settings.startDate
                  );
                  await fileStorageService.quizzes.updateQuiz({
                    courseName: newCourseName,
                    moduleName,
                    quizName: newQuiz.name,
                    quiz: newQuiz,
                  });
                }),
                ...oldPages.map(async (oldPage) => {
                  const newPage = prepPageForNewSemester(
                    oldPage,
                    settingsFromCourseToImport.startDate,
                    settings.startDate
                  );
                  await fileStorageService.pages.updatePage({
                    courseName: newCourseName,
                    moduleName,
                    pageName: newPage.name,
                    page: newPage,
                  });
                }),
                ...oldLecturesByWeek.flatMap(async (oldLectureByWeek) =>
                  oldLectureByWeek.lectures.map(async (oldLecture) => {
                    const newLecture = prepLectureForNewSemester(
                      oldLecture,
                      settingsFromCourseToImport.startDate,
                      settings.startDate
                    );
                    await updateLecture(newCourseName, settings, newLecture);
                  })
                ),
              ]);
            })
          );
        }
      }
    ),
  updateSettings: publicProcedure
    .input(
      z.object({
        settings: zodLocalCourseSettings,
      })
    )
    .mutation(async ({ input: { settings } }) => {
      await fileStorageService.settings.updateCourseSettings(
        settings.name,
        settings
      );
    }),
});
