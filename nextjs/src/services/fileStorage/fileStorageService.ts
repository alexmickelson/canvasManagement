import { promises as fs } from "fs";
import path from "path";
import { LocalCourse } from "@/models/local/localCourse";
import { courseMarkdownLoader } from "./utils/couresMarkdownLoader";
import { courseMarkdownSaver } from "./utils/courseMarkdownSaver";

const basePath = process.env.STORAGE_DIRECTORY ?? "./storage";
console.log("base path", basePath);

export const fileStorageService = {
  async saveCourseAsync(
    course: LocalCourse,
    previouslyStoredCourse?: LocalCourse
  ) {
    await courseMarkdownSaver.save(course, previouslyStoredCourse);
  },

  async loadSavedCourses(): Promise<LocalCourse[]> {
    console.log("loading pages from file system");
    return (await courseMarkdownLoader.loadSavedCourses()) || [];
  },

  async getEmptyDirectories(): Promise<string[]> {
    if (!(await this.directoryExists(basePath))) {
      throw new Error(
        `Cannot get empty directories, ${basePath} does not exist`
      );
    }

    const directories = await fs.readdir(basePath, { withFileTypes: true });
    const emptyDirectories = directories
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => path.join(basePath, dirent.name))
      .filter(async (dir) => !(await this.hasFileSystemEntries(dir)));

    return emptyDirectories;
  },

  async directoryExists(directoryPath: string): Promise<boolean> {
    try {
      const stat = await fs.stat(directoryPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  },

  async hasFileSystemEntries(directoryPath: string): Promise<boolean> {
    try {
      const entries = await fs.readdir(directoryPath);
      return entries.length > 0;
    } catch {
      return false;
    }
  },
};
