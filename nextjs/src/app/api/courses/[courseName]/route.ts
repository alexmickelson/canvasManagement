import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function PUT(
  request: Request,
  { params: { courseName } }: { params: { courseName: string } }
) {
  const { updatedCourse, previousCourse } = await request.json();

  console.log(updatedCourse);
  console.log(courseName);

  await fileStorageService.saveCourseAsync(updatedCourse, previousCourse);
  return Response.json({});
}

export async function GET(
  request: Request,
  { params: { courseName } }: { params: { courseName: string } }
) {
  const courses = await fileStorageService.loadSavedCourses();
  const course = courses.find((c) => c.settings.name === courseName);
  return Response.json(course);
}
