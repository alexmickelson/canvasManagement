import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function GET() {
  const courses = await fileStorageService.loadSavedCourses();
  return Response.json(courses);
}
