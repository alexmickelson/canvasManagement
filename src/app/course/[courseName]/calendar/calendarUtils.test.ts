import { describe, expect, it } from "vitest";
import { getWeekNumber } from "./calendarMonthUtils";


// months are 0 based, days are 1 based
describe("testing week numbers", () => {

  it("can get before first day", () => {
    const startDate = new Date(2024, 8, 3);
    const firstDayOfFirstWeek = new Date(2024, 8, 1);

    const weekNumber = getWeekNumber(startDate, firstDayOfFirstWeek);
    expect(weekNumber).toBe(1);
  });

  it("can get end of first week", () => {
    const startDate = new Date(2024, 8, 3);
    const firstDayOfFirstWeek = new Date(2024, 8, 7);

    const weekNumber = getWeekNumber(startDate, firstDayOfFirstWeek);
    expect(weekNumber).toBe(1);
  });

  it("can get start of second week", () => {
    const startDate = new Date(2024, 8, 3);
    const firstDayOfFirstWeek = new Date(2024, 8, 8);

    const weekNumber = getWeekNumber(startDate, firstDayOfFirstWeek);
    expect(weekNumber).toBe(2);
  });

  it("can get start of third week", () => {
    const startDate = new Date(2024, 8, 3);
    const firstDayOfFirstWeek = new Date(2024, 8, 15);

    const weekNumber = getWeekNumber(startDate, firstDayOfFirstWeek);
    expect(weekNumber).toBe(3);
  });
  it("can get previous week", () => {
    const startDate = new Date(2024, 8, 3);
    const firstDayOfFirstWeek = new Date(2024, 7, 29);

    const weekNumber = getWeekNumber(startDate, firstDayOfFirstWeek);
    expect(weekNumber).toBe(-1);
  });

});
