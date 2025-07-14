import MarkdownDisplay from "@/components/MarkdownDisplay";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import React from "react";

export default function PagePreview({ page }: { page: LocalCoursePage }) {
  return (
    <MarkdownDisplay markdown={page.text} />
  );
}
