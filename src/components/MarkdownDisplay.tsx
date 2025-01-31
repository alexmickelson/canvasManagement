import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { SuspenseAndErrorHandling } from "./SuspenseAndErrorHandling";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import { LocalCourseSettings } from "@/models/local/localCourseSettings";

export default function MarkdownDisplay({
  markdown,
  className = "",
}: {
  markdown: string;
  className?: string;
}) {
  const [settings] = useLocalCourseSettingsQuery();
  return (
    <SuspenseAndErrorHandling>
      <DangerousInnerMarkdown
        markdown={markdown}
        settings={settings}
        className={className}
      />
    </SuspenseAndErrorHandling>
  );
}

function DangerousInnerMarkdown({
  markdown,
  settings,
  className,
}: {
  markdown: string;
  settings: LocalCourseSettings;
  className: string;
}) {
  return (
    <div
      className={"markdownPreview " + className}
      dangerouslySetInnerHTML={{
        __html: markdownToHTMLSafe(markdown, settings),
      }}
    ></div>
  );
}
