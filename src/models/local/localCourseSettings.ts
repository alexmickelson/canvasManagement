import { z } from "zod";
import {
  AssignmentSubmissionType,
  zodAssignmentSubmissionType,
} from "./assignment/assignmentSubmissionType";
import {
  LocalAssignmentGroup,
  zodLocalAssignmentGroup,
} from "./assignment/localAssignmentGroup";
import { parse, stringify } from "yaml";

export interface SimpleTimeOnly {
  hour: number;
  minute: number;
}
export const zodSimpleTimeOnly = z.object({
  hour: z.number().int().min(0).max(23), // hour should be an integer between 0 and 23
  minute: z.number().int().min(0).max(59), // minute should be an integer between 0 and 59
});

export enum DayOfWeek {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}

export const zodDayOfWeek = z.enum([
  DayOfWeek.Sunday,
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
]);

export interface LocalCourseSettings {
  name: string;
  assignmentGroups: LocalAssignmentGroup[];
  daysOfWeek: DayOfWeek[];
  canvasId: number;
  startDate: string;
  endDate: string;
  defaultDueTime: SimpleTimeOnly;
  defaultLockHoursOffset?: number;
  defaultAssignmentSubmissionTypes: AssignmentSubmissionType[];
  defaultFileUploadTypes: string[];
  holidays: {
    name: string;
    days: string[];
  }[];
  assets: {
    sourceUrl: string;
    canvasUrl: string;
  }[];
}

export const zodLocalCourseSettings = z.object({
  name: z.string(),
  assignmentGroups: zodLocalAssignmentGroup.array(),
  daysOfWeek: zodDayOfWeek.array(),
  canvasId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  defaultDueTime: zodSimpleTimeOnly,
  defaultLockHoursOffset: z.number().int().optional(),
  defaultAssignmentSubmissionTypes: zodAssignmentSubmissionType.array(),
  defaultFileUploadTypes: z.string().array(),
  holidays: z
    .object({
      name: z.string(),
      days: z.string().array(),
    })
    .array(),
  assets: z
    .object({
      sourceUrl: z.string(),
      canvasUrl: z.string(),
    })
    .array(),
});

export function getDayOfWeek(date: Date): DayOfWeek {
  const dayIndex = date.getDay(); // Returns 0 for Sunday, 1 for Monday, etc.
  return DayOfWeek[Object.keys(DayOfWeek)[dayIndex] as keyof typeof DayOfWeek];
}

export const localCourseYamlUtils = {
  parseSettingYaml: (settingsString: string): LocalCourseSettings => {
    const settings = parse(settingsString, {});
    return lowercaseFirstLetter(settings);
  },
  settingsToYaml: (settings: Omit<LocalCourseSettings, "name">) => {
    return stringify(settings);
  },
};

function lowercaseFirstLetter<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj as T;

  if (Array.isArray(obj)) return obj.map(lowercaseFirstLetter) as unknown as T;

  const result: Record<string, unknown> = {};
  Object.keys(obj).forEach((key) => {
    const value = (obj as Record<string, unknown>)[key];
    const newKey = key.charAt(0).toLowerCase() + key.slice(1);

    if (value && typeof value === "object") {
      result[newKey] = lowercaseFirstLetter(value);
    } else {
      result[newKey] = value;
    }
  });

  return result as T;
}
