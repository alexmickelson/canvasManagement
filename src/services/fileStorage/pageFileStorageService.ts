import {
  localPageMarkdownUtils,
  LocalCoursePage,
} from "@/models/local/page/localCoursePage";
import { promises as fs } from "fs";
import path from "path";
import { basePath } from "./utils/fileSystemUtils";
import { courseItemFileStorageService } from "./courseItemFileStorageService";

export const pageFileStorageService = {
  getPage: async (courseName: string, moduleName: string, name: string) =>
    await courseItemFileStorageService.getItem(
      courseName,
      moduleName,
      name,
      "Page"
    ),
  getPages: async (courseName: string, moduleName: string) =>
    await courseItemFileStorageService.getItems(courseName, moduleName, "Page"),

  async updatePage({
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
    const folder = path.join(basePath, courseName, moduleName, "pages");
    await fs.mkdir(folder, { recursive: true });

    const filePath = path.join(
      basePath,
      courseName,
      moduleName,
      "pages",
      pageName + ".md"
    );

    const pageMarkdown = localPageMarkdownUtils.toMarkdown(page);
    console.log(`Saving page ${filePath}`);
    await fs.writeFile(filePath, pageMarkdown);
  },
  async delete({
    courseName,
    moduleName,
    pageName,
  }: {
    courseName: string;
    moduleName: string;
    pageName: string;
  }) {
    const filePath = path.join(
      basePath,
      courseName,
      moduleName,
      "pages",
      pageName + ".md"
    );
    console.log("removing page", filePath);
    await fs.unlink(filePath);
  },
};
