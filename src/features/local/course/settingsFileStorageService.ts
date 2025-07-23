import { promises as fs } from "fs";
import path from "path";
import {
  basePath,
  directoryOrFileExists,
} from "../../../services/fileStorage/utils/fileSystemUtils";
import { AssignmentSubmissionType } from "@/features/local/assignments/models/assignmentSubmissionType";
import {
  getCoursePathByName,
  getGlobalSettings,
} from "../globalSettings/globalSettingsFileStorageService";
import {
  LocalCourseSettings,
  localCourseYamlUtils,
} from "@/features/local/course/localCourseSettings";
import { GlobalSettingsCourse } from "../globalSettings/globalSettingsModels";

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
  async createCourseSettings(settings: LocalCourseSettings, directory: string) {
    const courseDirectory = path.join(basePath, directory);

    if (await directoryOrFileExists(courseDirectory)) {
      throw new Error(
        `Course path "${courseDirectory}" already exists. Create course in a new folder.`
      );
    }

    await fs.mkdir(courseDirectory, { recursive: true });
    const settingsPath = path.join(courseDirectory, "settings.yml");

    const { name: _, ...settingsWithoutName } = settings;

    const settingsMarkdown =
      localCourseYamlUtils.settingsToYaml(settingsWithoutName);

    console.log(`Saving settings ${settingsPath}`);
    await fs.writeFile(settingsPath, settingsMarkdown);
  },
  async folderIsCourse(folderPath: string) {
    const settingsPath = path.join(basePath, folderPath, "settings.yml");
    if (!(await directoryOrFileExists(settingsPath))) {
      return false;
    }
    return true;
  },
};
