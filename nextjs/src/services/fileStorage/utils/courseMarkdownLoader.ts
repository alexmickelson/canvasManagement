import {
  LocalAssignment,
  localAssignmentMarkdown,
} from "@/models/local/assignmnet/localAssignment";
import {
  LocalCourse,
  LocalCourseSettings,
  localCourseYamlUtils,
} from "@/models/local/localCourse";
import { LocalModule } from "@/models/local/localModules";
import {
  LocalCoursePage,
  localPageMarkdownUtils,
} from "@/models/local/page/localCoursePage";
import {
  LocalQuiz,
  localQuizMarkdownUtils,
} from "@/models/local/quiz/localQuiz";
import { promises as fs } from "fs";
import path from "path";
import { directoryOrFileExists } from "./fileSystemUtils";

const basePath = process.env.STORAGE_DIRECTORY ?? "./storage";

export const courseMarkdownLoader = {
  // async loadSavedCourses(): Promise<LocalCourse[]> {
  //   const courseDirectories = await fs.readdir(basePath, {
  //     withFileTypes: true,
  //   });
  //   const coursePromises = courseDirectories
  //     .filter((dirent) => dirent.isDirectory())
  //     .map(async (dirent) => {
  //       const coursePath = path.join(basePath, dirent.name);
  //       const settingsPath = path.join(coursePath, "settings.yml");
  //       if (await directoryOrFileExists(settingsPath)) {
  //         return this.loadCourseByPath(coursePath);
  //       }
  //       return null;
  //     });

  //   const courses = (await Promise.all(coursePromises)).filter(
  //     (course) => course !== null
  //   ) as LocalCourse[];
  //   return courses.sort((a, b) =>
  //     a.settings.name.localeCompare(b.settings.name)
  //   );
  // },

  // async loadCourseByPath(courseDirectory: string): Promise<LocalCourse> {
  //   if (!(await directoryOrFileExists(courseDirectory))) {
  //     const errorMessage = `Error loading course by name, could not find folder ${courseDirectory}`;
  //     console.log(errorMessage);
  //     throw new Error(errorMessage);
  //   }

  //   const settings = await this.loadCourseSettings(courseDirectory);
  //   const modules = await this.loadCourseModules(courseDirectory);

  //   return {
  //     settings,
  //     modules,
  //   };
  // },

  // async loadCourseSettings(
  //   courseDirectory: string
  // ): Promise<LocalCourseSettings> {
  //   const settingsPath = path.join(courseDirectory, "settings.yml");
  //   if (!(await directoryOrFileExists(settingsPath))) {
  //     const errorMessage = `Error loading course by name, settings file ${settingsPath}`;
  //     console.log(errorMessage);
  //     throw new Error(errorMessage);
  //   }

  //   const settingsString = await fs.readFile(settingsPath, "utf-8");
  //   const settings = localCourseYamlUtils.parseSettingYaml(settingsString);

  //   const folderName = path.basename(courseDirectory);
  //   return { ...settings, name: folderName };
  // },

  // async loadCourseModules(courseDirectory: string): Promise<LocalModule[]> {
  //   const moduleDirectories = await fs.readdir(courseDirectory, {
  //     withFileTypes: true,
  //   });
  //   const modulePromises = moduleDirectories
  //     .filter((dirent) => dirent.isDirectory())
  //     .map((dirent) =>
  //       this.loadModuleFromPath(path.join(courseDirectory, dirent.name))
  //     );

  //   const modules = await Promise.all(modulePromises);
  //   return modules.sort((a, b) => a.name.localeCompare(b.name));
  // },

  // async loadModuleFromPath(modulePath: string): Promise<LocalModule> {
  //   const moduleName = path.basename(modulePath);
  //   const assignments = await this.loadAssignmentsFromPath(modulePath);
  //   const quizzes = await this.loadQuizzesFromPath(modulePath);
  //   const pages = await this.loadModulePagesFromPath(modulePath);

  //   return {
  //     name: moduleName,
  //     assignments,
  //     quizzes,
  //     pages,
  //   };
  // },

  // async loadAssignmentsFromPath(
  //   modulePath: string
  // ): Promise<LocalAssignment[]> {
  //   const assignmentsPath = path.join(modulePath, "assignments");
  //   if (!(await directoryOrFileExists(assignmentsPath))) {
  //     console.log(
  //       `Error loading course by name, assignments folder does not exist in ${modulePath}`
  //     );
  //     await fs.mkdir(assignmentsPath);
  //   }

  //   const assignmentFiles = await fs.readdir(assignmentsPath);
  //   const assignmentPromises = assignmentFiles.map(async (file) => {
  //     const filePath = path.join(assignmentsPath, file);
  //     const rawFile = (await fs.readFile(filePath, "utf-8")).replace(
  //       /\r\n/g,
  //       "\n"
  //     );
  //     return localAssignmentMarkdown.parseMarkdown(rawFile);
  //   });

  //   return await Promise.all(assignmentPromises);
  // },

  // async loadQuizzesFromPath(modulePath: string): Promise<LocalQuiz[]> {
  //   const quizzesPath = path.join(modulePath, "quizzes");
  //   if (!(await directoryOrFileExists(quizzesPath))) {
  //     console.log(
  //       `Quizzes folder does not exist in ${modulePath}, creating now`
  //     );
  //     await fs.mkdir(quizzesPath);
  //   }

  //   const quizFiles = await fs.readdir(quizzesPath);
  //   const quizPromises = quizFiles.map(async (file) => {
  //     const filePath = path.join(quizzesPath, file);
  //     const rawQuiz = (await fs.readFile(filePath, "utf-8")).replace(
  //       /\r\n/g,
  //       "\n"
  //     );
  //     return localQuizMarkdownUtils.parseMarkdown(rawQuiz);
  //   });

  //   return await Promise.all(quizPromises);
  // },

  // async loadModulePagesFromPath(
  //   modulePath: string
  // ): Promise<LocalCoursePage[]> {
  //   const pagesPath = path.join(modulePath, "pages");
  //   if (!(await directoryOrFileExists(pagesPath))) {
  //     console.log(`Pages folder does not exist in ${modulePath}, creating now`);
  //     await fs.mkdir(pagesPath);
  //   }

  //   const pageFiles = await fs.readdir(pagesPath);
  //   const pagePromises = pageFiles.map(async (file) => {
  //     const filePath = path.join(pagesPath, file);
  //     const rawPage = (await fs.readFile(filePath, "utf-8")).replace(
  //       /\r\n/g,
  //       "\n"
  //     );
  //     return localPageMarkdownUtils.parseMarkdown(rawPage);
  //   });

  //   return await Promise.all(pagePromises);
  // },
};
