export function validateFileName(fileName: string): string {
  if (!fileName || fileName.trim() === "") {
    return "Name cannot be empty";
  }

  const invalidChars = [":", "/", "\\", "*", "?", '"', "<", ">", "|"];

  for (const char of fileName) {
    if (invalidChars.includes(char)) {
      return `Name contains invalid character: "${char}". Please avoid: ${invalidChars.join(
        " "
      )}`;
    }
  }

  if (fileName !== fileName.trimEnd()) {
    return "Name cannot end with whitespace";
  }

  return "";
}

export function assertValidFileName(fileName: string): void {
  const error = validateFileName(fileName);
  if (error) {
    throw new Error(error);
  }
}
