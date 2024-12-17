import { z } from "zod";
import publicProcedure from "../procedures/public";
import { router } from "../trpcSetup";
import {
  deleteLecture,
  getLectures,
  updateLecture,
} from "@/services/fileStorage/lectureFileStorageService";
import { zodLecture } from "@/models/local/lecture";
import { zodLocalCourseSettings } from "@/models/local/localCourseSettings";

export const lectureRouter = router({
  getLectures: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
      })
    )
    .query(async ({ input: { courseName } }) => {
      return await getLectures(courseName);
    }),
  updateLecture: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        lecture: zodLecture,
        previousDay: z.string().optional(),
        settings: zodLocalCourseSettings,
      })
    )
    .mutation(
      async ({ input: { courseName, settings, lecture, previousDay } }) => {
        await updateLecture(courseName, settings, lecture);

        if (previousDay && previousDay !== lecture.date) {
          await deleteLecture(courseName, settings, previousDay);
        }
      }
    ),
  deleteLecture: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        lectureDay: z.string(),
        settings: zodLocalCourseSettings,
      })
    )
    .mutation(async ({ input: { courseName, settings, lectureDay } }) => {
      await deleteLecture(courseName, settings, lectureDay);
    }),
});
