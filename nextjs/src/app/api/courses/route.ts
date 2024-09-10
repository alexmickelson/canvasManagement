import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const GET = async () =>
 await withErrorHandling(async () => {
    const courses = await fileStorageService.getCourseNames();
    return Response.json(courses);
  });
