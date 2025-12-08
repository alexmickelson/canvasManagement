import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { SuspenseAndErrorHandling } from "./SuspenseAndErrorHandling";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import { LocalCourseSettings } from "@/features/local/course/localCourseSettings";

export default function MarkdownDisplay({
  markdown,
  className = "",
  replaceText = [],
  convertImages,
}: {
  markdown: string;
  className?: string;
  replaceText?: {
    source: string;
    destination: string;
  }[];
  convertImages?: boolean;
}) {
  const { data: settings } = useLocalCourseSettingsQuery();
  return (
    <SuspenseAndErrorHandling>
      <DangerousInnerMarkdown
        markdown={markdown}
        settings={settings}
        className={className}
        replaceText={replaceText}
        convertImages={convertImages}
      />
    </SuspenseAndErrorHandling>
  );
}

function DangerousInnerMarkdown({
  markdown,
  settings,
  className,
  replaceText,
  convertImages,
}: {
  markdown: string;
  settings: LocalCourseSettings;
  className: string;
  replaceText: {
    source: string;
    destination: string;
  }[];
  convertImages?: boolean;
}) {
  return (
    <div
      className={"markdownPreview " + className}
      dangerouslySetInnerHTML={{
        __html: markdownToHTMLSafe({
          markdownString: markdown,
          convertImages,
          settings,
          replaceText,
        }),
      }}
    ></div>
  );
}
