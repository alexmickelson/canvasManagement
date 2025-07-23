import { z } from "zod";
import publicProcedure from "../../../services/serverFunctions/publicProcedure";
import { router } from "../../../services/serverFunctions/trpcSetup";
import { Lecture, zodLecture } from "@/features/local/lectures/lectureModel";
import {
  getDayOfWeek,
  LocalCourseSettings,
  zodLocalCourseSettings,
} from "../course/localCourseSettings";
import path from "path";
import fs from "fs/promises";
import { getCoursePathByName } from "../globalSettings/globalSettingsFileStorageService";
import { getDateFromStringOrThrow } from "../utils/timeUtils";
import {
  lectureFolderName,
  parseLecture,
  getLectureWeekName,
  lectureToString,
} from "./lectureUtils";

export const lectureRouter = router({
  getLectures: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
      })
    )
    .query(async ({ input: { courseName } }) => {
      return await getLectures(courseName);
    }),
  updateLecture: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        lecture: zodLecture,
        previousDay: z.string().optional(),
        settings: zodLocalCourseSettings,
      })
    )
    .mutation(
      async ({ input: { courseName, settings, lecture, previousDay } }) => {
        await updateLecture(courseName, settings, lecture);

        if (previousDay && previousDay !== lecture.date) {
          await deleteLecture(courseName, settings, previousDay);
        }
      }
    ),
  deleteLecture: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        lectureDay: z.string(),
        settings: zodLocalCourseSettings,
      })
    )
    .mutation(async ({ input: { courseName, settings, lectureDay } }) => {
      await deleteLecture(courseName, settings, lectureDay);
    }),
});

export async function getLectures(courseName: string) {
  const courseDirectory = await getCoursePathByName(courseName);
  const courseLectureRoot = path.join(courseDirectory, lectureFolderName);
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
  const courseDirectory = await getCoursePathByName(courseName);
  const courseLectureRoot = path.join(courseDirectory, lectureFolderName);
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

  const courseDirectory = await getCoursePathByName(courseName);
  const courseLectureRoot = path.join(courseDirectory, lectureFolderName);
  const weekPath = path.join(courseLectureRoot, weekFolderName);
  const lecturePath = path.join(
    weekPath,
    `${lectureDate.getDay()}-${getDayOfWeek(lectureDate)}.md`
  );
  try {
    await fs.access(lecturePath); // throws error if no file
    await fs.unlink(lecturePath);
    console.log(`File deleted: ${lecturePath}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
