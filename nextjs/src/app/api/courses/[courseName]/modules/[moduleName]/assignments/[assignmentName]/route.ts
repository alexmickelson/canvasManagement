import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function GET(
  _request: Request,
  {
    params: { courseName, moduleName, assignmentName },
  }: {
    params: { courseName: string; moduleName: string; assignmentName: string };
  }
) {
  const settings = await fileStorageService.getAssignment(
    courseName,
    moduleName,
    assignmentName
  );
  return Response.json(settings);
}
