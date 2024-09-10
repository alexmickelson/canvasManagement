import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const GET = async (
  _request: Request,
  { params: { courseName } }: { params: { courseName: string } }
) =>
  await withErrorHandling(async () => {
    if (courseName.includes(".js.map")) {
      return Response.json({});
    }
    const settings = await fileStorageService.getCourseSettings(courseName);
    return Response.json(settings);
  });
  
export const PUT = async (
  request: Request,
  { params: { courseName } }: { params: { courseName: string } }
) =>
  await withErrorHandling(async () => {
    const settings = await request.json();

    await fileStorageService.updateCourseSettings(courseName, settings);

    return Response.json({});
  });
