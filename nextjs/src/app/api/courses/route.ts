import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function GET() {
  const courses = await fileStorageService.getCourseNames();

  return Response.json(courses);
}
