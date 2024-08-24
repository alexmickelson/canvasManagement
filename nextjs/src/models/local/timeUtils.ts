

export const getDateFromString = (value: string) => {
  // may need to check for other formats
  const validDateRegex =
    /\d{2}\/\d{2}\/\d{4} [0-2][0-9]|[0-5][0-9]|[0-2][0-9]:[0-5][0-9]:[0-5][0-9]/;
  if (!validDateRegex.test(value)) {
    return undefined;
  }

  const [datePart, timePart] = value.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, seconds);

  if (isNaN(date.getTime())) {
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
