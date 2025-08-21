import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { SuspenseAndErrorHandling } from "./SuspenseAndErrorHandling";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import { LocalCourseSettings } from "@/features/local/course/localCourseSettings";

export default function MarkdownDisplay({
  markdown,
  className = "",
}: {
  markdown: string;
  className?: string;
}) {
  const { data: settings } = useLocalCourseSettingsQuery();
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
        __html: markdownToHTMLSafe({ markdownString: markdown, settings }),
      }}
    ></div>
  );
}
