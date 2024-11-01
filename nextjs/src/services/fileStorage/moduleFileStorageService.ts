import { promises as fs } from "fs";
import path from "path";
import { basePath } from "./utils/fileSystemUtils";
import { lectureFolderName } from "./utils/lectureUtils";

export const moduleFileStorageService = {
  async getModuleNames(courseName: string) {
    const courseDirectory = path.join(basePath, courseName);
    const moduleDirectories = await fs.readdir(courseDirectory, {
      withFileTypes: true,
    });

    const modulePromises = moduleDirectories
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const modules = await Promise.all(modulePromises);
    const modulesWithoutLectures = modules.filter(
      (m) => m !== lectureFolderName
    );
    return modulesWithoutLectures.sort((a, b) => a.localeCompare(b));
  },
  async createModule(courseName: string, moduleName: string) {
    const courseDirectory = path.join(basePath, courseName);

    await fs.mkdir(courseDirectory + "/" + moduleName, { recursive: true });
  },
};
