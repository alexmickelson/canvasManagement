import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import path from "path";
import { promises as fs } from "fs";
import { courseItemFileStorageService } from "./courseItemFileStorageService";
import { getCoursePathByName } from "./globalSettingsFileStorageService";

export const quizFileStorageService = {
  getQuiz: async (courseName: string, moduleName: string, quizName: string) =>
    await courseItemFileStorageService.getItem(
      courseName,
      moduleName,
      quizName,
      "Quiz"
    ),
  getQuizzes: async (courseName: string, moduleName: string) =>
    await courseItemFileStorageService.getItems(courseName, moduleName, "Quiz"),

  async updateQuiz({
    courseName,
    moduleName,
    quizName,
    quiz,
  }: {
    courseName: string;
    moduleName: string;
    quizName: string;
    quiz: LocalQuiz;
  }) {
    const courseDirectory = await getCoursePathByName(courseName);
    const folder = path.join(courseDirectory, moduleName, "quizzes");
    await fs.mkdir(folder, { recursive: true });
    const filePath = path.join(
      courseDirectory,
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
    const courseDirectory = await getCoursePathByName(courseName);
    const filePath = path.join(
      courseDirectory,
      moduleName,
      "quizzes",
      quizName + ".md"
    );
    console.log("removing quiz", filePath);
    await fs.unlink(filePath);
  },
};
