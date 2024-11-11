import { z } from "zod";
import publicProcedure from "../procedures/public";
import { router } from "../trpc";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export const moduleRouter = router({
  getModuleNames: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
      })
    )
    .query(async ({ input: { courseName } }) => {
      return await fileStorageService.modules.getModuleNames(courseName);
    }),
  createModule: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
      })
    )
    .mutation(async ({ input: { courseName, moduleName } }) => {
      await fileStorageService.modules.createModule(courseName, moduleName);
    }),
});
