import {
  LocalCourseSettings,
  localCourseYamlUtils,
} from "@/models/local/localCourseSettings";
import { promises as fs } from "fs";
import path from "path";
import { basePath, directoryOrFileExists } from "./utils/fileSystemUtils";
import { AssignmentSubmissionType } from "@/models/local/assignment/assignmentSubmissionType";
import {
  getCoursePathByName,
  getGlobalSettings,
} from "./globalSettingsFileStorageService";
import { GlobalSettingsCourse } from "@/models/local/globalSettings";

const getCourseSettings = async (
  course: GlobalSettingsCourse
): Promise<LocalCourseSettings> => {
  const courseDirectory = await getCoursePathByName(course.name);
  const settingsPath = path.join(courseDirectory, "settings.yml");
  if (!(await directoryOrFileExists(settingsPath))) {
    const errorMessage = `could not find settings for ${course.name}, settings file ${settingsPath}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }

  const settingsString = await fs.readFile(settingsPath, "utf-8");

  const settingsFromFile =
    localCourseYamlUtils.parseSettingYaml(settingsString);

  const settings: LocalCourseSettings = populateDefaultValues(settingsFromFile);

  return { ...settings, name: course.name };
};

const populateDefaultValues = (settingsFromFile: LocalCourseSettings) => {
  const defaultSubmissionType = [
    AssignmentSubmissionType.ONLINE_TEXT_ENTRY,
    AssignmentSubmissionType.ONLINE_UPLOAD,
  ];
  const defaultFileUploadTypes = ["pdf", "jpg", "jpeg"];

  const settings: LocalCourseSettings = {
    ...settingsFromFile,
    defaultAssignmentSubmissionTypes:
      settingsFromFile.defaultAssignmentSubmissionTypes ||
      defaultSubmissionType,
    defaultFileUploadTypes:
      settingsFromFile.defaultFileUploadTypes || defaultFileUploadTypes,
    holidays: Array.isArray(settingsFromFile.holidays)
      ? settingsFromFile.holidays
      : [],
    assets: Array.isArray(settingsFromFile.assets)
      ? settingsFromFile.assets
      : [],
  };
  return settings;
};

export const settingsFileStorageService = {
  getCourseSettings,
  async getAllCoursesSettings() {
    const globalSettings = await getGlobalSettings();

    // const courses = await getCourseNames();
    const courses = globalSettings.courses;

    const courseSettings = await Promise.all(
      courses.map(async (c) => await getCourseSettings(c))
    );
    return courseSettings;
  },

  async updateCourseSettings(
    courseName: string,
    settings: LocalCourseSettings
  ) {
    const courseDirectory = await getCoursePathByName(courseName);
    const settingsPath = path.join(courseDirectory, "settings.yml");

    const { name: _, ...settingsWithoutName } = settings;

    const settingsMarkdown =
      localCourseYamlUtils.settingsToYaml(settingsWithoutName);

    console.log(`Saving settings ${settingsPath}`);
    await fs.writeFile(settingsPath, settingsMarkdown);
  },
};
