import { describe, it, expect } from "vitest";
import {
  assertUniqueCourseNames,
  findDuplicateCourseNames,
  getFeedbackDelimitersFromSettings,
  overriddenDefaults,
  parseGlobalSettingsYaml,
} from "./globalSettingsUtils";
import { defaultFeedbackDelimiters } from "../quizzes/models/utils/quizFeedbackMarkdownUtils";
import { GlobalSettings } from "./globalSettingsModels";

describe("overriddenDefaults", () => {
  it("uses defaults when overrides are missing", () => {
    const defaults = { a: 1, b: 2 };
    const overrides = {};
    expect(overriddenDefaults(defaults, overrides)).toEqual({ a: 1, b: 2 });
  });

  it("uses overrides when present", () => {
    const defaults = { a: 1, b: 2 };
    const overrides = { a: 3 };
    expect(overriddenDefaults(defaults, overrides)).toEqual({ a: 3, b: 2 });
  });

  it("ignores extra keys in overrides", () => {
    const defaults = { a: 1 };
    const overrides = { a: 2, c: 3 };
    expect(overriddenDefaults(defaults, overrides)).toEqual({ a: 2 });
  });
});

describe("duplicate course names", () => {
  const distributedSpring = {
    path: "./4620_Distributed/2026-spring-alex/modules/",
    name: "Distributed",
  };
  const distributedFall = {
    path: "./4620_Distributed/2026-fall-jonathan/",
    name: "Distributed",
  };
  const telemetry = {
    path: "./3840_Telemetry/2026_spring_alex/",
    name: "Telemetry",
  };

  it("finds no duplicates when every name is distinct", () => {
    expect(
      findDuplicateCourseNames([distributedSpring, telemetry])
    ).toEqual([]);
  });

  it("groups every path that shares a name", () => {
    expect(
      findDuplicateCourseNames([distributedSpring, telemetry, distributedFall])
    ).toEqual([
      {
        name: "Distributed",
        paths: [distributedSpring.path, distributedFall.path],
      },
    ]);
  });

  it("does not treat different names as duplicates", () => {
    expect(() =>
      assertUniqueCourseNames([distributedSpring, telemetry])
    ).not.toThrow();
  });

  it("names the duplicate and both of its paths when it throws", () => {
    expect(() =>
      assertUniqueCourseNames([distributedSpring, distributedFall])
    ).toThrowError(
      expect.objectContaining({
        message: expect.stringContaining(distributedFall.path),
      })
    );
    expect(() =>
      assertUniqueCourseNames([distributedSpring, distributedFall])
    ).toThrowError(/Duplicate course name "Distributed"/);
  });

  it("explains why duplicate names are a problem", () => {
    expect(() =>
      assertUniqueCourseNames([distributedSpring, distributedFall])
    ).toThrowError(/canvasId/);
  });

  it("rejects a settings file with duplicate names", () => {
    const yaml = `courses:
  - path: ${distributedSpring.path}
    name: Distributed
  - path: ${distributedFall.path}
    name: Distributed
`;
    expect(() => parseGlobalSettingsYaml(yaml)).toThrowError(
      /Duplicate course name "Distributed"/
    );
  });

  it("does not dump the whole settings file into the duplicate name error", () => {
    const yaml = `courses:
  - path: ${distributedSpring.path}
    name: Distributed
  - path: ${distributedFall.path}
    name: Distributed
`;
    expect(() => parseGlobalSettingsYaml(yaml)).not.toThrowError(
      /Error parsing global settings/
    );
  });
});

describe("getFeedbackDelimitersFromSettings", () => {
  it("returns default delimiters if options are missing", () => {
    const settings: GlobalSettings = {
      courses: [],
    };
    expect(getFeedbackDelimitersFromSettings(settings)).toEqual(
      defaultFeedbackDelimiters
    );
  });

  it("returns custom delimiters if options are present", () => {
    const settings: GlobalSettings = {
      courses: [],
      feedbackDelims: {
        neutral: ":|",
        correct: ":)",
        incorrect: ":(",
      },
    };
    const expected = {
      correct: ":)",
      incorrect: ":(",
      neutral: ":|",
    };
    expect(getFeedbackDelimitersFromSettings(settings)).toEqual(expected);
  });

  it("returns mixed delimiters if some options are missing", () => {
    const settings: GlobalSettings = {
      courses: [],
      feedbackDelims: {
        correct: ":)",
      },
    };
    const expected = {
      ...defaultFeedbackDelimiters,
      correct: ":)",
    };
    expect(getFeedbackDelimitersFromSettings(settings)).toEqual(expected);
  });
});
