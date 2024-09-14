import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const GET = async (
  _request: Request,
  {
    params: { courseName, moduleName, pageName },
  }: { params: { courseName: string; moduleName: string; pageName: string } }
) =>
  await withErrorHandling(async () => {
    const settings = await fileStorageService.pages.getPage(
      courseName,
      moduleName,
      pageName
    );
    return Response.json(settings);
  });

export const PUT = async (
  request: Request,
  {
    params: { courseName, moduleName, pageName },
  }: { params: { courseName: string; moduleName: string; pageName: string } }
) =>
  await withErrorHandling(async () => {
    const page = await request.json();
    await fileStorageService.pages.updatePage(courseName, moduleName, pageName, page);
    return Response.json({});
  });
