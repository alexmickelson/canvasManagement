//#region src/features/local/assignments/models/utils/markdownUtils.ts
var extractLabelValue = (input, label) => {
	const match = new RegExp(`${label}: (.*?)\n`).exec(input);
	if (match && match.length > 1 && match[1]) return match[1].trim();
	return "";
};
//#endregion
export { extractLabelValue as t };
