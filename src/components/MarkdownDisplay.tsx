import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { SuspenseAndErrorHandling } from "./SuspenseAndErrorHandling";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import { LocalCourseSettings } from "@/features/local/course/localCourseSettings";

export default function MarkdownDisplay({
  markdown,
  className = "",
  replaceText = [],
}: {
  markdown: string;
  className?: string;
  replaceText?: {
    source: string;
    destination: string;
  }[];
}) {
  const { data: settings } = useLocalCourseSettingsQuery();
  return (
    <SuspenseAndErrorHandling>
      <DangerousInnerMarkdown
        markdown={markdown}
        settings={settings}
        className={className}
        replaceText={replaceText}
      />
    </SuspenseAndErrorHandling>
  );
}

function DangerousInnerMarkdown({
  markdown,
  settings,
  className,
  replaceText,
}: {
  markdown: string;
  settings: LocalCourseSettings;
  className: string;
  replaceText: {
    source: string;
    destination: string;
  }[];
}) {
  return (
    <div
      className={"markdownPreview " + className}
      dangerouslySetInnerHTML={{
        __html: markdownToHTMLSafe({
          markdownString: markdown,
          settings,
          replaceText,
        }),
      }}
    ></div>
  );
}
