import { describe, it, expect } from "vitest";
import { LocalCoursePage } from "../../page/localCoursePage";
import { pageMarkdownUtils } from "../../page/pageMarkdownUtils";

describe("PageMarkdownTests", () => {
  it("can parse page", () => {
    const page: LocalCoursePage = {
      name: "test title",
      text: "test text content",
      dueAt: new Date().toISOString(),
    };

    const pageMarkdownString = pageMarkdownUtils.toMarkdown(page);

    const parsedPage = pageMarkdownUtils.parseMarkdown(pageMarkdownString);

    expect(parsedPage).toEqual(page);
  });
});
