import publicProcedure from "../procedures/public";
import { z } from "zod";
import { router } from "../trpcSetup";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { zodLocalQuiz } from "@/models/local/quiz/localQuiz";

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
      return await fileStorageService.quizzes.getQuiz(
        courseName,
        moduleName,
        quizName
      );
    }),

  getAllQuizzes: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
      })
    )
    .query(async ({ input: { courseName, moduleName } }) => {
      return await fileStorageService.quizzes.getQuizzes(
        courseName,
        moduleName
      );
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
      await fileStorageService.quizzes.updateQuiz({
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
        await fileStorageService.quizzes.updateQuiz({
          courseName,
          moduleName,
          quizName,
          quiz,
        });

        if (
          quiz.name !== previousQuizName ||
          moduleName !== previousModuleName
        ) {
          await fileStorageService.quizzes.delete({
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
      await fileStorageService.quizzes.delete({
        courseName,
        moduleName,
        quizName,
      });
    }),
});
