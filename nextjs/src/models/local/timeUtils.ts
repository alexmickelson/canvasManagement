const _getDateFromAMPM = (
  datePart: string,
  timePartWithMeridian: string
): Date | undefined => {
  const [day, month, year] = datePart.split("/").map(Number);
  const [timePart, meridian] = timePartWithMeridian.split(" ");
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  let adjustedHours = hours;
  if (meridian) {
    const upperMeridian = meridian.toUpperCase();
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
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hours, minutes, seconds);
  return isNaN(date.getTime()) ? undefined : date;
};

const _getDateFromISO = (value: string): Date | undefined => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
};

export const getDateFromString = (value: string): Date | undefined => {
  const ampmDateRegex =
    /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2}\s{1}[APap][Mm]$/; //"M/D/YYYY h:mm:ss AM/PM"
  const militaryDateRegex = /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2}$/; //"MM/DD/YYYY HH:mm:ss"
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)$/; //"2024-08-26T00:00:00.0000000"

  if (isoDateRegex.test(value)) {
    return _getDateFromISO(value);
  } else if (ampmDateRegex.test(value)) {
    const [datePart, timePartWithMeridian] = value.split(/[\s\u202F]+/);
    return _getDateFromAMPM(datePart, timePartWithMeridian);
  } else if (militaryDateRegex.test(value)) {
    const [datePart, timePart] = value.split(" ");
    return _getDateFromMilitary(datePart, timePart);
  } else {
    console.log("invalid date format", value);
    return undefined;
  }
};

export const getDateFromStringOrThrow = (value: string, labelForError: string): Date => {
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
  const myDate = verifyDateStringOrUndefined(value);
  if (!myDate) throw new Error(`Invalid format for ${labelForError}: ${value}`);
  return myDate;
};

export const dateToMarkdownString = (date: Date) => {
  const stringDay = String(date.getDate()).padStart(2, "0");
  const stringMonth = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const stringYear = date.getFullYear();
  const stringHours = String(date.getHours()).padStart(2, "0");
  const stringMinutes = String(date.getMinutes()).padStart(2, "0");
  const stringSeconds = String(date.getSeconds()).padStart(2, "0");

  return `${stringDay}/${stringMonth}/${stringYear} ${stringHours}:${stringMinutes}:${stringSeconds}`;
};
