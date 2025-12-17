import { GlobalSettings, zodGlobalSettings } from "./globalSettingsModels";
import { parse, stringify } from "yaml";
import {
  FeedbackDelimiters,
  defaultFeedbackDelimiters,
} from "../quizzes/models/utils/quizFeedbackMarkdownUtils";
import { string } from "zod";

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

export function overriddenDefaults<T extends object>(
  defaults: T,
  overrides: Record<string, any>,
): T {
  return Object.fromEntries(
    Object.entries(defaults).map(([k, v]) => [k, overrides[k] ?? v])
  ) as T;
}

export const getFeedbackDelimitersFromSettings = (
  settings: GlobalSettings
): FeedbackDelimiters => {
  return overriddenDefaults(
    defaultFeedbackDelimiters,
    settings.options?.feedbackDelims ?? {}
  );
};

