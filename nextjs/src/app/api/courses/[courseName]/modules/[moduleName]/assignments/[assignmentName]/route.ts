import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const GET = async (
  _request: Request,
  {
    params: { courseName, moduleName, assignmentName },
  }: {
    params: { courseName: string; moduleName: string; assignmentName: string };
  }
) =>
  await withErrorHandling(async () => {
    const settings = await fileStorageService.getAssignment(
      courseName,
      moduleName,
      assignmentName
    );
    return Response.json(settings);
  });

export const PUT = async (
  request: Request,
  {
    params: { courseName, moduleName, assignmentName },
  }: {
    params: { courseName: string; moduleName: string; assignmentName: string };
  }
) =>
  await withErrorHandling(async () => {
    const assignment = await request.json();
    await fileStorageService.updateAssignment(
      courseName,
      moduleName,
      assignmentName,
      assignment
    );
    return Response.json({});
  });
