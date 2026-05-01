import { r as zodAssignmentSubmissionType } from "./assignmentSubmissionType-CBVSV8hE.js";
import { z } from "zod";
import { parse, stringify } from "yaml";
//#region src/features/local/assignments/models/localAssignmentGroup.ts
var zodLocalAssignmentGroup = z.object({
	canvasId: z.optional(z.number()),
	id: z.string(),
	name: z.string(),
	weight: z.number()
});
//#endregion
//#region src/features/local/course/localCourseSettings.ts
var zodSimpleTimeOnly = z.object({
	hour: z.number().int().min(0).max(23),
	minute: z.number().int().min(0).max(59)
});
var DayOfWeek = /* @__PURE__ */ function(DayOfWeek) {
	DayOfWeek["Sunday"] = "Sunday";
	DayOfWeek["Monday"] = "Monday";
	DayOfWeek["Tuesday"] = "Tuesday";
	DayOfWeek["Wednesday"] = "Wednesday";
	DayOfWeek["Thursday"] = "Thursday";
	DayOfWeek["Friday"] = "Friday";
	DayOfWeek["Saturday"] = "Saturday";
	return DayOfWeek;
}({});
var zodDayOfWeek = z.enum([
	DayOfWeek.Sunday,
	DayOfWeek.Monday,
	DayOfWeek.Tuesday,
	DayOfWeek.Wednesday,
	DayOfWeek.Thursday,
	DayOfWeek.Friday,
	DayOfWeek.Saturday
]);
var zodLocalCourseSettings = z.object({
	name: z.string(),
	assignmentGroups: zodLocalAssignmentGroup.array(),
	daysOfWeek: zodDayOfWeek.array(),
	canvasId: z.number(),
	startDate: z.string(),
	endDate: z.string(),
	defaultDueTime: zodSimpleTimeOnly,
	defaultLockHoursOffset: z.number().int().optional(),
	defaultAssignmentSubmissionTypes: zodAssignmentSubmissionType.array(),
	defaultFileUploadTypes: z.string().array(),
	holidays: z.object({
		name: z.string(),
		days: z.string().array()
	}).array(),
	assets: z.object({
		sourceUrl: z.string(),
		canvasUrl: z.string()
	}).array()
});
function getDayOfWeek(date) {
	const dayIndex = date.getDay();
	return DayOfWeek[Object.keys(DayOfWeek)[dayIndex]];
}
var localCourseYamlUtils = {
	parseSettingYaml: (settingsString) => {
		return lowercaseFirstLetter(parse(settingsString, {}));
	},
	settingsToYaml: (settings) => {
		return stringify(settings);
	}
};
function lowercaseFirstLetter(obj) {
	if (obj === null || typeof obj !== "object") return obj;
	if (Array.isArray(obj)) return obj.map(lowercaseFirstLetter);
	const result = {};
	Object.keys(obj).forEach((key) => {
		const value = obj[key];
		const newKey = key.charAt(0).toLowerCase() + key.slice(1);
		if (value && typeof value === "object") result[newKey] = lowercaseFirstLetter(value);
		else result[newKey] = value;
	});
	return result;
}
//#endregion
export { zodLocalCourseSettings as i, getDayOfWeek as n, localCourseYamlUtils as r, DayOfWeek as t };
