import publicProcedure from "../procedures/public";
import { z } from "zod";
import { router } from "../trpc";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { zodLocalCoursePage } from "@/models/local/page/localCoursePage";

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
      return await fileStorageService.pages.getPage(
        courseName,
        moduleName,
        pageName
      );
    }),

  getAllPages: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
      })
    )
    .query(async ({ input: { courseName, moduleName } }) => {
      return await fileStorageService.pages.getPages(courseName, moduleName);
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
      await fileStorageService.pages.updatePage({
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
        await fileStorageService.pages.updatePage({
          courseName,
          moduleName,
          pageName,
          page,
        });

        if (
          page.name !== previousPageName ||
          moduleName !== previousModuleName
        ) {
          fileStorageService.pages.delete({
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
      await fileStorageService.pages.delete({
        courseName,
        moduleName,
        pageName,
      });
    }),
});
