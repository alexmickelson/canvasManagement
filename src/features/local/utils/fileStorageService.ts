import { promises as fs } from "fs";
import path from "path";
import { basePath, directoryOrFileExists } from "./fileSystemUtils";
import { settingsFileStorageService } from "../course/settingsFileStorageService";
import { getCoursePathByName } from "../globalSettings/globalSettingsFileStorageService";

export const fileStorageService = {
  settings: settingsFileStorageService,

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
    const courseDirectory = await getCoursePathByName(courseName);

    await fs.mkdir(courseDirectory, { recursive: true });
  },

  async createModuleFolderForTesting(courseName: string, moduleName: string) {
    const courseDirectory = path.join(basePath, courseName, moduleName);

    await fs.mkdir(courseDirectory, { recursive: true });
  },

  async getDirectoryContents(
    relativePath: string
  ): Promise<{ files: string[]; folders: string[] }> {
    const fullPath = path.join(basePath, relativePath);
    // Security: ensure fullPath is inside basePath
    const resolvedBase = path.resolve(basePath);
    const resolvedFull = path.resolve(fullPath);
    if (!resolvedFull.startsWith(resolvedBase)) {
      return { files: [], folders: [] };
    }
    if (!(await directoryOrFileExists(fullPath))) {
      throw new Error(`Directory ${fullPath} does not exist`);
    }

    const contents = await fs.readdir(fullPath, { withFileTypes: true });
    const files: string[] = [];
    const folders: string[] = [];
    for (const dirent of contents) {
      if (dirent.isDirectory()) {
        folders.push(dirent.name);
      } else if (dirent.isFile()) {
        files.push(dirent.name);
      }
    }
    return { files, folders };
  },
};
