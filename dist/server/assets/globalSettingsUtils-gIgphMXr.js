import z$1 from "zod";
import { parse, stringify } from "yaml";
//#region src/features/local/globalSettings/globalSettingsModels.ts
var zodGlobalSettingsCourse = z$1.object({
	path: z$1.string(),
	name: z$1.string()
});
var zodGlobalSettings = z$1.object({
	courses: z$1.array(zodGlobalSettingsCourse),
	feedbackDelims: z$1.record(z$1.string(), z$1.string()).optional()
});
//#endregion
//#region src/features/local/quizzes/models/utils/quizFeedbackMarkdownUtils.ts
var defaultFeedbackDelimiters = {
	correct: "+",
	incorrect: "-",
	neutral: "..."
};
var quizFeedbackMarkdownUtils = {
	extractFeedback(lines, delimiters = defaultFeedbackDelimiters) {
		const comments = {
			correct: [],
			incorrect: [],
			neutral: []
		};
		const otherLines = [];
		const feedbackIndicators = delimiters;
		let currentFeedbackType = "none";
		for (const line of lines.map((l) => l)) {
			const lineFeedbackType = line.startsWith(feedbackIndicators.correct) ? "correct" : line.startsWith(feedbackIndicators.incorrect) ? "incorrect" : line.startsWith(feedbackIndicators.neutral) ? "neutral" : "none";
			if (lineFeedbackType === "none" && currentFeedbackType !== "none") {
				const lineWithoutIndicator = line.replace(feedbackIndicators[currentFeedbackType], "").trim();
				comments[currentFeedbackType].push(lineWithoutIndicator);
			} else if (lineFeedbackType !== "none") {
				const lineWithoutIndicator = line.replace(feedbackIndicators[lineFeedbackType], "").trim();
				currentFeedbackType = lineFeedbackType;
				comments[lineFeedbackType].push(lineWithoutIndicator);
			} else otherLines.push(line);
		}
		const correctComments = comments.correct.filter((l) => l).join("\n");
		const incorrectComments = comments.incorrect.filter((l) => l).join("\n");
		const neutralComments = comments.neutral.filter((l) => l).join("\n");
		return {
			correctComments: correctComments || void 0,
			incorrectComments: incorrectComments || void 0,
			neutralComments: neutralComments || void 0,
			otherLines
		};
	},
	formatFeedback(correctComments, incorrectComments, neutralComments, delimiters = defaultFeedbackDelimiters) {
		let feedbackText = "";
		if (correctComments) feedbackText += `${delimiters.correct} ${correctComments}\n`;
		if (incorrectComments) feedbackText += `${delimiters.incorrect} ${incorrectComments}\n`;
		if (neutralComments) feedbackText += `${delimiters.neutral} ${neutralComments}\n`;
		if (feedbackText) feedbackText += "\n";
		return feedbackText;
	}
};
//#endregion
//#region src/features/local/globalSettings/globalSettingsUtils.ts
var globalSettingsToYaml = (settings) => {
	return stringify(settings);
};
var parseGlobalSettingsYaml = (yaml) => {
	const parsed = parse(yaml);
	try {
		return zodGlobalSettings.parse(parsed);
	} catch (e) {
		console.error("Error parsing global settings YAML:", e);
		throw new Error(`Error parsing global settings, got ${yaml}, ${e}`);
	}
};
function overriddenDefaults(defaults, overrides) {
	return Object.fromEntries(Object.entries(defaults).map(([k, v]) => [k, overrides[k] ?? v]));
}
var getFeedbackDelimitersFromSettings = (settings) => {
	return overriddenDefaults(defaultFeedbackDelimiters, settings.feedbackDelims ?? {});
};
//#endregion
export { zodGlobalSettings as a, quizFeedbackMarkdownUtils as i, globalSettingsToYaml as n, parseGlobalSettingsYaml as r, getFeedbackDelimitersFromSettings as t };
