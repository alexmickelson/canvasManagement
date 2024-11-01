import { describe, expect, it } from "vitest";
import { lectureToString } from "../fileStorage/utils/lectureUtils";
import { parseLecture } from "../fileStorage/utils/lectureUtils";
import { Lecture } from "@/models/local/lecture";

describe("can parse and stringify lectures", () => {
  it("can parse lecture", () => {
    const rawLecture = `
Name: some name
Date: 6/22/2024
---
this is the lecture


content`;
    const parsed = parseLecture(rawLecture);
    expect(parsed.name).toBe("some name");
    expect(parsed.date).toBe("6/22/2024");
    expect(parsed.content).toBe(`this is the lecture


content`);
  });

  it("parsing and stringification is deterministic", () => {
    const lecture: Lecture = {
      name: "test lecture",
      date: "06/*22/2024",
      content: `some content
- with
- a
- list`,
    };
    const rawLecture = lectureToString(lecture);
    const parsedLecture = parseLecture(rawLecture);
    expect(parsedLecture).toStrictEqual(lecture);
  });
});
