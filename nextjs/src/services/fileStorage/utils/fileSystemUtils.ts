import { promises as fs } from "fs";

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