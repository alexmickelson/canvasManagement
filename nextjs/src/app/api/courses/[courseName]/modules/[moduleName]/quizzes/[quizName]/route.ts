import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const GET = async (
  _request: Request,
  {
    params: { courseName, moduleName, quizName },
  }: { params: { courseName: string; moduleName: string; quizName: string } }
) =>
  await withErrorHandling(async () => {
    const quiz = await fileStorageService.quizzes.getQuiz(
      courseName,
      moduleName,
      quizName
    );
    return Response.json(quiz);
  });

export const PUT = async (
  request: Request,
  {
    params: { courseName, moduleName, quizName },
  }: { params: { courseName: string; moduleName: string; quizName: string } }
) =>
  await withErrorHandling(async () => {
    const { quiz, previousModuleName, previousQuizName } =
      (await request.json()) as {
        quiz: LocalQuiz;
        previousModuleName?: string;
        previousQuizName?: string;
      };
    await fileStorageService.quizzes.updateQuiz(
      courseName,
      moduleName,
      quizName,
      quiz
    );

    if (
      previousModuleName &&
      previousQuizName &&
      (quiz.name !== previousQuizName ||
        moduleName !== previousModuleName)
    ) {
      fileStorageService.quizzes.delete({
        courseName,
        moduleName: previousModuleName,
        quizName: previousQuizName,
      });
    }
    return Response.json({});
  });

export const POST = async (
  request: Request,
  {
    params: { courseName, moduleName, quizName },
  }: { params: { courseName: string; moduleName: string; quizName: string } }
) =>
  await withErrorHandling(async () => {
    const quiz = await request.json();
    await fileStorageService.quizzes.updateQuiz(
      courseName,
      moduleName,
      quizName,
      quiz
    );
    return Response.json({});
  });
