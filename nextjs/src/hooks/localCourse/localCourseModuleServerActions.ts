"use server";

import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function getModuleNamesFromServer({
  courseName,
}: {
  courseName: string;
}) {
  return await fileStorageService.modules.getModuleNames(courseName);
}

export async function createModuleOnServer({
  courseName,
  moduleName,
}: {
  courseName: string;
  moduleName: string;
}) {
  await fileStorageService.modules.createModule(courseName, moduleName);
}
