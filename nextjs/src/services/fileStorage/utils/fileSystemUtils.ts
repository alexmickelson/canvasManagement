import { promises as fs } from "fs";
import path from "path";

export const hasFileSystemEntries = async (
  directoryPath: string
): Promise<boolean> => {
  try {
    const entries = await fs.readdir(directoryPath);
    return entries.length > 0;
  } catch {
    return false;
  }
};
export const directoryOrFileExists = async (directoryPath: string): Promise<boolean> => {
  try {
    await fs.access(directoryPath);
    return true;
  } catch {
    return false;
  }
};

export async function getCourseNames() {
  console.log("loading course ids");
  const courseDirectories = await fs.readdir(basePath, {
    withFileTypes: true,
  });
  const coursePromises = await Promise.all(
    courseDirectories
      .filter((dirent) => dirent.isDirectory())
      .map(async (dirent) => {
        const coursePath = path.join(basePath, dirent.name);
        const settingsPath = path.join(coursePath, "settings.yml");
        const hasSettings = await directoryOrFileExists(settingsPath);
        return {
          dirent,
          hasSettings,
        };
      })
  );

  const courseNamesFromDirectories = coursePromises
    .filter(({ hasSettings }) => hasSettings)
    .map(({ dirent }) => dirent.name);

  return courseNamesFromDirectories;
}



export const basePath = process.env.STORAGE_DIRECTORY ?? "./storage";
console.log("base path", basePath);