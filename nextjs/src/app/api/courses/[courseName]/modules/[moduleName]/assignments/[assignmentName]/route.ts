import { LocalAssignment } from "@/models/local/assignment/localAssignment";
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
    const settings = await fileStorageService.assignments.getAssignment(
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
    const {
      assignment,
      previousModuleName,
    }: { assignment: LocalAssignment; previousModuleName?: string } =
      await request.json();
    await fileStorageService.assignments.updateOrCreateAssignment({
      courseName,
      moduleName,
      assignmentName,
      assignment,
    });

    if(previousModuleName !== moduleName)
    {
      fileStorageService.assignments.
    }

    return Response.json({});
  });

export const POST = async (
  request: Request,
  {
    params: { courseName, moduleName, assignmentName },
  }: {
    params: { courseName: string; moduleName: string; assignmentName: string };
  }
) =>
  await withErrorHandling(async () => {
    const assignment = await request.json();
    await fileStorageService.assignments.updateOrCreateAssignment({
      courseName,
      moduleName,
      assignmentName,
      assignment,
    });
    return Response.json({});
  });
