import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function GET(
  _request: Request,
  {
    params: { courseName, moduleName },
  }: { params: { courseName: string; moduleName: string } }
) {
  const settings = await fileStorageService.getPageNames(
    courseName,
    moduleName
  );
  return Response.json(settings);
}