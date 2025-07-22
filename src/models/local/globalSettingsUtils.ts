import { GlobalSettings, zodGlobalSettings } from "./globalSettings";
import { parse, stringify } from "yaml";

export const globalSettingsToYaml = (settings: GlobalSettings) => {
  return stringify(settings);
};

export const parseGlobalSettingsYaml = (yaml: string): GlobalSettings => {
  const parsed = parse(yaml);
  try {
    return zodGlobalSettings.parse(parsed);
  } catch (e) {
    console.error("Error parsing global settings YAML:", e);
    throw new Error(`Error parsing global settings, got ${yaml}, ${e}`);
  }
};

