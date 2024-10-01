"use client";

import {
  dateToMarkdownString,
  getDateFromStringOrThrow,
} from "@/models/local/timeUtils";

export interface CalendarMonthModel {
  year: number;
  month: number;
  weeks: number[][];
  daysByWeek: string[][]; //iso date is memo-izable
}

function weeksInMonth(year: number, month: number): number {
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const longDaysInMonth = daysInMonth + firstDayOfMonth;
  let weeks = Math.floor(longDaysInMonth / 7);
  if (longDaysInMonth % 7 > 0) {
    weeks += 1;
  }
  return weeks;
}

function createCalendarMonth(year: number, month: number): CalendarMonthModel {
  const weeksNumber = weeksInMonth(year, month);
  const daysInMonth = new Date(year, month, 0).getDate();

  let currentDay = 1;
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  const daysByWeek = Array.from({ length: weeksNumber }).map((_, weekIndex) =>
    Array.from({ length: 7 }).map((_, dayIndex) => {
      if (weekIndex === 0 && dayIndex < firstDayOfMonth) {
        return dateToMarkdownString(
          new Date(year, month - 1, dayIndex - firstDayOfMonth + 1, 12, 0, 0)
        );
      } else if (currentDay <= daysInMonth) {
        return dateToMarkdownString(
          new Date(year, month - 1, currentDay++, 12, 0, 0)
        );
      } else {
        currentDay++;
        return dateToMarkdownString(
          new Date(year, month, currentDay - daysInMonth - 1, 12, 0, 0)
        );
      }
    })
  );

  const weeks = daysByWeek.map((week) =>
    week.map((day) =>
      getDateFromStringOrThrow(day, "calculating weeks").getDate()
    )
  );

  return { year, month, weeks, daysByWeek };
}

export function getMonthsBetweenDates(
  startDate: Date,
  endDate: Date
): CalendarMonthModel[] {
  const monthsInTerm =
    1 +
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth();

  return Array.from({ length: monthsInTerm }, (_, monthDiff) => {
    const month = ((startDate.getMonth() + monthDiff) % 12) + 1;
    const year =
      startDate.getFullYear() +
      Math.floor((startDate.getMonth() + monthDiff) / 12);
    return createCalendarMonth(year, month);
  });
}

export const getWeekNumber = (startDate: Date, currentDate: Date) => {
  const sundayBeforeStartDate = getPreviousSunday(startDate);
  const daysBetween = daysBetweenDates(sundayBeforeStartDate, currentDate);
  const weeksDiff = Math.floor(daysBetween / 7);

  if (weeksDiff >= 0) return weeksDiff + 1;
  return weeksDiff;
};

const daysBetweenDates = (startDate: Date, endDate: Date) => {
  const diffInTime = endDate.getTime() - startDate.getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);
  return Math.floor(diffInDays);
};

const getPreviousSunday = (date: Date) => {
  const result = new Date(date);
  const dayOfWeek = result.getDay();

  result.setDate(result.getDate() - dayOfWeek);

  return result;
};
