import publicProcedure from "../procedures/public";
import { z } from "zod";
import { router } from "../trpcSetup";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { zodLocalAssignment } from "@/models/local/assignment/localAssignment";

export const directoriesRouter = router({
  getEmptyDirectories: publicProcedure.query(async () => {
    return await fileStorageService.getEmptyDirectories();
  }),
});
