import { z } from "zod";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { router } from "@/services/serverFunctions/trpcSetup";
import publicProcedure from "@/services/serverFunctions/procedures/public";

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
