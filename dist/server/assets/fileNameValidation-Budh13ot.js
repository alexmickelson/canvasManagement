//#region src/services/fileNameValidation.ts
function validateFileName(fileName) {
	if (!fileName || fileName.trim() === "") return "Name cannot be empty";
	const invalidChars = [
		":",
		"/",
		"\\",
		"*",
		"?",
		"\"",
		"<",
		">",
		"|"
	];
	for (const char of fileName) if (invalidChars.includes(char)) return `Name contains invalid character: "${char}". Please avoid: ${invalidChars.join(" ")}`;
	if (fileName !== fileName.trimEnd()) return "Name cannot end with whitespace";
	return "";
}
function assertValidFileName(fileName) {
	const error = validateFileName(fileName);
	if (error) throw new Error(error);
}
//#endregion
export { validateFileName as n, assertValidFileName as t };
