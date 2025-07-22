import { describe, it, expect } from "vitest";
import { GlobalSettings } from "../globalSettings";
import {
  globalSettingsToYaml,
  parseGlobalSettingsYaml,
} from "../globalSettingsUtils";

describe("GlobalSettingsMarkdownTests", () => {
  it("can parse global settings", () => {
    const globalSettings: GlobalSettings = {
      courses: [
        {
          path: "./distributed/2025-alex/modules",
          name: "distributed",
        },
      ],
    };

    const globalSettingsMarkdown = globalSettingsToYaml(globalSettings);
    const parsedGlobalSettings = parseGlobalSettingsYaml(
      globalSettingsMarkdown
    );

    expect(parsedGlobalSettings).toEqual(globalSettings);
  });
});
