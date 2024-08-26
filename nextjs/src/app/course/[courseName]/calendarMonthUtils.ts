"use client";
export interface CalendarMonthModel {
  year: number;
  month: number;
  weeks: (number | undefined)[][];
  daysByWeek: (Date | undefined)[][];
}

const weeksInMonth = (year: number, month: number): number => {
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const longDaysInMonth = daysInMonth + firstDayOfMonth;
  let weeks = Math.floor(longDaysInMonth / 7);
  if (longDaysInMonth % 7 > 0) {
    weeks += 1;
  }
  return weeks;
};

export const createCalendarMonth = (
  year: number,
  month: number
): CalendarMonthModel => {
  const daysByWeek: (Date | undefined)[][] = [];
  const weeksNumber = weeksInMonth(year, month);
  const daysInMonth = new Date(year, month, 0).getDate();

  let currentDay = 1;
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  for (let i = 0; i < weeksNumber; i++) {
    const thisWeek: (Date | undefined)[] = [];
    if (i === 0 && firstDayOfMonth !== 0) {
      // 0 is Sunday in JavaScript
      for (let j = 0; j < 7; j++) {
        if (j < firstDayOfMonth) {
          thisWeek.push(undefined);
        } else {
          thisWeek.push(new Date(year, month - 1, currentDay));
          currentDay++;
        }
      }
    } else {
      for (let j = 0; j < 7; j++) {
        if (currentDay <= daysInMonth) {
          thisWeek.push(new Date(year, month - 1, currentDay));
          currentDay++;
        } else {
          thisWeek.push(undefined);
        }
      }
    }
    daysByWeek.push(thisWeek);
  }

  const weeks = daysByWeek.map((week) =>
    week.map((day) => (day ? day.getDate() : undefined))
  );

  return { year, month, weeks, daysByWeek };
};

export const getMonthsBetweenDates = (
  startDate: Date,
  endDate: Date
): CalendarMonthModel[] => {
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
};
