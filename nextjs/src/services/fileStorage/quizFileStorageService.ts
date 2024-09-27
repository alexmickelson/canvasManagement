import {
  localQuizMarkdownUtils,
  LocalQuiz,
} from "@/models/local/quiz/localQuiz";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import path from "path";
import { basePath, directoryOrFileExists } from "./utils/fileSystemUtils";
import { promises as fs } from "fs";

const getQuizNames = async (courseName: string, moduleName: string) => {
  const filePath = path.join(basePath, courseName, moduleName, "quizzes");
  if (!(await directoryOrFileExists(filePath))) {
    console.log(
      `Error loading course by name, quiz folder does not exist in ${filePath}`
    );
    await fs.mkdir(filePath);
  }

  const files = await fs.readdir(filePath);
  return files.map((f) => f.replace(/\.md$/, ""));
};

const getQuiz = async (
  courseName: string,
  moduleName: string,
  quizName: string
) => {
  const filePath = path.join(
    basePath,
    courseName,
    moduleName,
    "quizzes",
    quizName + ".md"
  );
  const rawFile = (await fs.readFile(filePath, "utf-8")).replace(/\r\n/g, "\n");
  return localQuizMarkdownUtils.parseMarkdown(rawFile);
};

export const quizFileStorageService = {
  getQuizNames,
  getQuiz,
  async getQuizzes(courseName: string, moduleName: string) {
    const fileNames = await getQuizNames(courseName, moduleName);
    const quizzes = (
      await Promise.all(
        fileNames.map(async (name) => {
          try {
            return await getQuiz(courseName, moduleName, name);
          } catch {
            return null;
          }
        })
      )
    ).filter((a) => a !== null);

    return quizzes;
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
  async delete({
    courseName,
    moduleName,
    quizName,
  }: {
    courseName: string;
    moduleName: string;
    quizName: string;
  }) {
    const filePath = path.join(
      basePath,
      courseName,
      moduleName,
      "quizzes",
      quizName + ".md"
    );
    console.log("removing quiz", filePath);
    await fs.unlink(filePath);
  },
};
