import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function GET(
  _request: Request,
  { params: { courseName } }: { params: { courseName: string } }
) {
  const settings = await fileStorageService.getModuleNames(courseName)
  return Response.json(settings);
}
