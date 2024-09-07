import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import React from "react";

export default function PagePreview({ page }: { page: LocalCoursePage }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: markdownToHTMLSafe(page.text),
      }}
    ></div>
  );
}
