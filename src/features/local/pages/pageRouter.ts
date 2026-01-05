import publicProcedure from "../../../services/serverFunctions/publicProcedure";
import { z } from "zod";
import { router } from "../../../services/serverFunctions/trpcSetup";
import {
  LocalCoursePage,
  localPageMarkdownUtils,
  zodLocalCoursePage,
} from "@/features/local/pages/localCoursePageModels";
import { courseItemFileStorageService } from "../course/courseItemFileStorageService";
import { promises as fs } from "fs";
import path from "path";
import { getCoursePathByName } from "../globalSettings/globalSettingsFileStorageService";
import { assertValidFileName } from "@/services/fileNameValidation";

export const pageRouter = router({
  getPage: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        pageName: z.string(),
      })
    )
    .query(async ({ input: { courseName, moduleName, pageName } }) => {
      return await courseItemFileStorageService.getItem({
        courseName,
        moduleName,
        name: pageName,
        type: "Page",
      });
    }),

  getAllPages: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
      })
    )
    .query(async ({ input: { courseName, moduleName } }) => {
      return await courseItemFileStorageService.getItems({
        courseName,
        moduleName,
        type: "Page",
      });
    }),
  createPage: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        pageName: z.string(),
        page: zodLocalCoursePage,
      })
    )
    .mutation(async ({ input: { courseName, moduleName, pageName, page } }) => {
      await updatePageFile({
        courseName,
        moduleName,
        pageName,
        page,
      });
    }),
  updatePage: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        previousModuleName: z.string(),
        previousPageName: z.string(),
        pageName: z.string(),
        page: zodLocalCoursePage,
      })
    )
    .mutation(
      async ({
        input: {
          courseName,
          moduleName,
          pageName,
          page,
          previousModuleName,
          previousPageName,
        },
      }) => {
        await updatePageFile({
          courseName,
          moduleName,
          pageName,
          page,
        });

        if (
          pageName !== previousPageName ||
          moduleName !== previousModuleName
        ) {
          await deletePageFile({
            courseName,
            moduleName: previousModuleName,
            pageName: previousPageName,
          });
        }
      }
    ),
  deletePage: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        pageName: z.string(),
      })
    )
    .mutation(async ({ input: { courseName, moduleName, pageName } }) => {
      await deletePageFile({
        courseName,
        moduleName,
        pageName,
      });
    }),
});

export async function updatePageFile({
  courseName,
  moduleName,
  pageName,
  page,
}: {
  courseName: string;
  moduleName: string;
  pageName: string;
  page: LocalCoursePage;
}) {
  assertValidFileName(pageName);
  const courseDirectory = await getCoursePathByName(courseName);
  const folder = path.join(courseDirectory, moduleName, "pages");
  await fs.mkdir(folder, { recursive: true });

  const filePath = path.join(
    courseDirectory,
    moduleName,
    "pages",
    pageName + ".md"
  );

  const pageMarkdown = localPageMarkdownUtils.toMarkdown(page);
  console.log(`Saving page ${filePath}`);
  await fs.writeFile(filePath, pageMarkdown);
}
async function deletePageFile({
  courseName,
  moduleName,
  pageName,
}: {
  courseName: string;
  moduleName: string;
  pageName: string;
}) {
  const courseDirectory = await getCoursePathByName(courseName);
  const filePath = path.join(
    courseDirectory,
    moduleName,
    "pages",
    pageName + ".md"
  );
  console.log("removing page", filePath);
  await fs.unlink(filePath);
}
