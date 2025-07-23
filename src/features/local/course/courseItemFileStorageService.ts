import path from "path";
import { directoryOrFileExists } from "../utils/fileSystemUtils";
import fs from "fs/promises";
import {
  localAssignmentMarkdown,
} from "@/features/local/assignments/models/localAssignment";
import {
  CourseItemReturnType,
  CourseItemType,
  typeToFolder,
} from "@/features/local/course/courseItemTypes";
import { getCoursePathByName } from "../globalSettings/globalSettingsFileStorageService";
import {
  localPageMarkdownUtils,
} from "@/features/local/pages/localCoursePageModels";
import {
  localQuizMarkdownUtils,
} from "@/features/local/quizzes/models/localQuiz";

const getItemFileNames = async ({
  courseName,
  moduleName,
  type,
}: {
  courseName: string;
  moduleName: string;
  type: CourseItemType;
}) => {
  const courseDirectory = await getCoursePathByName(courseName);
  const folder = typeToFolder[type];
  const filePath = path.join(courseDirectory, moduleName, folder);
  if (!(await directoryOrFileExists(filePath))) {
    console.log(
      `Error loading ${type}, ${folder} folder does not exist in ${filePath}`
    );
    await fs.mkdir(filePath);
  }

  const itemFiles = await fs.readdir(filePath);
  return itemFiles.map((f) => f.replace(/\.md$/, ""));
};

const getItem = async <T extends CourseItemType>({
  courseName,
  moduleName,
  name,
  type,
}: {
  courseName: string;
  moduleName: string;
  name: string;
  type: T;
}): Promise<CourseItemReturnType<T>> => {
  const courseDirectory = await getCoursePathByName(courseName);
  const folder = typeToFolder[type];
  const filePath = path.join(courseDirectory, moduleName, folder, name + ".md");
  const rawFile = (await fs.readFile(filePath, "utf-8")).replace(/\r\n/g, "\n");
  if (type === "Assignment") {
    return localAssignmentMarkdown.parseMarkdown(
      rawFile,
      name
    ) as CourseItemReturnType<T>;
  } else if (type === "Quiz") {
    return localQuizMarkdownUtils.parseMarkdown(
      rawFile,
      name
    ) as CourseItemReturnType<T>;
  } else if (type === "Page") {
    return localPageMarkdownUtils.parseMarkdown(
      rawFile,
      name
    ) as CourseItemReturnType<T>;
  }

  throw Error(`cannot read item, invalid type: ${type} in ${filePath}`);
};

export const courseItemFileStorageService = {
  getItem,
  getItems: async <T extends CourseItemType>({
    courseName,
    moduleName,
    type,
  }: {
    courseName: string;
    moduleName: string;
    type: T;
  }): Promise<CourseItemReturnType<T>[]> => {
    const fileNames = await getItemFileNames({ courseName, moduleName, type });
    const items = (
      await Promise.all(
        fileNames.map(async (name) => {
          try {
            const item = await getItem({ courseName, moduleName, name, type });
            return item;
          } catch {
            return null;
          }
        })
      )
    ).filter((a) => a !== null);
    return items;
  },
};
