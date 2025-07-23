import publicProcedure from "../../../services/serverFunctions/publicProcedure";
import { z } from "zod";
import { router } from "../../../services/serverFunctions/trpcSetup";
import { fileStorageService } from "@/features/local/utils/fileStorageService";
import {
  prepAssignmentForNewSemester,
  prepLectureForNewSemester,
  prepPageForNewSemester,
  prepQuizForNewSemester,
} from "@/features/local/utils/semesterTransferUtils";
import {
  getGlobalSettings,
  updateGlobalSettings,
} from "@/features/local/globalSettings/globalSettingsFileStorageService";
import {
  LocalCourseSettings,
  zodLocalCourseSettings,
} from "@/features/local/course/localCourseSettings";
import { courseItemFileStorageService } from "./courseItemFileStorageService";
import { updateOrCreateAssignmentFile } from "../assignments/assignmentRouter";
import { updateQuizFile } from "../quizzes/quizRouter";
import { updatePageFile } from "../pages/pageRouter";
import { getLectures, updateLecture } from "../lectures/lectureRouter";
import {
  createModuleFile,
  getModuleNamesFromFiles,
} from "../modules/moduleRouter";

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
          await migrateCourseContent(settingsFromCourseToImport, settings);
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

async function migrateCourseContent(
  settingsFromCourseToImport: LocalCourseSettings,
  settings: LocalCourseSettings
) {
  const oldCourseName = settingsFromCourseToImport.name;
  const newCourseName = settings.name;
  const oldModules = await getModuleNamesFromFiles(oldCourseName);
  await Promise.all(
    oldModules.map(async (moduleName) => {
      await createModuleFile(newCourseName, moduleName);
      const [oldAssignments, oldQuizzes, oldPages, oldLecturesByWeek] =
        await Promise.all([
          await courseItemFileStorageService.getItems({
            courseName: oldCourseName,
            moduleName,
            type: "Assignment",
          }),
          await courseItemFileStorageService.getItems({
            courseName: oldCourseName,
            moduleName,
            type: "Quiz",
          }),
          await courseItemFileStorageService.getItems({
            courseName: oldCourseName,
            moduleName,
            type: "Page",
          }),
          await getLectures(oldCourseName),
        ]);

      const updateAssignmentPromises = oldAssignments.map(
        async (oldAssignment) => {
          const newAssignment = prepAssignmentForNewSemester(
            oldAssignment,
            settingsFromCourseToImport.startDate,
            settings.startDate
          );
          await updateOrCreateAssignmentFile({
            courseName: newCourseName,
            moduleName,
            assignmentName: newAssignment.name,
            assignment: newAssignment,
          });
        }
      );
      const updateQuizzesPromises = oldQuizzes.map(async (oldQuiz) => {
        const newQuiz = prepQuizForNewSemester(
          oldQuiz,
          settingsFromCourseToImport.startDate,
          settings.startDate
        );
        await updateQuizFile({
          courseName: newCourseName,
          moduleName,
          quizName: newQuiz.name,
          quiz: newQuiz,
        });
      });
      const updatePagesPromises = oldPages.map(async (oldPage) => {
        const newPage = prepPageForNewSemester(
          oldPage,
          settingsFromCourseToImport.startDate,
          settings.startDate
        );
        await updatePageFile({
          courseName: newCourseName,
          moduleName,
          pageName: newPage.name,
          page: newPage,
        });
      });
      const updateLecturePromises = oldLecturesByWeek.flatMap(
        async (oldLectureByWeek) =>
          oldLectureByWeek.lectures.map(async (oldLecture) => {
            const newLecture = prepLectureForNewSemester(
              oldLecture,
              settingsFromCourseToImport.startDate,
              settings.startDate
            );
            await updateLecture(newCourseName, settings, newLecture);
          })
      );

      await Promise.all([
        ...updateAssignmentPromises,
        ...updateQuizzesPromises,
        ...updatePagesPromises,
        ...updateLecturePromises,
      ]);
    })
  );
}
