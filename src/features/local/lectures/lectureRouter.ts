import { z } from "zod";
import publicProcedure from "../../../services/serverFunctions/procedures/public";
import { router } from "../../../services/serverFunctions/trpcSetup";
import { zodLecture } from "@/features/local/lectures/lectureModel";
import {
  getLectures,
  updateLecture,
  deleteLecture,
} from "./lectureFileStorageService";
import { zodLocalCourseSettings } from "../course/localCourseSettings";

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
