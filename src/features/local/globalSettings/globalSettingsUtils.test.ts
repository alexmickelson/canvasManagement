import { describe, it, expect } from "vitest";
import { getFeedbackDelimitersFromSettings, overriddenDefaults } from "./globalSettingsUtils";
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
