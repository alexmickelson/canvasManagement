"use client";
import { getDateFromStringOrThrow, dateToMarkdownString } from "@/models/local/utils/timeUtils";


export function getNewLockDate(
  originalDueDate: string,
  originalLockDate: string | undefined,
  dayAsDate: Date
): string | undefined {
  // todo: preserve previous due date / lock date offset
  const dueDate = getDateFromStringOrThrow(originalDueDate, "dueAt date");
  const lockDate = originalLockDate === undefined
    ? undefined
    : getDateFromStringOrThrow(originalLockDate, "lockAt date");

  const originalOffset = lockDate === undefined ? undefined : lockDate.getTime() - dueDate.getTime();

  const newLockDate = originalOffset === undefined
    ? undefined
    : new Date(dayAsDate.getTime() + originalOffset);

  return newLockDate === undefined
    ? undefined
    : dateToMarkdownString(newLockDate);
}
