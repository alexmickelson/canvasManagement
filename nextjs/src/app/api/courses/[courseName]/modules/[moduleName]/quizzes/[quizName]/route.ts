import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function GET(
  _request: Request,
  {
    params: { courseName, moduleName, quizName },
  }: { params: { courseName: string; moduleName: string; quizName: string } }
) {
  const quiz = await fileStorageService.getQuiz(
    courseName,
    moduleName,
    quizName
  );
  return Response.json(quiz);
}

export async function PUT(
  request: Request,
  {
    params: { courseName, moduleName, quizName },
  }: { params: { courseName: string; moduleName: string; quizName: string } }
) {
  const quiz = await request.json()
  await fileStorageService.updateQuiz(
    courseName,
    moduleName,
    quizName,
    quiz
  );
  return Response.json({});
}
