import { promises as fs } from "fs";
import path from "path";
import {
  LocalCourseSettings,
  localCourseYamlUtils,
} from "@/models/local/localCourse";
import { directoryOrFileExists } from "./utils/fileSystemUtils";
import {
  LocalAssignment,
  localAssignmentMarkdown,
} from "@/models/local/assignment/localAssignment";
import {
  LocalQuiz,
  localQuizMarkdownUtils,
} from "@/models/local/quiz/localQuiz";
import {
  LocalCoursePage,
  localPageMarkdownUtils,
} from "@/models/local/page/localCoursePage";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import { assignmentMarkdownSerializer } from "@/models/local/assignment/utils/assignmentMarkdownSerializer";

const basePath = process.env.STORAGE_DIRECTORY ?? "./storage";
console.log("base path", basePath);

export const fileStorageService = {
  async getCourseNames() {
    console.log("loading course ids");
    const courseDirectories = await fs.readdir(basePath, {
      withFileTypes: true,
    });
    const coursePromises = await Promise.all(
      courseDirectories
        .filter((dirent) => dirent.isDirectory())
        .map(async (dirent) => {
          const coursePath = path.join(basePath, dirent.name);
          const settingsPath = path.join(coursePath, "settings.yml");
          const hasSettings = await directoryOrFileExists(settingsPath);
          return {
            dirent,
            hasSettings,
          };
        })
    );

    const courseNamesFromDirectories = coursePromises
      .filter(({ hasSettings }) => hasSettings)
      .map(({ dirent }) => dirent.name);

    return courseNamesFromDirectories;
  },
  settings: {
    async getAllCoursesSettings() {
      const courses = await fileStorageService.getCourseNames();

      const courseSettings = await Promise.all(
        courses.map(
          async (c) => await fileStorageService.settings.getCourseSettings(c)
        )
      );
      return courseSettings;
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
  },
  modules: {
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
    async createModule(courseName: string, moduleName: string) {
      const courseDirectory = path.join(basePath, courseName);

      await fs.mkdir(courseDirectory + "/" + moduleName, { recursive: true });
    },
  },
  assignments: {
    async getAssignmentNames(courseName: string, moduleName: string) {
      const filePath = path.join(
        basePath,
        courseName,
        moduleName,
        "assignments"
      );
      if (!(await directoryOrFileExists(filePath))) {
        console.log(
          `Error loading course by name, assignments folder does not exist in ${filePath}`
        );
        await fs.mkdir(filePath);
      }

      const assignmentFiles = await fs.readdir(filePath);
      return assignmentFiles.map((f) => f.replace(/\.md$/, ""));
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
        assignmentName + ".md"
      );
      const rawFile = (await fs.readFile(filePath, "utf-8")).replace(
        /\r\n/g,
        "\n"
      );
      return localAssignmentMarkdown.parseMarkdown(rawFile);
    },
    async updateAssignment(
      courseName: string,
      moduleName: string,
      assignmentName: string,
      assignment: LocalAssignment
    ) {
      const filePath = path.join(
        basePath,
        courseName,
        moduleName,
        "assignments",
        assignmentName + ".md"
      );

      const assignmentMarkdown =
        assignmentMarkdownSerializer.toMarkdown(assignment);
      console.log(`Saving assignment ${filePath}`);
      await fs.writeFile(filePath, assignmentMarkdown);
    },
  },
  quizzes: {
    async getQuizNames(courseName: string, moduleName: string) {
      const filePath = path.join(basePath, courseName, moduleName, "quizzes");
      if (!(await directoryOrFileExists(filePath))) {
        console.log(
          `Error loading course by name, quiz folder does not exist in ${filePath}`
        );
        await fs.mkdir(filePath);
      }

      const files = await fs.readdir(filePath);
      return files.map((f) => f.replace(/\.md$/, ""));
    },
    async getQuiz(courseName: string, moduleName: string, quizName: string) {
      const filePath = path.join(
        basePath,
        courseName,
        moduleName,
        "quizzes",
        quizName + ".md"
      );
      const rawFile = (await fs.readFile(filePath, "utf-8")).replace(
        /\r\n/g,
        "\n"
      );
      return localQuizMarkdownUtils.parseMarkdown(rawFile);
    },

    async updateQuiz(
      courseName: string,
      moduleName: string,
      quizName: string,
      quiz: LocalQuiz
    ) {
      const filePath = path.join(
        basePath,
        courseName,
        moduleName,
        "quizzes",
        quizName + ".md"
      );

      const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz);
      console.log(`Saving quiz ${filePath}`);
      await fs.writeFile(filePath, quizMarkdown);
    },
  },
  pages: {
    async getPageNames(courseName: string, moduleName: string) {
      const filePath = path.join(basePath, courseName, moduleName, "pages");
      if (!(await directoryOrFileExists(filePath))) {
        console.log(
          `Error loading course by name, pages folder does not exist in ${filePath}`
        );
        await fs.mkdir(filePath);
      }

      const files = await fs.readdir(filePath);
      return files.map((f) => f.replace(/\.md$/, ""));
    },

    async getPage(courseName: string, moduleName: string, pageName: string) {
      const filePath = path.join(
        basePath,
        courseName,
        moduleName,
        "pages",
        pageName + ".md"
      );
      const rawFile = (await fs.readFile(filePath, "utf-8")).replace(
        /\r\n/g,
        "\n"
      );
      return localPageMarkdownUtils.parseMarkdown(rawFile);
    },
    async updatePage(
      courseName: string,
      moduleName: string,
      pageName: string,
      page: LocalCoursePage
    ) {
      const filePath = path.join(
        basePath,
        courseName,
        moduleName,
        "pages",
        page.name + ".md"
      );

      const pageMarkdown = localPageMarkdownUtils.toMarkdown(page);
      console.log(`Saving page ${filePath}`);
      await fs.writeFile(filePath, pageMarkdown);

      const pageNameIsChanged = pageName !== page.name;
      if (pageNameIsChanged) {
        console.log("removing old page after name change " + pageName);
        const oldFilePath = path.join(
          basePath,
          courseName,
          moduleName,
          "pages",
          pageName + ".md"
        );
        await fs.unlink(oldFilePath);
      }
    },
  },

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
};
