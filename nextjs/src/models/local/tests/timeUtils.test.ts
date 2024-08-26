


import { describe, it, expect } from "vitest";
import { getDateFromString } from "../timeUtils";

describe("Can properly handle expected date formats", () => {
  it("can use AM/PM dates", () =>{
    const dateString = "8/27/2024 1:00:00 AM"
    const dateObject = getDateFromString(dateString)
    expect(dateObject).not.toBeUndefined()
  })
  it("can use 24 hour dates", () =>{
    const dateString = "8/27/2024 23:95:00"
    const dateObject = getDateFromString(dateString)
    expect(dateObject).not.toBeUndefined()
  })
  it("can use ISO format", () =>{
    const dateString = "2024-08-26T00:00:00.0000000"
    const dateObject = getDateFromString(dateString)
    expect(dateObject).not.toBeUndefined()
  })
})