import { localPageMarkdownUtils, LocalCoursePage } from "@/models/local/page/localCoursePage";
import { promises as fs } from "fs";
import path from "path";
import { basePath, directoryOrFileExists } from "./utils/fileSystemUtils";

export const pageFileStorageService = {
  async getPageNames(courseName: string, moduleName: string) {
    const filePath = path.join(basePath, courseName, moduleName, "pages");
    if (!(await directoryOrFileExists(filePath))) {
      console.log(
        `Error loading course by name, pages folder does not exist in ${filePath}`
      );
      await fs.mkdir(filePath);
    }

    const files = await fs.readdir(filePath);
    return files.map((f) => f.replace(/\.md$/, ""));
  },

  async getPage(courseName: string, moduleName: string, pageName: string) {
    const filePath = path.join(
      basePath,
      courseName,
      moduleName,
      "pages",
      pageName + ".md"
    );
    const rawFile = (await fs.readFile(filePath, "utf-8")).replace(
      /\r\n/g,
      "\n"
    );
    return localPageMarkdownUtils.parseMarkdown(rawFile);
  },
  async updatePage(
    courseName: string,
    moduleName: string,
    pageName: string,
    page: LocalCoursePage
  ) {
    const folder = path.join(basePath, courseName, moduleName, "pages");
    await fs.mkdir(folder, { recursive: true });

    const filePath = path.join(
      basePath,
      courseName,
      moduleName,
      "pages",
      page.name + ".md"
    );

    const pageMarkdown = localPageMarkdownUtils.toMarkdown(page);
    console.log(`Saving page ${filePath}`);
    await fs.writeFile(filePath, pageMarkdown);

    const pageNameIsChanged = pageName !== page.name;
    if (pageNameIsChanged) {
      console.log("removing old page after name change " + pageName);
      const oldFilePath = path.join(
        basePath,
        courseName,
        moduleName,
        "pages",
        pageName + ".md"
      );
      await fs.unlink(oldFilePath);
    }
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
    await fs.unlink(filePath)
  }
};