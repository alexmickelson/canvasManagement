import { LocalCourseSettings } from "../localCourseSettings";

const _getDateFromAMPM = (
  datePart: string,
  timePart: string,
  amPmPart: string
): Date | undefined => {
  const [month, day, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  let adjustedHours = hours;
  if (amPmPart) {
    const upperMeridian = amPmPart.toUpperCase();
    if (upperMeridian === "PM" && hours < 12) {
      adjustedHours += 12;
    } else if (upperMeridian === "AM" && hours === 12) {
      adjustedHours = 0;
    }
  }

  const date = new Date(year, month - 1, day, adjustedHours, minutes, seconds);
  return isNaN(date.getTime()) ? undefined : date;
};

const _getDateFromMilitary = (
  datePart: string,
  timePart: string
): Date | undefined => {
  const [month, day, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hours, minutes, seconds);
  return isNaN(date.getTime()) ? undefined : date;
};

const _getDateFromISO = (value: string): Date | undefined => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
};

const _getDateFromDateOnly = (datePart: string): Date | undefined => {
  const [month, day, year] = datePart.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? undefined : date;
};

export const getDateFromString = (value: string): Date | undefined => {
  const ampmDateRegex =
    /^\d{1,2}\/\d{1,2}\/\d{4},? \d{1,2}:\d{2}:\d{2}\s{1}[APap][Mm]$/; //"M/D/YYYY h:mm:ss AM/PM" or "M/D/YYYY, h:mm:ss AM/PM"
  const militaryDateRegex = /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2}$/; //"MM/DD/YYYY HH:mm:ss"
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}((.\d+)|(Z))$/; //"2024-08-26T00:00:00.0000000"
  const dateOnlyRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/; // "M/D/YYYY" or "MM/DD/YYYY"

  if (isoDateRegex.test(value)) {
    return _getDateFromISO(value);
  } else if (ampmDateRegex.test(value)) {
    const [datePart, timePart, amPmPart] = value.split(/,?[\s\u202F]+/);
    return _getDateFromAMPM(datePart, timePart, amPmPart);
  } else if (militaryDateRegex.test(value)) {
    const [datePart, timePart] = value.split(" ");
    return _getDateFromMilitary(datePart, timePart);
  }
  if (dateOnlyRegex.test(value)) {
    return _getDateFromDateOnly(value);
  } else {
    if (value) console.log("invalid date format", value);
    return undefined;
  }
};

export const getDateFromStringOrThrow = (
  value: string,
  labelForError: string
): Date => {
  const d = getDateFromString(value);
  if (!d) throw Error(`Invalid date format for ${labelForError}, ${value}`);
  return d;
};

export const verifyDateStringOrUndefined = (
  value: string
): string | undefined => {
  const date = getDateFromString(value);
  return date ? dateToMarkdownString(date) : undefined;
};

export const verifyDateOrThrow = (
  value: string,
  labelForError: string
): string => {
  const myDate = getDateFromString(value);
  if (!myDate) throw new Error(`Invalid format for ${labelForError}: ${value}`);
  return dateToMarkdownString(myDate);
};

export const dateToMarkdownString = (date: Date) => {
  const stringDay = String(date.getDate()).padStart(2, "0");
  const stringMonth = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const stringYear = date.getFullYear();
  const stringHours = String(date.getHours()).padStart(2, "0");
  const stringMinutes = String(date.getMinutes()).padStart(2, "0");
  const stringSeconds = String(date.getSeconds()).padStart(2, "0");

  return `${stringMonth}/${stringDay}/${stringYear} ${stringHours}:${stringMinutes}:${stringSeconds}`;
};

export const getDateOnlyMarkdownString = (date: Date) => {
  return dateToMarkdownString(date).split(" ")[0];
};

export function getTermName(startDate: string) {
  const [year, month, ..._rest] = startDate.split("-");
  if (month < "04") return "Spring " + year;
  if (month < "07") return "Summer " + year;
  return "Fall " + year;
}

export function getDateKey(dateString: string) {
  return dateString.split("T")[0];
}
export function groupByStartDate(courses: LocalCourseSettings[]): {
  [key: string]: LocalCourseSettings[];
} {
  return courses.reduce(
    (acc, course) => {
      const { startDate } = course;
      const key = getDateKey(startDate);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(course);
      return acc;
    },
    {} as {
      [key: string]: LocalCourseSettings[];
    }
  );
}
