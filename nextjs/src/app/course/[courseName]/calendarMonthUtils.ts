interface CalendarMonth {
  year: number;
  month: number;
  weeks: (number | null)[][];
  daysByWeek: (Date | null)[][];
}

const calendarMonthUtils = {
  weeksInMonth: (year: number, month: number): number => {
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const longDaysInMonth = daysInMonth + firstDayOfMonth;
    let weeks = Math.floor(longDaysInMonth / 7);
    if (longDaysInMonth % 7 > 0) {
      weeks += 1;
    }
    return weeks;
  },

  createCalendarMonth: (year: number, month: number): CalendarMonth => {
    const daysByWeek: (Date | null)[][] = [];
    const weeksInMonth = calendarMonthUtils.weeksInMonth(year, month);
    const daysInMonth = new Date(year, month, 0).getDate();

    let currentDay = 1;
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

    for (let i = 0; i < weeksInMonth; i++) {
      const thisWeek: (Date | null)[] = [];
      if (i === 0 && firstDayOfMonth !== 0) { // 0 is Sunday in JavaScript
        for (let j = 0; j < 7; j++) {
          if (j < firstDayOfMonth) {
            thisWeek.push(null);
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
            thisWeek.push(null);
          }
        }
      }
      daysByWeek.push(thisWeek);
    }

    const weeks = daysByWeek.map(week => week.map(day => day ? day.getDate() : null));

    return { year, month, weeks, daysByWeek };
  },

  getMonthsBetweenDates: (startDate: Date, endDate: Date): CalendarMonth[] => {
    const monthsInTerm = 1 + (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();

    return Array.from({ length: monthsInTerm }, (_, monthDiff) => {
      const month = ((startDate.getMonth() + monthDiff) % 12) + 1;
      const year = startDate.getFullYear() + Math.floor((startDate.getMonth() + monthDiff) / 12);
      return calendarMonthUtils.createCalendarMonth(year, month);
    });
  }
};
