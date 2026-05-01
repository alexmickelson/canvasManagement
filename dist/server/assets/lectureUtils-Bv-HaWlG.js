import { r as getDateFromStringOrThrow } from "./timeUtils-DjiIXWRA.js";
import { t as extractLabelValue } from "./markdownUtils-Ckxeou8m.js";
import { n as getWeekNumber } from "./calendarMonthUtils-C5qccPhc.js";
//#region src/features/local/lectures/lectureUtils.ts
function parseLecture(fileContent) {
	try {
		const settings = fileContent.split("---\n")[0];
		return {
			name: extractLabelValue(settings, "Name"),
			date: extractLabelValue(settings, "Date"),
			content: fileContent.split("---\n").slice(1).join("---\n").trim()
		};
	} catch (error) {
		console.error("Error parsing lecture: ", fileContent);
		throw error;
	}
}
function lectureToString(lecture) {
	return `Name: ${lecture.name}
Date: ${lecture.date}
---
${lecture.content}`;
}
var lectureFolderName = "00 - lectures";
function getLectureWeekName(semesterStart, lectureDate) {
	return `week-${getWeekNumber(getDateFromStringOrThrow(semesterStart, "semester start date in update lecture"), getDateFromStringOrThrow(lectureDate, "lecture start date in update lecture")).toString().padStart(2, "0")}`;
}
//#endregion
export { parseLecture as i, lectureFolderName as n, lectureToString as r, getLectureWeekName as t };
