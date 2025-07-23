import { router } from "../../../services/serverFunctions/trpcSetup";
import z from "zod";
import publicProcedure from "../../../services/serverFunctions/publicProcedure";
import {
  getGlobalSettings,
  updateGlobalSettings,
} from "@/features/local/globalSettings/globalSettingsFileStorageService";
import { zodGlobalSettings } from "./globalSettingsModels";

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
