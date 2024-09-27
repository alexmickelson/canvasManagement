import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const GET = async (
  _request: Request,
  {
    params: { courseName, moduleName },
  }: { params: { courseName: string; moduleName: string } }
) =>
  await withErrorHandling(async () => {
    const pages = await fileStorageService.pages.getPages(
      courseName,
      moduleName
    );
    return Response.json(pages);
  });
