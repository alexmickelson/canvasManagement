import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function GET(
  _request: Request,
  {
    params: { courseName, moduleName, quizName },
  }: { params: { courseName: string; moduleName: string; quizName: string } }
) {
  const settings = await fileStorageService.getQuiz(
    courseName,
    moduleName,
    quizName
  );
  return Response.json(settings);
}
