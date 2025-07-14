import publicProcedure from "../procedures/public";
import { z } from "zod";
import { router } from "../trpcSetup";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { zodLocalCourseSettings } from "@/models/local/localCourseSettings";
import {
  getLectures,
  updateLecture,
} from "@/services/fileStorage/lectureFileStorageService";
import {
  prepAssignmentForNewSemester,
  prepLectureForNewSemester,
  prepPageForNewSemester,
  prepQuizForNewSemester,
} from "@/models/local/utils/semesterTransferUtils";

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
        settings: zodLocalCourseSettings,
        settingsFromCourseToImport: zodLocalCourseSettings.optional(),
      })
    )
    .mutation(async ({ input: { settings, settingsFromCourseToImport } }) => {
      await fileStorageService.settings.updateCourseSettings(
        settings.name,
        settings
      );

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
                await fileStorageService.assignments.updateOrCreateAssignment({
                  courseName: newCourseName,
                  moduleName,
                  assignmentName: newAssignment.name,
                  assignment: newAssignment,
                });
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
    }),
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
