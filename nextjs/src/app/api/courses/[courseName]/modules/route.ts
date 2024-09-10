import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const GET = async (
  _request: Request,
  { params: { courseName } }: { params: { courseName: string } }
) =>
  await withErrorHandling(async () => {
    const settings = await fileStorageService.getModuleNames(courseName);
    return Response.json(settings);
  });
