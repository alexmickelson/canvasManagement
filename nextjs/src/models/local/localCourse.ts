import { LocalAssignmentGroup } from "./assignmnet/localAssignmentGroup";
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
    return parse(settingsString);
  },
  settingsToYaml: (settings: LocalCourseSettings) => {
    return stringify(settings);
  },
};
