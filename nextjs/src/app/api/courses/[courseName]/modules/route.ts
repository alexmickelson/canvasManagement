import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const GET = async (
  _request: Request,
  { params: { courseName } }: { params: { courseName: string } }
) =>
  await withErrorHandling(async () => {
    const settings = await fileStorageService.modules.getModuleNames(courseName);
    return Response.json(settings);
  });

export const POST = async (
  request: Request,
  { params: { courseName } }: { params: { courseName: string } }
) =>
  await withErrorHandling(async () => {
    const { moduleName } = await request.json();
    await fileStorageService.modules.createModule(courseName, moduleName);
    return Response.json({});
  });
