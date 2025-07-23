import { promises as fs } from "fs";
import path from "path";
import { basePath } from "../../../services/fileStorage/utils/fileSystemUtils";
import {
  GlobalSettings,
  zodGlobalSettings,
} from "@/features/local/globalSettings/globalSettingsModels";
import {
  parseGlobalSettingsYaml,
  globalSettingsToYaml,
} from "@/features/local/globalSettings/globalSettingsUtils";

const SETTINGS_FILE_PATH =
  process.env.SETTINGS_FILE_PATH || "./globalSettings.yml";

export const getGlobalSettings = async (): Promise<GlobalSettings> => {
  try {
    await fs.access(SETTINGS_FILE_PATH);
  } catch (err) {
    console.log(err);
    throw new Error(
      `Global Settings file does not exist at path: ${SETTINGS_FILE_PATH}`
    );
  }

  const globalSettingsString = process.env.GLOBAL_SETTINGS
    ? process.env.GLOBAL_SETTINGS
    : await fs.readFile(SETTINGS_FILE_PATH, "utf-8");
  const globalSettings = parseGlobalSettingsYaml(globalSettingsString);

  return globalSettings;
};

export const getCoursePathByName = async (courseName: string) => {
  const globalSettings = await getGlobalSettings();
  const course = globalSettings.courses.find((c) => c.name === courseName);
  if (!course) {
    throw new Error(
      `Course with name ${courseName} not found in global settings`
    );
  }
  return path.join(basePath, course.path);
};

export const updateGlobalSettings = async (globalSettings: GlobalSettings) => {
  const globalSettingsString = globalSettingsToYaml(
    zodGlobalSettings.parse(globalSettings)
  );
  await fs.writeFile(SETTINGS_FILE_PATH, globalSettingsString, "utf-8");
};
