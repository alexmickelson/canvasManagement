"use server";
import {
  LocalCourseSettings,
} from "@/models/local/localCourseSettings";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function getCourseSettingsFromServer({
  courseName,
}: {
  courseName: string;
}) {
  return await fileStorageService.settings.getCourseSettings(courseName);
}
export async function getAllCoursesSettingsFromServer() {
  return await fileStorageService.settings.getAllCoursesSettings();
}

// export async function createCourseOnServer({
//   course,
// }: {
//   course: LocalCourse;
// }) {
//   await fileStorageService.settings.updateCourseSettings(
//     course.settings.name,
//     course.settings
//   );
// }

// export async function updateCourseSettingsOnServer({
//   courseName,
//   settings,
// }: {
//   courseName: string;
//   settings: LocalCourseSettings;
// }) {
//   await fileStorageService.settings.updateCourseSettings(courseName, settings);
// }
