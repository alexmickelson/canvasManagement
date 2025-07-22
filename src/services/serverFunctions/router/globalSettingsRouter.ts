import { zodGlobalSettings } from "@/models/local/globalSettings";
import { router } from "../trpcSetup";
import z from "zod";
import publicProcedure from "../procedures/public";
import {
  getGlobalSettings,
  updateGlobalSettings,
} from "@/services/fileStorage/globalSettingsFileStorageService";

export const globalSettingsRouter = router({
  getGlobalSettings: publicProcedure.query(async () => {
    return await getGlobalSettings();
  }),
  updateGlobalSettings: publicProcedure
    .input(
      z.object({
        globalSettings: zodGlobalSettings,
      })
    )
    .mutation(async ({ input: { globalSettings } }) => {
      return await updateGlobalSettings(globalSettings);
    }),
});
