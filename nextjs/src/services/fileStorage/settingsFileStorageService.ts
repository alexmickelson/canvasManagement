import {
  LocalCourseSettings,
  localCourseYamlUtils,
} from "@/models/local/localCourse";
import { promises as fs } from "fs";
import path from "path";
import {
  basePath,
  directoryOrFileExists,
  getCourseNames,
} from "./utils/fileSystemUtils";

const getCourseSettings = async (
  courseName: string
): Promise<LocalCourseSettings> => {
  const courseDirectory = path.join(basePath, courseName);
  const settingsPath = path.join(courseDirectory, "settings.yml");
  if (!(await directoryOrFileExists(settingsPath))) {
    const errorMessage = `Error loading settings for ${courseName}, settings file ${settingsPath}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }

  const settingsString = await fs.readFile(settingsPath, "utf-8");
  const settings = localCourseYamlUtils.parseSettingYaml(settingsString);

  const folderName = path.basename(courseDirectory);
  return { ...settings, name: folderName };
};

export const settingsFileStorageService = {
  getCourseSettings,
  async getAllCoursesSettings() {
    const courses = await getCourseNames();

    const courseSettings = await Promise.all(
      courses.map(async (c) => await getCourseSettings(c))
    );
    return courseSettings;
  },

  async updateCourseSettings(
    courseName: string,
    settings: LocalCourseSettings
  ) {
    const courseDirectory = path.join(basePath, courseName);
    const settingsPath = path.join(courseDirectory, "settings.yml");

    const { name, ...settingsWithoutName } = settings;
    const settingsMarkdown =
      localCourseYamlUtils.settingsToYaml(settingsWithoutName);

    console.log(`Saving settings ${settingsPath}`);
    await fs.writeFile(settingsPath, settingsMarkdown);
  },
};
