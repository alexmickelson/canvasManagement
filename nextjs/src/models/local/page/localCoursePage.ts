import { IModuleItem } from "../IModuleItem";

export interface LocalCoursePage extends IModuleItem {
  name: string;
  text: string;
  dueAt: string;
}
