// @vitest-environment node

import { describe, expect, it } from "vitest";
import { markdownToHtmlNoImages } from "./htmlMarkdownUtils";

describe("markdownToHtmlNoImages in node", () => {
  it("sanitizes html without crashing", () => {
    const markdown = `<script>alert("xss")</script><p>safe</p>`;

    expect(() => markdownToHtmlNoImages(markdown)).not.toThrow();
    expect(markdownToHtmlNoImages(markdown)).not.toContain("<script>");
  });
});
