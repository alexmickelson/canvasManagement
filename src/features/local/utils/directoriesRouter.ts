import z from "zod";
import publicProcedure from "../../../services/serverFunctions/publicProcedure";
import { router } from "../../../services/serverFunctions/trpcSetup";
import { fileStorageService } from "@/features/local/utils/fileStorageService";

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
  directoryExists: publicProcedure
    .input(
      z.object({
        relativePath: z.string(),
      })
    )
    .query(async ({ input: { relativePath } }) => {
      return await fileStorageService.directoryExists(relativePath);
    }),
});
