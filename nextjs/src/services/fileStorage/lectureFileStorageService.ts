"use server";
import path from "path";
import { basePath } from "./utils/fileSystemUtils";
import fs from "fs/promises";
import {
  lectureFolderName,
  lectureToString,
  parseLecture,
} from "./utils/lectureUtils";
import { Lecture } from "@/models/local/lecture";
import { getDayOfWeek, LocalCourseSettings } from "@/models/local/localCourse";
import { getWeekNumber } from "@/app/course/[courseName]/calendar/calendarMonthUtils";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";

export async function getLectures(courseName: string) {
  const courseLectureRoot = path.join(basePath, courseName, lectureFolderName);
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

export async function updateLecture(
  courseName: string,
  courseSettings: LocalCourseSettings,
  lecture: Lecture
) {
  const courseLectureRoot = path.join(basePath, courseName, lectureFolderName);
  const startDate = getDateFromStringOrThrow(
    courseSettings.startDate,
    "semester start date in update lecture"
  );
  const lectureDate = getDateFromStringOrThrow(
    lecture.date,
    "lecture start date in update lecture"
  );
  const weekNumber = getWeekNumber(startDate, lectureDate)
    .toString()
    .padStart(2, "0");

  const weekFolderName = `week-${weekNumber}`;
  const weekPath = path.join(courseLectureRoot, weekFolderName);
  if (!(await directoryExists(weekPath))) {
    await fs.mkdir(weekPath, { recursive: true });
  }

  const lecturePath = path.join(
    weekPath,
    `${lectureDate.getDay()}-${getDayOfWeek(lectureDate)}.md`
  );
  const lectureContents = lectureToString(lecture);
  await fs.writeFile(lecturePath, lectureContents);
}

const directoryExists = async (path: string): Promise<boolean> => {
  try {
    const stat = await fs.stat(path);
    return stat.isDirectory();
  } catch {
    return false;
  }
};
