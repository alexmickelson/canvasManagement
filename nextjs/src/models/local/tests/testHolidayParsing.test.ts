import { describe, it, expect } from "vitest";
import { parseHolidays } from "../settingsUtils";

describe("can parse holiday string", () => {
  it("can parse empty list", () => {
    const testString = `
springBreak:
`;
    const output = parseHolidays(testString);
    expect(output).toEqual([{ name: "springBreak", days: [] }]);
  });
  it("can parse list with date", () => {
    const testString = `
springBreak:
- 10/12/2024
`;
    const output = parseHolidays(testString);
    expect(output).toEqual([{ name: "springBreak", days: ["10/12/2024"] }]);
  });
  it("can parse list with two dates", () => {
    const testString = `
springBreak:
- 10/12/2024
- 10/13/2024
`;
    const output = parseHolidays(testString);
    expect(output).toEqual([
      { name: "springBreak", days: ["10/12/2024", "10/13/2024"] },
    ]);
  });
});
