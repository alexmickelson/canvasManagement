import { extractLabelValue } from "../assignmnet/utils/markdownUtils";
import { LocalCoursePage } from "./localCoursePage";

export const pageMarkdown = {
  toMarkdown: (page: LocalCoursePage) => {
    const printableDueDate = new Date(page.dueAt)
      .toISOString()
      .replace("\u202F", " ");
    const settingsMarkdown = `Name: ${page.name}\nDueDateForOrdering: ${printableDueDate}\n---\n`;
    return settingsMarkdown + page.text;
  },

  parseMarkdown: (pageMarkdown: string) => {
    const rawSettings = pageMarkdown.split("---")[0];
    const name = extractLabelValue(rawSettings, "Name");
    const rawDate = extractLabelValue(rawSettings, "DueDateForOrdering");

    const parsedDate = new Date(rawDate);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`could not parse due date: ${rawDate}`);
    }

    const text = pageMarkdown.split("---\n")[1];

    const page: LocalCoursePage = {
      name,
      dueAt: parsedDate.toISOString(),
      text,
    };
    return page;
  },
};
