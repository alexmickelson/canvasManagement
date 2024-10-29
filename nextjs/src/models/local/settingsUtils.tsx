import {
  dateToMarkdownString,
  getDateFromString,
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "./timeUtils";

export const parseHolidays = (
  inputText: string
): { [holidayName: string]: string[] } => {
  const holidays: { [holidayName: string]: string[] } = {};

  const lines = inputText.split("\n").filter((line) => line.trim() !== "");
  let currentHoliday: string | null = null;

  lines.forEach((line) => {
    if (line.includes(":")) {
      const holidayName = line.split(":")[0].trim();
      currentHoliday = holidayName;
      holidays[currentHoliday] = [];
    } else if (currentHoliday && line.startsWith("-")) {
      const date = line.replace("-", "").trim();
      const dateObject = getDateFromStringOrThrow(date, "parsing holiday text");
      holidays[currentHoliday].push(getDateOnlyMarkdownString(dateObject));
    }
  });

  return holidays;
};


export const holidaysToString = (holidays: { [holidayName: string]: string[] })=> {
  const entries = Object.keys(holidays).map(holiday => {
    const title = holiday + ":\n"
    const days = holidays[holiday].map(d => `- ${d}\n`)
    return title + days.join("")
  })

  return entries.join("")
}