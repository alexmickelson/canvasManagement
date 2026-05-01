//#region src/features/local/utils/timeUtils.ts
var _getDateFromAMPM = (datePart, timePart, amPmPart) => {
	const [month, day, year] = datePart.split("/").map(Number);
	const [hours, minutes, seconds] = timePart.split(":").map(Number);
	let adjustedHours = hours;
	if (amPmPart) {
		const upperMeridian = amPmPart.toUpperCase();
		if (upperMeridian === "PM" && hours < 12) adjustedHours += 12;
		else if (upperMeridian === "AM" && hours === 12) adjustedHours = 0;
	}
	const date = new Date(year, month - 1, day, adjustedHours, minutes, seconds);
	return isNaN(date.getTime()) ? void 0 : date;
};
var _getDateFromMilitary = (datePart, timePart) => {
	const [month, day, year] = datePart.split("/").map(Number);
	const [hours, minutes, seconds] = timePart.split(":").map(Number);
	const date = new Date(year, month - 1, day, hours, minutes, seconds);
	return isNaN(date.getTime()) ? void 0 : date;
};
var _getDateFromISO = (value) => {
	const date = new Date(value);
	return isNaN(date.getTime()) ? void 0 : date;
};
var _getDateFromDateOnly = (datePart) => {
	const [month, day, year] = datePart.split("/").map(Number);
	const date = new Date(year, month - 1, day);
	return isNaN(date.getTime()) ? void 0 : date;
};
var getDateFromString = (value) => {
	const ampmDateRegex = /^\d{1,2}\/\d{1,2}\/\d{4},? \d{1,2}:\d{2}:\d{2}\s{1}[APap][Mm]$/;
	const militaryDateRegex = /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2}$/;
	const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}((.\d+)|(Z))$/;
	const dateOnlyRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
	if (isoDateRegex.test(value)) return _getDateFromISO(value);
	else if (ampmDateRegex.test(value)) {
		const [datePart, timePart, amPmPart] = value.split(/,?[\s\u202F]+/);
		return _getDateFromAMPM(datePart, timePart, amPmPart);
	} else if (militaryDateRegex.test(value)) {
		const [datePart, timePart] = value.split(" ");
		return _getDateFromMilitary(datePart, timePart);
	}
	if (dateOnlyRegex.test(value)) return _getDateFromDateOnly(value);
	else {
		if (value) console.log("invalid date format", value);
		return;
	}
};
var getDateFromStringOrThrow = (value, labelForError) => {
	const d = getDateFromString(value);
	if (!d) throw Error(`Invalid date format for ${labelForError}, ${value}`);
	return d;
};
var verifyDateStringOrUndefined = (value) => {
	const date = getDateFromString(value);
	return date ? dateToMarkdownString(date) : void 0;
};
var verifyDateOrThrow = (value, labelForError) => {
	const myDate = getDateFromString(value);
	if (!myDate) throw new Error(`Invalid format for ${labelForError}: ${value}`);
	return dateToMarkdownString(myDate);
};
var dateToMarkdownString = (date) => {
	const stringDay = String(date.getDate()).padStart(2, "0");
	return `${String(date.getMonth() + 1).padStart(2, "0")}/${stringDay}/${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
};
var getDateOnlyMarkdownString = (date) => {
	return dateToMarkdownString(date).split(" ")[0];
};
function getTermName(startDate) {
	const [year, month, ..._rest] = startDate.split("-");
	if (month < "04") return "Spring " + year;
	if (month < "07") return "Summer " + year;
	return "Fall " + year;
}
function getDateKey(dateString) {
	return dateString.split("T")[0];
}
function groupByStartDate(courses) {
	return courses.reduce((acc, course) => {
		const { startDate } = course;
		const key = getDateKey(startDate);
		if (!acc[key]) acc[key] = [];
		acc[key].push(course);
		return acc;
	}, {});
}
//#endregion
export { getDateOnlyMarkdownString as a, verifyDateOrThrow as c, getDateKey as i, verifyDateStringOrUndefined as l, getDateFromString as n, getTermName as o, getDateFromStringOrThrow as r, groupByStartDate as s, dateToMarkdownString as t };
