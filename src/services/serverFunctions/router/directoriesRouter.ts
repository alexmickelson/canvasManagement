import publicProcedure from "../procedures/public";
import { router } from "../trpcSetup";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export const directoriesRouter = router({
  getEmptyDirectories: publicProcedure.query(async () => {
    return await fileStorageService.getEmptyDirectories();
  }),
});
