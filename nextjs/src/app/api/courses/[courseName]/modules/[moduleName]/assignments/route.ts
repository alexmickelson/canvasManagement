import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const GET = async (
  _request: Request,
  {
    params: { courseName, moduleName },
  }: { params: { courseName: string; moduleName: string } }
) => await withErrorHandling(async () => {
  const settings = await fileStorageService.assignments.getAssignmentNames(
    courseName,
    moduleName
  );
  return Response.json(settings);
})
