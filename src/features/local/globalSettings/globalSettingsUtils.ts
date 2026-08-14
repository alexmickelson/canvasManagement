import {
  GlobalSettings,
  GlobalSettingsCourse,
  zodGlobalSettings,
} from "./globalSettingsModels";
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
  let settings: GlobalSettings;
  try {
    settings = zodGlobalSettings.parse(parsed);
  } catch (e) {
    console.error("Error parsing global settings YAML:", e);
    throw new Error(`Error parsing global settings, got ${yaml}, ${e}`, {
      cause: e,
    });
  }

  // checked outside the try so the explanation is not buried in a dump of the
  // whole yaml file
  assertUniqueCourseNames(settings.courses);

  return settings;
};

export type DuplicateCourseName = {
  name: string;
  paths: string[];
};

export const findDuplicateCourseNames = (
  courses: readonly GlobalSettingsCourse[]
): DuplicateCourseName[] => {
  const pathsByName = new Map<string, string[]>();
  for (const course of courses) {
    const paths = pathsByName.get(course.name);
    if (paths) paths.push(course.path);
    else pathsByName.set(course.name, [course.path]);
  }

  return [...pathsByName.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([name, paths]) => ({ name, paths }));
};

export const whyCourseNamesMustBeUnique =
  "A course name is the id canvas manager looks a course up by. The name in " +
  "the url is matched against globalSettings.yml to find the course folder, " +
  "and that folder's settings.yml is where the canvasId comes from. The " +
  "lookup takes the first match, so when two courses share a name only the " +
  "first one can ever be opened, and edits and canvas uploads meant for the " +
  "other one are silently applied to the first course and pushed to its " +
  "canvas id instead.";

export const duplicateCourseNamesMessage = (
  duplicates: readonly DuplicateCourseName[]
) =>
  [
    ...duplicates.map(
      (duplicate) =>
        `Duplicate course name "${duplicate.name}" in globalSettings.yml, ` +
        `used by ${duplicate.paths.length} courses:\n` +
        duplicate.paths.map((path) => `  - ${path}`).join("\n")
    ),
    whyCourseNamesMustBeUnique,
    "Give every course in globalSettings.yml a distinct name.",
  ].join("\n\n");

export const assertUniqueCourseNames = (
  courses: readonly GlobalSettingsCourse[]
) => {
  const duplicates = findDuplicateCourseNames(courses);
  if (duplicates.length > 0) {
    throw new Error(duplicateCourseNamesMessage(duplicates));
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

