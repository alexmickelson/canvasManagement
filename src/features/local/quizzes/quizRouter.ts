import publicProcedure from "../../../services/serverFunctions/publicProcedure";
import { z } from "zod";
import { router } from "../../../services/serverFunctions/trpcSetup";
import {
  LocalQuiz,
  zodLocalQuiz,
} from "@/features/local/quizzes/models/localQuiz";
import {
  getCoursePathByName,
  getGlobalSettings,
} from "../globalSettings/globalSettingsFileStorageService";
import path from "path";
import { promises as fs } from "fs";
import { quizMarkdownUtils } from "./models/utils/quizMarkdownUtils";
import { courseItemFileStorageService } from "../course/courseItemFileStorageService";
import { getFeedbackDelimitersFromSettings } from "../globalSettings/globalSettingsUtils";
import { assertValidFileName } from "@/services/fileNameValidation";

export const quizRouter = router({
  getQuiz: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        quizName: z.string(),
      })
    )
    .query(async ({ input: { courseName, moduleName, quizName } }) => {
      return await courseItemFileStorageService.getItem({
        courseName,
        moduleName,
        name: quizName,
        type: "Quiz",
      });
    }),

  getAllQuizzes: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
      })
    )
    .query(async ({ input: { courseName, moduleName } }) => {
      return await courseItemFileStorageService.getItems({
        courseName,
        moduleName,
        type: "Quiz",
      });
    }),
  createQuiz: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        quizName: z.string(),
        quiz: zodLocalQuiz,
      })
    )
    .mutation(async ({ input: { courseName, moduleName, quizName, quiz } }) => {
      await updateQuizFile({
        courseName,
        moduleName,
        quizName,
        quiz,
      });
    }),
  updateQuiz: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        previousModuleName: z.string(),
        previousQuizName: z.string(),
        quizName: z.string(),
        quiz: zodLocalQuiz,
      })
    )
    .mutation(
      async ({
        input: {
          courseName,
          moduleName,
          quizName,
          quiz,
          previousModuleName,
          previousQuizName,
        },
      }) => {
        await updateQuizFile({
          courseName,
          moduleName,
          quizName,
          quiz,
        });

        if (
          quizName !== previousQuizName ||
          moduleName !== previousModuleName
        ) {
          await deleteQuizFile({
            courseName,
            moduleName: previousModuleName,
            quizName: previousQuizName,
          });
        }
      }
    ),
  deleteQuiz: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        quizName: z.string(),
      })
    )
    .mutation(async ({ input: { courseName, moduleName, quizName } }) => {
      await deleteQuizFile({
        courseName,
        moduleName,
        quizName,
      });
    }),
});

export async function deleteQuizFile({
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
}

export async function updateQuizFile({
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
  assertValidFileName(quizName);
  const courseDirectory = await getCoursePathByName(courseName);
  const folder = path.join(courseDirectory, moduleName, "quizzes");
  await fs.mkdir(folder, { recursive: true });
  const filePath = path.join(
    courseDirectory,
    moduleName,
    "quizzes",
    quizName + ".md"
  );

  const globalSettings = await getGlobalSettings();
  const delimiters = getFeedbackDelimitersFromSettings(globalSettings);
  const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz, delimiters);
  console.log(`Saving quiz ${filePath}`);
  await fs.writeFile(filePath, quizMarkdown);
}
