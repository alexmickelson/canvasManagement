import { z } from "zod";
import { router } from "@/services/serverFunctions/trpcSetup";
import publicProcedure from "@/services/serverFunctions/publicProcedure";
import { getCoursePathByName } from "../globalSettings/globalSettingsFileStorageService";
import { promises as fs } from "fs";
import { lectureFolderName } from "../lectures/lectureUtils";

export const moduleRouter = router({
  getModuleNames: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
      })
    )
    .query(async ({ input: { courseName } }) => {
      return await getModuleNamesFromFiles(courseName);
    }),
  createModule: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
      })
    )
    .mutation(async ({ input: { courseName, moduleName } }) => {
      await createModuleFile(courseName, moduleName);
    }),
});

export async function createModuleFile(courseName: string, moduleName: string) {
  const courseDirectory = await getCoursePathByName(courseName);

  await fs.mkdir(courseDirectory + "/" + moduleName, { recursive: true });
}

export async function getModuleNamesFromFiles(courseName: string) {
  const courseDirectory = await getCoursePathByName(courseName);
  const moduleDirectories = await fs.readdir(courseDirectory, {
    withFileTypes: true,
  });

  const modulePromises = moduleDirectories
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const modules = await Promise.all(modulePromises);
  const modulesWithoutLectures = modules.filter(
    (m) => m !== lectureFolderName && !m.startsWith(".")
  );
  return modulesWithoutLectures.sort((a, b) => a.localeCompare(b));
}
