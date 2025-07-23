import MarkdownDisplay from "@/components/MarkdownDisplay";
import { LocalCoursePage } from "@/features/local/pages/localCoursePageModels";
import React from "react";

export default function PagePreview({ page }: { page: LocalCoursePage }) {
  return <MarkdownDisplay markdown={page.text} />;
}
