import { z } from "zod";
import { extractLabelValue } from "../assignment/utils/markdownUtils";
import { IModuleItem } from "../IModuleItem";
import { verifyDateOrThrow } from "../utils/timeUtils";

export interface LocalCoursePage extends IModuleItem {
  name: string;
  text: string;
  dueAt: string;
}

export const zodLocalCoursePage = z.object({
  name: z.string(),
  text: z.string(),
  dueAt: z.string(), // ISO 8601 date string
});

export const localPageMarkdownUtils = {
  toMarkdown: (page: LocalCoursePage) => {
    const printableDueDate = verifyDateOrThrow(
      page.dueAt,
      "page DueDateForOrdering"
    );
    const settingsMarkdown = `Name: ${page.name}\nDueDateForOrdering: ${printableDueDate}\n---\n`;
    return settingsMarkdown + page.text;
  },

  parseMarkdown: (pageMarkdown: string) => {
    const rawSettings = pageMarkdown.split("---")[0];
    const name = extractLabelValue(rawSettings, "Name");
    const rawDate = extractLabelValue(rawSettings, "DueDateForOrdering");
    const dueAt = verifyDateOrThrow(rawDate, "page DueDateForOrdering");

    const text = pageMarkdown.split("---\n")[1];

    const page: LocalCoursePage = {
      name,
      dueAt,
      text,
    };
    return page;
  },
};
