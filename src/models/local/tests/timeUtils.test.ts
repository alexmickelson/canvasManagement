import { describe, it, expect } from "vitest";
import { dateToMarkdownString, getDateFromString } from "../utils/timeUtils";

describe("Can properly handle expected date formats", () => {
  it("can use AM/PM dates", () => {
    const dateString = "8/27/2024 1:00:00 AM";
    const dateObject = getDateFromString(dateString);
    expect(dateObject).not.toBeUndefined();
  });
  it("can use 24 hour dates", () => {
    const dateString = "8/27/2024 23:95:00";
    const dateObject = getDateFromString(dateString);
    expect(dateObject).not.toBeUndefined();
  });
  it("can use ISO format", () => {
    const dateString = "2024-08-26T00:00:00.0000000";
    const dateObject = getDateFromString(dateString);
    expect(dateObject).not.toBeUndefined();
  });
  it("can use other ISO format", () => {
    const dateString = "2024-08-26T06:00:00Z";
    const dateObject = getDateFromString(dateString);
    expect(dateObject).not.toBeUndefined();
  });
  it("can get correct time from format", () => {
    const dateString = "08/28/2024 23:59:00";
    const dateObject = getDateFromString(dateString);

    expect(dateObject?.getDate()).toBe(28);
    expect(dateObject?.getMonth()).toBe(8 - 1); // 0 based
    expect(dateObject?.getFullYear()).toBe(2024);
    expect(dateObject?.getMinutes()).toBe(59);
    expect(dateObject?.getHours()).toBe(23);
    expect(dateObject?.getSeconds()).toBe(0);
  });
  it("can get correct time from format", () => {
    const dateString = "8/27/2024 1:00:00 AM";
    const dateObject = getDateFromString(dateString);

    expect(dateObject?.getDate()).toBe(27);
    expect(dateObject?.getMonth()).toBe(8 - 1); // 0 based
    expect(dateObject?.getFullYear()).toBe(2024);
    expect(dateObject?.getMinutes()).toBe(0);
    expect(dateObject?.getHours()).toBe(1);
    expect(dateObject?.getSeconds()).toBe(0);
  });
  it("can get correct time from format", () => {
    const dateString = "08/27/2024 23:59:00";
    const dateObject = getDateFromString(dateString);

    expect(dateObject).not.toBeUndefined()
    const updatedString = dateToMarkdownString(dateObject!)
    expect(updatedString).toBe(dateString)
  });
  it("can handle canvas time format", () => {
    const dateString = "8/29/2024, 5:00:00 PM";
    const dateObject = getDateFromString(dateString);

    expect(dateObject).not.toBeUndefined()
    const updatedString = dateToMarkdownString(dateObject!)
    expect(updatedString).toBe("08/29/2024 17:00:00")
    
  })
  it("can handle date without time", () => {
    const dateString = "8/29/2024";
    const dateObject = getDateFromString(dateString);

    expect(dateObject).not.toBeUndefined()
    const updatedString = dateToMarkdownString(dateObject!)
    expect(updatedString).toBe("08/29/2024 00:00:00")
  })
});
