import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";
import { revalidatePath } from "next/cache";

export const GET = async (
  _request: Request,
  {
    params: { courseName, moduleName, assignmentName },
  }: {
    params: { courseName: string; moduleName: string; assignmentName: string };
  }
) =>
  await withErrorHandling(async () => {
    const assignment = await fileStorageService.assignments.getAssignment(
      courseName,
      moduleName,
      assignmentName
    );
    return Response.json(assignment);
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
    const { assignment, previousModuleName, previousAssignmentName } =
      (await request.json()) as {
        assignment: LocalAssignment;
        previousModuleName: string;
        previousAssignmentName: string;
      };

    await fileStorageService.assignments.updateOrCreateAssignment({
      courseName,
      moduleName,
      assignmentName,
      assignment,
    });

    if (
      assignment.name !== previousAssignmentName ||
      moduleName !== previousModuleName
    ) {
      fileStorageService.assignments.delete({
        courseName,
        moduleName: previousModuleName,
        assignmentName: previousAssignmentName,
      });
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

export const DELETE = async (
  _request: Request,
  {
    params: { courseName, moduleName, assignmentName },
  }: {
    params: { courseName: string; moduleName: string; assignmentName: string };
  }
) =>
  await withErrorHandling(async () => {
    fileStorageService.assignments.delete({
      courseName,
      moduleName,
      assignmentName,
    });

    return Response.json({});
  });
