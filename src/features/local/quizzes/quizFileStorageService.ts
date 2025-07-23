import path from "path";
import { promises as fs } from "fs";
import { courseItemFileStorageService } from "../course/courseItemFileStorageService";
import { getCoursePathByName } from "../globalSettings/globalSettingsFileStorageService";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";
import { quizMarkdownUtils } from "@/features/local/quizzes/models/utils/quizMarkdownUtils";

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
