

export const getDateFromString = (value: string) => {
  // Updated regex to match both formats: "MM/DD/YYYY HH:mm:ss" and "M/D/YYYY h:mm:ss AM/PM"
  const validDateRegex = /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2}(?:\s?[APap][Mm])?$/;
  if (!validDateRegex.test(value)) {
    console.log("invalid date format", value);
    return undefined;
  }

  const [datePart, timePartWithMeridian] = value.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  let [timePart, meridian] = timePartWithMeridian.split(" ");
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  let adjustedHours = hours;
  if (meridian) {
    meridian = meridian.toUpperCase();
    if (meridian === "PM" && hours < 12) {
      adjustedHours += 12;
    } else if (meridian === "AM" && hours === 12) {
      adjustedHours = 0;
    }
  }

  const date = new Date(year, month - 1, day, adjustedHours, minutes, seconds);

  if (isNaN(date.getTime())) {
    console.log("could not parse time out of value", value);
    
    return undefined;
  }
  return date;
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
