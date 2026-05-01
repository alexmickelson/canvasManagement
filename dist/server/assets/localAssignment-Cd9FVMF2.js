import { r as zodAssignmentSubmissionType, t as AssignmentSubmissionType } from "./assignmentSubmissionType-CBVSV8hE.js";
import { c as verifyDateOrThrow, l as verifyDateStringOrUndefined } from "./timeUtils-DjiIXWRA.js";
import { t as extractLabelValue } from "./markdownUtils-Ckxeou8m.js";
import { z } from "zod";
//#region src/features/local/assignments/models/rubricItem.ts
var zodRubricItem = z.object({
	label: z.string(),
	points: z.number()
});
var rubricItemIsExtraCredit = (item) => {
	return item.label.toLowerCase().includes("(extra credit)".toLowerCase());
};
//#endregion
//#region src/features/local/assignments/models/utils/assignmentMarkdownParser.ts
var parseFileUploadExtensions = (input) => {
	const allowedFileUploadExtensions = [];
	const regex = /- (.+)/;
	const words = input.split("AllowedFileUploadExtensions:");
	if (words.length < 2) return allowedFileUploadExtensions;
	const lines = words[1].split("\n").map((line) => line.trim());
	for (const line of lines) {
		const match = regex.exec(line);
		if (!match) if (line === "") continue;
		else break;
		allowedFileUploadExtensions.push(match[1].trim());
	}
	return allowedFileUploadExtensions;
};
var parseIndividualRubricItemMarkdown = (rawMarkdown) => {
	const match = /\s*-\s*(-?\d+(?:\.\d+)?)\s*pt(s)?:/.exec(rawMarkdown);
	if (!match) throw new Error(`Points not found: ${rawMarkdown}`);
	return {
		points: parseFloat(match[1]),
		label: rawMarkdown.split(": ").slice(1).join(": ")
	};
};
var parseSettings = (input) => {
	const rawLockAt = extractLabelValue(input, "LockAt");
	const rawDueAt = extractLabelValue(input, "DueAt");
	const assignmentGroupName = extractLabelValue(input, "AssignmentGroupName");
	const submissionTypes = parseSubmissionTypes(input);
	const fileUploadExtensions = parseFileUploadExtensions(input);
	const githubClassroomAssignmentShareLink = extractLabelValue(input, "GithubClassroomAssignmentShareLink");
	const githubClassroomAssignmentLink = extractLabelValue(input, "GithubClassroomAssignmentLink");
	return {
		assignmentGroupName,
		submissionTypes,
		fileUploadExtensions,
		dueAt: verifyDateOrThrow(rawDueAt, "DueAt"),
		lockAt: verifyDateStringOrUndefined(rawLockAt),
		githubClassroomAssignmentShareLink,
		githubClassroomAssignmentLink
	};
};
var parseSubmissionTypes = (input) => {
	const submissionTypes = [];
	const regex = /- (.+)/;
	const words = input.split("SubmissionTypes:");
	if (words.length < 2) return submissionTypes;
	const lines = words[1].split("\n").map((line) => line.trim());
	for (const line of lines) {
		const match = regex.exec(line);
		if (!match) if (line === "") continue;
		else break;
		const typeString = match[1].trim();
		const type = Object.values(AssignmentSubmissionType).find((t) => t === typeString);
		if (type) submissionTypes.push(type);
		else console.warn(`Unknown submission type: ${typeString}`);
	}
	return submissionTypes;
};
var parseRubricMarkdown = (rawMarkdown) => {
	if (!rawMarkdown.trim()) return [];
	return rawMarkdown.trim().split("\n").map(parseIndividualRubricItemMarkdown);
};
var assignmentMarkdownParser = {
	parseRubricMarkdown,
	parseMarkdown(input, name) {
		const settingsString = input.split("---")[0];
		const { assignmentGroupName, submissionTypes, fileUploadExtensions, dueAt, lockAt, githubClassroomAssignmentShareLink, githubClassroomAssignmentLink } = parseSettings(settingsString);
		const description = input.split("---\n").slice(1).join("---\n").split("## Rubric")[0].trim();
		const rubricString = input.split("## Rubric\n")[1];
		const rubric = parseRubricMarkdown(rubricString);
		const assignment = {
			name,
			localAssignmentGroupName: assignmentGroupName.trim(),
			submissionTypes,
			allowedFileUploadExtensions: fileUploadExtensions,
			dueAt,
			lockAt,
			rubric,
			description
		};
		if (githubClassroomAssignmentShareLink) assignment.githubClassroomAssignmentShareLink = githubClassroomAssignmentShareLink;
		if (githubClassroomAssignmentLink) assignment.githubClassroomAssignmentLink = githubClassroomAssignmentLink;
		return assignment;
	}
};
//#endregion
//#region src/features/local/assignments/models/utils/assignmentMarkdownSerializer.ts
var assignmentRubricToMarkdown = (assignment) => {
	return assignment.rubric.map((item) => {
		const pointLabel = item.points > 1 ? "pts" : "pt";
		return `- ${item.points}${pointLabel}: ${item.label}`;
	}).join("\n");
};
var settingsToMarkdown = (assignment) => {
	const printableDueDate = assignment.dueAt.toString().replace(" ", " ");
	const printableLockAt = assignment.lockAt?.toString().replace(" ", " ") || "";
	const submissionTypesMarkdown = assignment.submissionTypes.map((submissionType) => `- ${submissionType}`).join("\n");
	const allowedFileUploadExtensionsMarkdown = assignment.allowedFileUploadExtensions.map((fileExtension) => `- ${fileExtension}`).join("\n");
	return [
		`LockAt: ${printableLockAt}`,
		`DueAt: ${printableDueDate}`,
		`AssignmentGroupName: ${assignment.localAssignmentGroupName}`,
		`GithubClassroomAssignmentLink: ${assignment.githubClassroomAssignmentLink ?? ""}`,
		`GithubClassroomAssignmentShareLink: ${assignment.githubClassroomAssignmentShareLink ?? ""}`,
		`SubmissionTypes:\n${submissionTypesMarkdown}`,
		`AllowedFileUploadExtensions:\n${allowedFileUploadExtensionsMarkdown}`
	].join("\n");
};
var assignmentMarkdownSerializer = { toMarkdown(assignment) {
	try {
		const settingsMarkdown = settingsToMarkdown(assignment);
		const rubricMarkdown = assignmentRubricToMarkdown(assignment);
		return `${settingsMarkdown}\n---\n\n${assignment.description}\n\n## Rubric\n\n${rubricMarkdown}`;
	} catch (e) {
		console.log(assignment);
		console.log("Error converting assignment to markdown");
		throw e;
	}
} };
//#endregion
//#region src/features/local/assignments/models/localAssignment.ts
var zodLocalAssignment = z.object({
	name: z.string(),
	description: z.string(),
	lockAt: z.string().optional(),
	dueAt: z.string(),
	localAssignmentGroupName: z.string().optional(),
	submissionTypes: zodAssignmentSubmissionType.array(),
	allowedFileUploadExtensions: z.string().array(),
	rubric: zodRubricItem.array(),
	githubClassroomAssignmentShareLink: z.string().optional(),
	githubClassroomAssignmentLink: z.string().optional()
});
var localAssignmentMarkdown = {
	parseMarkdown: assignmentMarkdownParser.parseMarkdown,
	toMarkdown: assignmentMarkdownSerializer.toMarkdown
};
//#endregion
export { rubricItemIsExtraCredit as i, zodLocalAssignment as n, assignmentMarkdownSerializer as r, localAssignmentMarkdown as t };
