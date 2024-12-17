import { describe, it, expect } from "vitest";
import { LocalCoursePage, localPageMarkdownUtils } from "../page/localCoursePage";

describe("PageMarkdownTests", () => {
  it("can parse page", () => {
    const name = "test title"
    const page: LocalCoursePage = {
      name,
      text: "test text content",
      dueAt: "07/09/2024 23:59:00",
    };

    const pageMarkdownString = localPageMarkdownUtils.toMarkdown(page);

    const parsedPage = localPageMarkdownUtils.parseMarkdown(pageMarkdownString, name);

    expect(parsedPage).toEqual(page);
  });
});
