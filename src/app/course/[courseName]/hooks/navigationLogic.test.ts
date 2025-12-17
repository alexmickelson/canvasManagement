import { describe, it, expect } from "vitest";
import {
  getOrderedItems,
  getOrderedLectures,
  getNavigationLinks,
  OrderedCourseItem,
} from "./navigationLogic";
import { CalendarItemsInterface } from "../context/calendarItemsContext";

describe("navigationLogic", () => {
  const courseName = "testCourse";

  it("getOrderedItems should order items by date, then alphabetically by name", () => {
    const createMock = (
      date: string,
      name: string,
      key: "assignments" | "quizzes" | "pages"
    ) =>
      ({
        [date]: { "Module 1": { [key]: [{ name }] } },
      } as unknown as CalendarItemsInterface);

    const orderedItems = getOrderedItems(
      courseName,
      createMock("2023-01-01", "Z Assignment", "assignments"),
      createMock("2023-01-01", "A Quiz", "quizzes"),
      createMock("2023-01-02", "B Assignment", "assignments"),
      createMock("2023-01-02", "A Page", "pages")
    );

    expect(orderedItems.map((i) => `${i.date} ${i.name}`)).toEqual([
      "2023-01-01 A Quiz",
      "2023-01-01 Z Assignment",
      "2023-01-02 A Page",
      "2023-01-02 B Assignment",
    ]);
  });

  it("getNavigationLinks should handle wrapping and normal navigation", () => {
    const items: OrderedCourseItem[] = [
      { type: "assignment", name: "1", moduleName: "M", date: "D", url: "u1" },
      { type: "quiz", name: "2", moduleName: "M", date: "D", url: "u2" },
      { type: "page", name: "3", moduleName: "M", date: "D", url: "u3" },
    ];

    // Forward wrap (last -> first)
    expect(getNavigationLinks(items, "page", "3", "M").nextUrl).toBe("u1");

    // Backward wrap (first -> last)
    expect(getNavigationLinks(items, "assignment", "1", "M").previousUrl).toBe(
      "u3"
    );

    // Normal navigation (middle)
    const middle = getNavigationLinks(items, "quiz", "2", "M");
    expect(middle.previousUrl).toBe("u1");
    expect(middle.nextUrl).toBe("u3");
  });

  it("getOrderedLectures should flatten weeks and generate correct URLs", () => {
    const weeks = [
      { lectures: [{ date: "01/01/2023" }] },
      { lectures: [{ date: "01/02/2023" }, { date: "01/03/2023" }] },
    ];
    const lectures = getOrderedLectures(weeks as any, courseName);
    expect(lectures).toHaveLength(3);
    expect(lectures[0].url).toContain(encodeURIComponent("01/01/2023"));
    expect(lectures[0].type).toBe("lecture");
  });
});
