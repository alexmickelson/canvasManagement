import { z } from "zod";
import publicProcedure from "../procedures/public";
import { router } from "../trpc";
import { getLectures } from "@/services/fileStorage/lectureFileStorageService";


export const lectureRouter = router({
  getLectures: publicProcedure
    .input(z.object({
      courseName: z.string()
    }))
    .query(async ({input: {courseName}}) => {
      return await getLectures(courseName)
    })
})