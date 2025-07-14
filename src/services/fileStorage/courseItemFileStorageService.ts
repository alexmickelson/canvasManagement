import path from "path";
import { basePath, directoryOrFileExists } from "./utils/fileSystemUtils";
import fs from "fs/promises";
import {
  LocalAssignment,
  localAssignmentMarkdown,
} from "@/models/local/assignment/localAssignment";
import {
  LocalQuiz,
  localQuizMarkdownUtils,
} from "@/models/local/quiz/localQuiz";
import {
  LocalCoursePage,
  localPageMarkdownUtils,
} from "@/models/local/page/localCoursePage";
import { assignmentMarkdownSerializer } from "@/models/local/assignment/utils/assignmentMarkdownSerializer";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import {
  CourseItemReturnType,
  CourseItemType,
  typeToFolder,
} from "@/models/local/courseItemTypes";

const getItemFileNames = async (
  courseName: string,
  moduleName: string,
  type: CourseItemType
) => {
  const folder = typeToFolder[type];
  const filePath = path.join(basePath, courseName, moduleName, folder);
  if (!(await directoryOrFileExists(filePath))) {
    console.log(
      `Error loading ${type}, ${folder} folder does not exist in ${filePath}`
    );
    await fs.mkdir(filePath);
  }

  const itemFiles = await fs.readdir(filePath);
  return itemFiles.map((f) => f.replace(/\.md$/, ""));
};

const getItem = async <T extends CourseItemType>(
  courseName: string,
  moduleName: string,
  name: string,
  type: T
): Promise<CourseItemReturnType<T>> => {
  const folder = typeToFolder[type];
  const filePath = path.join(
    basePath,
    courseName,
    moduleName,
    folder,
    name + ".md"
  );
  const rawFile = (await fs.readFile(filePath, "utf-8")).replace(/\r\n/g, "\n");
  if (type === "Assignment") {
    return localAssignmentMarkdown.parseMarkdown(
      rawFile,
      name
    ) as CourseItemReturnType<T>;
  } else if (type === "Quiz") {
    return localQuizMarkdownUtils.parseMarkdown(
      rawFile, name
    ) as CourseItemReturnType<T>;
  } else if (type === "Page") {
    return localPageMarkdownUtils.parseMarkdown(
      rawFile, name
    ) as CourseItemReturnType<T>;
  }

  throw Error(`cannot read item, invalid type: ${type} in ${filePath}`);
};

export const courseItemFileStorageService = {
  getItem,
  getItems: async <T extends CourseItemType>(
    courseName: string,
    moduleName: string,
    type: T
  ): Promise<CourseItemReturnType<T>[]> => {
    const fileNames = await getItemFileNames(courseName, moduleName, type);
    const items = (
      await Promise.all(
        fileNames.map(async (name) => {
          try {
            const item = await getItem(courseName, moduleName, name, type);
            return item;
          } catch {
            return null;
          }
        })
      )
    ).filter((a) => a !== null);
    return items;
  },
  async updateOrCreateAssignment({
    courseName,
    moduleName,
    name,
    item,
    type,
  }: {
    courseName: string;
    moduleName: string;
    name: string;
    item: LocalAssignment | LocalQuiz | LocalCoursePage;
    type: CourseItemType;
  }) {
    const typeFolder = typeToFolder[type];
    const folder = path.join(basePath, courseName, moduleName, typeFolder);
    await fs.mkdir(folder, { recursive: true });

    const filePath = path.join(
      basePath,
      courseName,
      moduleName,
      typeFolder,
      name + ".md"
    );

    const markdownDictionary: {
      [_key in CourseItemType]: () => string;
    } = {
      Assignment: () =>
        assignmentMarkdownSerializer.toMarkdown(item as LocalAssignment),
      Quiz: () => quizMarkdownUtils.toMarkdown(item as LocalQuiz),
      Page: () => localPageMarkdownUtils.toMarkdown(item as LocalCoursePage),
    };
    const itemMarkdown = markdownDictionary[type]();

    console.log(`Saving ${type} ${filePath}`);
    await fs.writeFile(filePath, itemMarkdown);
  },
};
