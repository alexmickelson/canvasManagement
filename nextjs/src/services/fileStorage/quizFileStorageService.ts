import {
  localQuizMarkdownUtils,
  LocalQuiz,
} from "@/models/local/quiz/localQuiz";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import path from "path";
import { basePath, directoryOrFileExists } from "./utils/fileSystemUtils";
import { promises as fs } from "fs";

export const quizFileStorageService = {
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
    const folder = path.join(basePath, courseName, moduleName, "quizzes");
    await fs.mkdir(folder, { recursive: true });
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
};
