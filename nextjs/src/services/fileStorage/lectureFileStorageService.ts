
import path from "path";
import { basePath } from "./utils/fileSystemUtils";
import fs from "fs/promises";
import {
  getLectureWeekName,
  lectureFolderName,
  lectureToString,
  parseLecture,
} from "./utils/lectureUtils";
import { Lecture } from "@/models/local/lecture";
import {
  getDayOfWeek,
  LocalCourseSettings,
} from "@/models/local/localCourseSettings";
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
  const lectureDate = getDateFromStringOrThrow(
    lecture.date,
    "lecture start date in update lecture"
  );

  const weekFolderName = getLectureWeekName(
    courseSettings.startDate,
    lecture.date
  );
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

export async function deleteLecture(
  courseName: string,
  courseSettings: LocalCourseSettings,
  dayAsString: string
) {
  console.log("deleting lecture", courseName, dayAsString);
  const lectureDate = getDateFromStringOrThrow(
    dayAsString,
    "lecture start date in update lecture"
  );

  const weekFolderName = getLectureWeekName(
    courseSettings.startDate,
    dayAsString
  );

  const courseLectureRoot = path.join(basePath, courseName, lectureFolderName);
  const weekPath = path.join(courseLectureRoot, weekFolderName);
  const lecturePath = path.join(
    weekPath,
    `${lectureDate.getDay()}-${getDayOfWeek(lectureDate)}.md`
  );
  try {
    await fs.access(lecturePath); // throws error if no file
    await fs.unlink(lecturePath);
    console.log(`File deleted: ${lecturePath}`);
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      console.log(`Cannot delete lecture, file does not exist: ${lecturePath}`);
    } else {
      throw error;
    }
  }
}

const directoryExists = async (path: string): Promise<boolean> => {
  try {
    const stat = await fs.stat(path);
    return stat.isDirectory();
  } catch {
    return false;
  }
};
