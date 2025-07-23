import { getWeekNumber } from "@/app/course/[courseName]/calendar/calendarMonthUtils";
import { extractLabelValue } from "@/features/local/assignments/models/utils/markdownUtils";
import { Lecture } from "@/features/local/lectures/lectureModel";
import { getDateFromStringOrThrow } from "@/models/local/utils/timeUtils";

export function parseLecture(fileContent: string): Lecture {
  try {
    const settings = fileContent.split("---\n")[0];
    const name = extractLabelValue(settings, "Name");
    const date = extractLabelValue(settings, "Date");

    const content = fileContent.split("---\n").slice(1).join("---\n").trim();
    return {
      name,
      date,
      content,
    };
  } catch (error) {
    console.error("Error parsing lecture: ", fileContent);
    throw error;
  }
}

export function lectureToString(lecture: Lecture) {
  return `Name: ${lecture.name}
Date: ${lecture.date}
---
${lecture.content}`;
}

export const lectureFolderName = "00 - lectures";

export function getLectureWeekName(semesterStart: string, lectureDate: string) {
  const startDate = getDateFromStringOrThrow(
    semesterStart,
    "semester start date in update lecture"
  );
  const targetDate = getDateFromStringOrThrow(
    lectureDate,
    "lecture start date in update lecture"
  );
  const weekNumber = getWeekNumber(startDate, targetDate)
    .toString()
    .padStart(2, "0");

  const weekName = `week-${weekNumber}`;
  return weekName;
}
