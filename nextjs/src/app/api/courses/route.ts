import { LocalCourse } from "@/models/local/localCourse";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const GET = async () =>
  await withErrorHandling(async () => {
    const courses = await fileStorageService.getCourseNames();
    return Response.json(courses);
  });

export const POST = async (request: Request) =>
  await withErrorHandling(async () => {
    const newCourse: LocalCourse = await request.json();
    await fileStorageService.settings.updateCourseSettings(
      newCourse.settings.name,
      newCourse.settings
    );
    return Response.json({});
  });
