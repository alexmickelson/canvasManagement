import { promises as fs } from "fs";
import path from "path";
import { basePath, directoryOrFileExists } from "./utils/fileSystemUtils";
import { assignmentsFileStorageService } from "./assignmentsFileStorageService";
import { quizFileStorageService } from "./quizFileStorageService";
import { pageFileStorageService } from "./pageFileStorageService";
import { moduleFileStorageService } from "./moduleFileStorageService";
import { settingsFileStorageService } from "./settingsFileStorageService";

export const fileStorageService = {
  settings: settingsFileStorageService,
  modules: moduleFileStorageService,
  assignments: assignmentsFileStorageService,
  quizzes: quizFileStorageService,
  pages: pageFileStorageService,
  

  async getEmptyDirectories(): Promise<string[]> {
    if (!(await directoryOrFileExists(basePath))) {
      throw new Error(
        `Cannot get empty directories, ${basePath} does not exist`
      );
    }

    const directories = await fs.readdir(basePath, { withFileTypes: true });
    const emptyDirectories = (
      await Promise.all(
        directories
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => path.join(dirent.name))
          .map(async (directory) => {
            return {
              directory,
              files: await fs.readdir(path.join(basePath, directory)),
            };
          })
      )
    )
      .filter(({ files }) => files.length === 0)
      .map(({ directory }) => directory);

    return emptyDirectories;
  },

  async createCourseFolderForTesting(courseName: string) {
    const courseDirectory = path.join(basePath, courseName);

    await fs.mkdir(courseDirectory, { recursive: true });
  },
  async createModuleFolderForTesting(courseName: string, moduleName: string) {
    const courseDirectory = path.join(basePath, courseName);

    await fs.mkdir(courseDirectory, { recursive: true });
  },
};
