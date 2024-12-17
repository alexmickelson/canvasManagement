import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import React from "react";

export default function PagePreview({ page }: { page: LocalCoursePage }) {
  const [settings] = useLocalCourseSettingsQuery();
  return (
    <div
      className="markdownPreview"
      dangerouslySetInnerHTML={{
        __html: markdownToHTMLSafe(page.text, settings),
      }}
    ></div>
  );
}
