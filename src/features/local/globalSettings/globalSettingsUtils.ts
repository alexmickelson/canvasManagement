import { GlobalSettings, zodGlobalSettings } from "./globalSettingsModels";
import { parse, stringify } from "yaml";
import {
  FeedbackDelimiters,
  defaultFeedbackDelimiters,
} from "../quizzes/models/utils/quizFeedbackMarkdownUtils";

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

export function overriddenDefaults<T>(
  defaults: T,
  overrides: Record<string, unknown>
): T {
  return Object.fromEntries(
    Object.entries(defaults as Record<string, unknown>).map(([k, v]) => [k, overrides[k] ?? v])
  ) as T;
}

export const getFeedbackDelimitersFromSettings = (
  settings: GlobalSettings
): FeedbackDelimiters => {
  return overriddenDefaults(
    defaultFeedbackDelimiters,
    settings.feedbackDelims ?? ({} as Record<string, unknown>)
  );
};

