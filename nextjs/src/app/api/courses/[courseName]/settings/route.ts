import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function GET(
  _request: Request,
  { params: { courseName } }: { params: { courseName: string } }
) {
  if (courseName.includes(".js.map")) {
    return Response.json({});
  }
  const settings = await fileStorageService.getCourseSettings(courseName);
  return Response.json(settings);
}
