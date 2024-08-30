import { promises as fs } from "fs";
import path from "path";
import {
  LocalCourse,
  LocalCourseSettings,
  localCourseYamlUtils,
} from "@/models/local/localCourse";
import { courseMarkdownLoader } from "./utils/courseMarkdownLoader";
import { courseMarkdownSaver } from "./utils/courseMarkdownSaver";
import {
  directoryOrFileExists,
  hasFileSystemEntries,
} from "./utils/fileSystemUtils";

const basePath = process.env.STORAGE_DIRECTORY ?? "./storage";
console.log("base path", basePath);

export const fileStorageService = {
  // async saveCourseAsync(
  //   course: LocalCourse,
  //   previouslyStoredCourse?: LocalCourse
  // ) {
  //   await courseMarkdownSaver.save(course, previouslyStoredCourse);
  // },

  // async loadSavedCourses(): Promise<LocalCourse[]> {
  //   console.log("loading pages from file system");
  //   return (await courseMarkdownLoader.loadSavedCourses()) || [];
  // },

  async getCourseNames() {
    console.log("loading course ids");
    const courseDirectories = await fs.readdir(basePath, {
      withFileTypes: true,
    });
    const coursePromises = courseDirectories
      .filter((dirent) => dirent.isDirectory())
      .filter(async (dirent) => {
        const coursePath = path.join(basePath, dirent.name);
        const settingsPath = path.join(coursePath, "settings.yml");
        return await directoryOrFileExists(settingsPath);
      });
    const courseNamesFromDirectories = (await Promise.all(coursePromises)).map(
      (c) => c.name
    );

    return courseNamesFromDirectories;
  },

  async getCourseSettings(courseName: string): Promise<LocalCourseSettings> {
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
  },

  async getModuleNames(courseName: string) {
    const courseDirectory = path.join(basePath, courseName);
    const moduleDirectories = await fs.readdir(courseDirectory, {
      withFileTypes: true,
    });

    const modulePromises = moduleDirectories
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) =>
        dirent.name
      );

    const modules = await Promise.all(modulePromises);
    return modules.sort((a, b) => a.localeCompare(b));
  },

  async getEmptyDirectories(): Promise<string[]> {
    if (!(await directoryOrFileExists(basePath))) {
      throw new Error(
        `Cannot get empty directories, ${basePath} does not exist`
      );
    }

    const directories = await fs.readdir(basePath, { withFileTypes: true });
    const emptyDirectories = directories
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => path.join(basePath, dirent.name))
      .filter(async (dir) => !(await hasFileSystemEntries(dir)));

    return emptyDirectories;
  },
};
