/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocalAssignmentGroup } from "./assignment/localAssignmentGroup";
import { LocalModule } from "./localModules";
import { parse, stringify } from "yaml";

export interface LocalCourse {
  modules: LocalModule[];
  settings: LocalCourseSettings;
}

export interface SimpleTimeOnly {
  hour: number;
  minute: number;
}

export interface LocalCourseSettings {
  name: string;
  assignmentGroups: LocalAssignmentGroup[];
  daysOfWeek: DayOfWeek[];
  canvasId?: number;
  startDate: string;
  endDate: string;
  defaultDueTime: SimpleTimeOnly;
}

export enum DayOfWeek {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}
export const localCourseYamlUtils = {
  parseSettingYaml: (settingsString: string): LocalCourseSettings => {
    const settings = parse(settingsString);
    return lowercaseFirstLetter(settings);
  },
  settingsToYaml: (settings: LocalCourseSettings) => {
    return stringify(settings);
  },
};

function lowercaseFirstLetter<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj as T;

  if (Array.isArray(obj)) return obj.map(lowercaseFirstLetter) as unknown as T;

  const result: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    const value = (obj as Record<string, any>)[key];
    const newKey = key.charAt(0).toLowerCase() + key.slice(1);

    if (value && typeof value === "object") {
      result[newKey] = lowercaseFirstLetter(value);
    } else {
      result[newKey] = value;
    }
  });

  return result as T;
}