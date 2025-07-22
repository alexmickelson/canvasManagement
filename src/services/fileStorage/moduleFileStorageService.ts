import { promises as fs } from "fs";
import path from "path";
import { lectureFolderName } from "./utils/lectureUtils";
import { getCoursePathByName } from "./globalSettingsFileStorageService";

export const moduleFileStorageService = {
  async getModuleNames(courseName: string) {
    const courseDirectory = await getCoursePathByName(courseName);
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
    const courseDirectory = await getCoursePathByName(courseName);

    await fs.mkdir(courseDirectory + "/" + moduleName, { recursive: true });
  },
};
