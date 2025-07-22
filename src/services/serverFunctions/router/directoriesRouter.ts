import z from "zod";
import publicProcedure from "../procedures/public";
import { router } from "../trpcSetup";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export const directoriesRouter = router({
  getEmptyDirectories: publicProcedure.query(async () => {
    return await fileStorageService.getEmptyDirectories();
  }),
  getDirectoryContents: publicProcedure
    .input(
      z.object({
        relativePath: z.string(),
      })
    )
    .query(async ({ input: { relativePath } }) => {
      return await fileStorageService.getDirectoryContents(relativePath);
    }),
  directoryIsCourse: publicProcedure
    .input(
      z.object({
        folderPath: z.string(),
      })
    )
    .query(async ({ input: { folderPath } }) => {
      return await fileStorageService.settings.folderIsCourse(folderPath);
    }),
});
