import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const GET = async () =>
  await withErrorHandling(async () => {
    const settings = await fileStorageService.settings.getAllCoursesSettings();

    return Response.json(settings);
  });
