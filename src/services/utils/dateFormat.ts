export function formatHumanReadableDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    // year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return d.toLocaleString(undefined, options);
}
