import { describe, it, expect } from "vitest";
import { LocalCoursePage, localPageMarkdownUtils } from "../page/localCoursePage";

describe("PageMarkdownTests", () => {
  it("can parse page", () => {
    const page: LocalCoursePage = {
      name: "test title",
      text: "test text content",
      dueAt: "09/07/2024 23:59:00",
    };

    const pageMarkdownString = localPageMarkdownUtils.toMarkdown(page);

    const parsedPage = localPageMarkdownUtils.parseMarkdown(pageMarkdownString);

    expect(parsedPage).toEqual(page);
  });
});
