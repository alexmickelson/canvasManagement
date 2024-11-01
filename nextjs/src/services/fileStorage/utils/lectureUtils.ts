import { extractLabelValue } from "@/models/local/assignment/utils/markdownUtils";
import { Lecture } from "@/models/local/lecture";

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

export const lectureFolderName = "00 - lectures"