import { getWeekNumber } from "@/app/course/[courseName]/calendar/calendarMonthUtils";
import { extractLabelValue } from "@/models/local/assignment/utils/markdownUtils";
import { Lecture } from "@/models/local/lecture";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";

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
