import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const GET = async (
  _request: Request,
  {
    params: { courseName, moduleName },
  }: { params: { courseName: string; moduleName: string } }
) =>
  await withErrorHandling(async () => {
    const names = await fileStorageService.assignments.getAssignmentNames(
      courseName,
      moduleName
    );
    const assignments = (
      await Promise.all(
        names.map(async (name) => {
          try {
            return await fileStorageService.assignments.getAssignment(
              courseName,
              moduleName,
              name
            );
          } catch {
            return null;
          }
        })
      )
    ).filter((a) => a !== null);
    
    return Response.json(assignments);
  });
