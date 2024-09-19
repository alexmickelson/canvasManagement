"use client";

import { MonacoEditor } from "@/components/editor/MonacoEditor";
import {
  usePageQuery,
  useUpdatePageMutation,
} from "@/hooks/localCourse/pageHooks";
import { localPageMarkdownUtils } from "@/models/local/page/localCoursePage";
import { useEffect, useState } from "react";
import PagePreview from "./PagePreview";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import {
  useCanvasPagesQuery,
  useCreateCanvasPageMutation,
} from "@/hooks/canvas/canvasPageHooks";
import EditPageButtons from "./EditPageButtons";
import ClientOnly from "@/components/ClientOnly";

export default function EditPage({
  moduleName,
  pageName,
}: {
  pageName: string;
  moduleName: string;
}) {
  const { data: page } = usePageQuery(moduleName, pageName);
  const updatePage = useUpdatePageMutation();
  const [pageText, setPageText] = useState(
    localPageMarkdownUtils.toMarkdown(page)
  );
  const [error, setError] = useState("");

  const { data: settings } = useLocalCourseSettingsQuery();

  useEffect(() => {
    const delay = 500;
    const handler = setTimeout(() => {
      try {
        const updatedPage = localPageMarkdownUtils.parseMarkdown(pageText);
        if (
          localPageMarkdownUtils.toMarkdown(page) !==
          localPageMarkdownUtils.toMarkdown(updatedPage)
        ) {
          console.log("updating page");
          updatePage.mutate({
            page: updatedPage,
            moduleName,
            pageName,
          });
        }
        setError("");
      } catch (e: any) {
        setError(e.toString());
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [moduleName, page, pageName, pageText, updatePage]);

  return (
    <div className="h-full flex flex-col">
      <div className="columns-2 min-h-0 flex-1">
        <div className="flex-1 h-full">
          <MonacoEditor value={pageText} onChange={setPageText} />
        </div>
        <div className="h-full">
          <div className="text-red-300">{error && error}</div>
          <div className="h-full overflow-y-auto">
            <br />
            <PagePreview page={page} />
          </div>
        </div>
      </div>
      {settings.canvasId && (
        <ClientOnly>
          <EditPageButtons
            pageName={pageName}
            moduleName={moduleName}
            courseCanvasId={settings.canvasId}
          />
        </ClientOnly>
      )}
    </div>
  );
}
