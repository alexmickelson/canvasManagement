export const extractLabelValue = (input: string, label: string) => {
  const pattern = new RegExp(`${label}: (.*?)\n`);
  const match = pattern.exec(input);

  if (match && match.length > 1 && match[1]) {
    return match[1].trim();
  }

  return "";
};
