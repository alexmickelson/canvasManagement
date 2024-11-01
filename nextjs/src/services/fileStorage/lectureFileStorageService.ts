"use server";
import path from "path";
import { basePath } from "./utils/fileSystemUtils";
import fs from "fs/promises";
import { Lecture } from "@/models/local/lecture";
import { extractLabelValue } from "@/models/local/assignment/utils/markdownUtils";
import { getDateOnlyMarkdownString } from "@/models/local/timeUtils";

export async function getLectures(courseName: string) {
  const courseLectureRoot = path.join(basePath, courseName, "lectures");
  if (!(await directoryExists(courseLectureRoot))) {
    return [];
  }

  const entries = await fs.readdir(courseLectureRoot, { withFileTypes: true });
  const lectureWeekFolders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const lecturesByWeek = await Promise.all(
    lectureWeekFolders.map(async (weekName) => {
      const weekBasePath = path.join(courseLectureRoot, weekName);
      const fileNames = await fs.readdir(weekBasePath);
      const lectures = await Promise.all(
        fileNames.map(async (fileName) => {
          const filePath = path.join(weekBasePath, fileName);
          const fileContent = await fs.readFile(filePath, "utf-8");
          const lecture = parseLecture(fileContent);
          return lecture;
        })
      );

      return {
        weekName,
        lectures,
      };
    })
  );
  return lecturesByWeek;
}

export function parseLecture(fileContent: string): Lecture {
  try {
    const settings = fileContent.split("---\n")[0];
    const name = extractLabelValue(settings, "Name");
    const date = extractLabelValue(settings, "Date");

    const content = fileContent.split("---\n")[1].trim();

    return {
      name,
      date,
      content,
    };
  } catch (error) {
    console.error("Error parsing lecture", fileContent);
    throw error;
  }
}

export function lectureToString(lecture: Lecture) {
  return `Name: ${lecture.name}
Date: ${lecture.date}
---
${lecture.content}`;
}

const directoryExists = async (path: string): Promise<boolean> => {
  try {
    const stat = await fs.stat(path);
    return stat.isDirectory();
  } catch {
    return false;
  }
};
