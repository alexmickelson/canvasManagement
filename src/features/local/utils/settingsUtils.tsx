import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "./timeUtils";

export const parseHolidays = (
  inputText: string
): {
  name: string;
  days: string[];
}[] => {
  let holidays: {
    name: string;
    days: string[];
  }[] = [];

  const lines = inputText.split("\n").filter((line) => line.trim() !== "");
  let currentHoliday: string | null = null;

  lines.forEach((line) => {
    if (line.includes(":")) {
      const holidayName = line.split(":")[0].trim();
      currentHoliday = holidayName;
      holidays = [...holidays, { name: holidayName, days: [] }];
    } else if (currentHoliday && line.startsWith("-")) {
      const date = line.replace("-", "").trim();
      const dateObject = getDateFromStringOrThrow(date, "parsing holiday text");

      const holiday = holidays.find((h) => h.name == currentHoliday);
      holiday?.days.push(getDateOnlyMarkdownString(dateObject));
    }
  });

  return holidays;
};

export const holidaysToString = (
  holidays: {
    name: string;
    days: string[];
  }[]
) => {
  const entries = holidays.map((holiday) => {
    const title = holiday.name + ":\n";
    const days = holiday.days.map((d) => `- ${d}\n`);
    return title + days.join("");
  });

  return entries.join("");
};
