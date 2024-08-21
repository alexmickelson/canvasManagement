import { describe, it, expect } from "vitest";
import { LocalCoursePage } from "../../page/localCoursePage";
import { pageMarkdown } from "../../page/pageMarkdown";

describe("PageMarkdownTests", () => {
  it("can parse page", () => {
    const page: LocalCoursePage = {
      name: "test title",
      text: "test text content",
      dueAt: new Date().toISOString(),
    };

    const pageMarkdownString = pageMarkdown.toMarkdown(page);

    const parsedPage = pageMarkdown.parseMarkdown(pageMarkdownString);

    expect(parsedPage).toEqual(page);
  });
});
