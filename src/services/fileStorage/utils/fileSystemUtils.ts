import { promises as fs } from "fs";
import { getGlobalSettings } from "../../../features/local/globalSettings/globalSettingsFileStorageService";

export const directoryOrFileExists = async (
  directoryPath: string
): Promise<boolean> => {
  try {
    await fs.access(directoryPath);
    return true;
  } catch {
    return false;
  }
};

export async function getCourseNames() {
  console.log("loading course ids");
  const globalSettings = await getGlobalSettings();
  return globalSettings.courses.map((course) => course.name);
}

export const basePath = process.env.STORAGE_DIRECTORY ?? "./storage";
console.log("base path", basePath);
