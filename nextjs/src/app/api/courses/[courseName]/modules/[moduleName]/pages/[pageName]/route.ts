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
    const { page, previousModuleName, previousPageName } = await request.json();
    await fileStorageService.pages.updatePage(
      courseName,
      moduleName,
      pageName,
      page
    );

    if (
      previousModuleName &&
      previousPageName &&
      (page.name !== previousPageName || moduleName !== previousModuleName)
    ) {
      fileStorageService.pages.delete({
        courseName,
        moduleName: previousModuleName,
        pageName: previousPageName,
      });
    }
    return Response.json({});
  });

export const POST = async (
  request: Request,
  {
    params: { courseName, moduleName, pageName },
  }: { params: { courseName: string; moduleName: string; pageName: string } }
) =>
  await withErrorHandling(async () => {
    const page = await request.json();
    await fileStorageService.pages.updatePage(
      courseName,
      moduleName,
      pageName,
      page
    );
    return Response.json({});
  });
