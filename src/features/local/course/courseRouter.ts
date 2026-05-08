import { z } from "zod";
import { router } from "@/services/serverFunctions/trpcSetup";
import publicProcedure from "@/services/serverFunctions/publicProcedure";
import { fileStorageService } from "@/features/local/utils/fileStorageService";
import { getModuleNamesFromFiles } from "@/features/local/modules/moduleRouter";
import { CourseItemType, typeToFolder } from "./courseItemTypes";
import { getCoursePathByName } from "../globalSettings/globalSettingsFileStorageService";
import path from "path";
import fs from "fs/promises";
import { directoryOrFileExists } from "../utils/fileSystemUtils";

const courseItemTypes: CourseItemType[] = ["Assignment", "Quiz", "Page"];

export const courseRouter = router({
  listCourses: publicProcedure.query(async () => {
    const settings = await fileStorageService.settings.getAllCoursesSettings();
    return settings.map((s) => s.name);
  }),
  listModules: publicProcedure
    .input(z.string().describe("Course name"))
    .query(async ({ input: courseName }) => {
      return await getModuleNamesFromFiles(courseName);
    }),
  listModuleItems: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
      }),
    )
    .query(async ({ input: { courseName, moduleName } }) => {
      const courseDirectory = await getCoursePathByName(courseName);
      const results = await Promise.all(
        courseItemTypes.map(async (type) => {
          const folder = typeToFolder[type];
          const folderPath = path.join(courseDirectory, moduleName, folder);
          if (!(await directoryOrFileExists(folderPath))) return [];
          const files = await fs.readdir(folderPath);
          return files.map((f) => ({
            name: f.replace(/\.md$/, ""),
            type,
          }));
        }),
      );
      return results.flat();
    }),
});
