import { GlobalSettings } from "@/features/local/globalSettings/globalSettingsModels";
import { globalSettingsToYaml, parseGlobalSettingsYaml } from "@/features/local/globalSettings/globalSettingsUtils";
import { describe, it, expect } from "vitest";

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
