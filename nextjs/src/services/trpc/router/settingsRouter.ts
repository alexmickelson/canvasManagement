import publicProcedure from "../procedures/public";
import { z } from "zod";
import { router } from "../trpc";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { zodLocalCourseSettings } from "@/models/local/localCourseSettings";

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
      })
    )
    .mutation(async ({ input: { settings } }) => {
      await fileStorageService.settings.updateCourseSettings(
        settings.name,
        settings
      );
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
