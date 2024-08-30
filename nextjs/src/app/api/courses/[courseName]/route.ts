import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function PUT(
  request: Request,
  { params: { courseName } }: { params: { courseName: string } }
) {
  const { updatedCourse, previousCourse } = await request.json();

  console.log(updatedCourse);
  console.log(courseName);

  // await fileStorageService.saveCourseAsync(updatedCourse, previousCourse);
  return Response.json({});
}
