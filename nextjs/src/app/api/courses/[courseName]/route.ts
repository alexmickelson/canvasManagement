import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { withErrorHandling } from "@/services/withErrorHandling";

export const PUT = async (
  request: Request,
  { params: { courseName } }: { params: { courseName: string } }
) =>
  await withErrorHandling(async () => {
    const { updatedCourse, previousCourse } = await request.json();

    console.log(updatedCourse);
    console.log(courseName);

    // await fileStorageService.saveCourseAsync(updatedCourse, previousCourse);
    return Response.json({});
  });
