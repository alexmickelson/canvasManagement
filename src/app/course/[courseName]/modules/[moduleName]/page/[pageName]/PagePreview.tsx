import MarkdownDisplay from "@/components/MarkdownDisplay";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import React from "react";

export default function PagePreview({ page }: { page: LocalCoursePage }) {
  return (
    <MarkdownDisplay markdown={page.text} />
  );
}
