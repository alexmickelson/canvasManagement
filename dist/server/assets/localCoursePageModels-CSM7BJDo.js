import { c as verifyDateOrThrow } from "./timeUtils-DjiIXWRA.js";
import { t as extractLabelValue } from "./markdownUtils-Ckxeou8m.js";
import { z } from "zod";
//#region src/features/local/pages/localCoursePageModels.ts
var zodLocalCoursePage = z.object({
	name: z.string(),
	text: z.string(),
	dueAt: z.string()
});
var localPageMarkdownUtils = {
	toMarkdown: (page) => {
		return `DueDateForOrdering: ${verifyDateOrThrow(page.dueAt, "page DueDateForOrdering")}\n---\n` + page.text;
	},
	parseMarkdown: (pageMarkdown, name) => {
		const rawSettings = pageMarkdown.split("---")[0];
		return {
			name,
			dueAt: verifyDateOrThrow(extractLabelValue(rawSettings, "DueDateForOrdering"), "page DueDateForOrdering"),
			text: pageMarkdown.split("---\n")[1]
		};
	}
};
//#endregion
export { zodLocalCoursePage as n, localPageMarkdownUtils as t };
