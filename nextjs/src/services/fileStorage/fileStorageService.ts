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
import { localAssignmentMarkdown } from "@/models/local/assignmnet/localAssignment";
import { localQuizMarkdownUtils } from "@/models/local/quiz/localQuiz";
import { localPageMarkdownUtils } from "@/models/local/page/localCoursePage";

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
      .map((dirent) => dirent.name);

    const modules = await Promise.all(modulePromises);
    return modules.sort((a, b) => a.localeCompare(b));
  },

  async getAssignmentNames(courseName: string, moduleName: string) {
    const filePath = path.join(basePath, courseName, moduleName, "assignments");
    if (!(await directoryOrFileExists(filePath))) {
      console.log(
        `Error loading course by name, assignments folder does not exist in ${filePath}`
      );
      await fs.mkdir(filePath);
    }

    const assignmentFiles = await fs.readdir(filePath);
    return assignmentFiles;
  },
  async getQuizNames(courseName: string, moduleName: string) {
    const filePath = path.join(basePath, courseName, moduleName, "quizzes");
    if (!(await directoryOrFileExists(filePath))) {
      console.log(
        `Error loading course by name, quiz folder does not exist in ${filePath}`
      );
      await fs.mkdir(filePath);
    }

    const files = await fs.readdir(filePath);
    return files;
  },
  async getPageNames(courseName: string, moduleName: string) {
    const filePath = path.join(basePath, courseName, moduleName, "pages");
    if (!(await directoryOrFileExists(filePath))) {
      console.log(
        `Error loading course by name, pages folder does not exist in ${filePath}`
      );
      await fs.mkdir(filePath);
    }

    const files = await fs.readdir(filePath);
    return files;
  },

  async getAssignment(
    courseName: string,
    moduleName: string,
    assignmentName: string
  ) {
    const filePath = path.join(
      basePath,
      courseName,
      moduleName,
      "assignments",
      assignmentName
    );
    const rawFile = (await fs.readFile(filePath, "utf-8")).replace(
      /\r\n/g,
      "\n"
    );
    return localAssignmentMarkdown.parseMarkdown(rawFile);
  },

  async getQuiz(courseName: string, moduleName: string, quizName: string) {
    const filePath = path.join(
      basePath,
      courseName,
      moduleName,
      "quizzes",
      quizName
    );
    const rawFile = (await fs.readFile(filePath, "utf-8")).replace(
      /\r\n/g,
      "\n"
    );
    return localQuizMarkdownUtils.parseMarkdown(rawFile);
  },

  async getPage(courseName: string, moduleName: string, pageName: string) {
    const filePath = path.join(
      basePath,
      courseName,
      moduleName,
      "pages",
      pageName
    );
    const rawFile = (await fs.readFile(filePath, "utf-8")).replace(
      /\r\n/g,
      "\n"
    );
    return localPageMarkdownUtils.parseMarkdown(rawFile);
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
