import { r as getDateFromStringOrThrow, t as dateToMarkdownString } from "./timeUtils-DjiIXWRA.js";
//#region src/app/course/[courseName]/calendar/calendarMonthUtils.ts
function weeksInMonth(year, month) {
	const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
	const longDaysInMonth = new Date(year, month, 0).getDate() + firstDayOfMonth;
	let weeks = Math.floor(longDaysInMonth / 7);
	if (longDaysInMonth % 7 > 0) weeks += 1;
	return weeks;
}
function createCalendarMonth(year, month) {
	const weeksNumber = weeksInMonth(year, month);
	const daysInMonth = new Date(year, month, 0).getDate();
	let currentDay = 1;
	const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
	const daysByWeek = Array.from({ length: weeksNumber }).map((_, weekIndex) => Array.from({ length: 7 }).map((_, dayIndex) => {
		if (weekIndex === 0 && dayIndex < firstDayOfMonth) return dateToMarkdownString(new Date(year, month - 1, dayIndex - firstDayOfMonth + 1, 12, 0, 0));
		else if (currentDay <= daysInMonth) return dateToMarkdownString(new Date(year, month - 1, currentDay++, 12, 0, 0));
		else {
			currentDay++;
			return dateToMarkdownString(new Date(year, month, currentDay - daysInMonth - 1, 12, 0, 0));
		}
	})).filter((week) => {
		return getDateFromStringOrThrow(week.at(-1), "filtering out last week of month").getMonth() <= month - 1;
	});
	return {
		year,
		month,
		weeks: daysByWeek.map((week) => week.map((day) => getDateFromStringOrThrow(day, "calculating weeks").getDate())),
		daysByWeek
	};
}
function getMonthsBetweenDates(startDate, endDate) {
	const monthsInTerm = 1 + (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();
	return Array.from({ length: monthsInTerm }, (_, monthDiff) => {
		const month = (startDate.getMonth() + monthDiff) % 12 + 1;
		return createCalendarMonth(startDate.getFullYear() + Math.floor((startDate.getMonth() + monthDiff) / 12), month);
	});
}
var getWeekNumber = (startDate, currentDate) => {
	const daysBetween = daysBetweenDates(getPreviousSunday(startDate), currentDate);
	const weeksDiff = Math.floor(daysBetween / 7);
	if (weeksDiff >= 0) return weeksDiff + 1;
	return weeksDiff;
};
var daysBetweenDates = (startDate, endDate) => {
	const diffInDays = (endDate.getTime() - startDate.getTime()) / (1e3 * 3600 * 24);
	return Math.floor(diffInDays);
};
var getPreviousSunday = (date) => {
	const result = new Date(date);
	const dayOfWeek = result.getDay();
	result.setDate(result.getDate() - dayOfWeek);
	return result;
};
//#endregion
export { getWeekNumber as n, getMonthsBetweenDates as t };
