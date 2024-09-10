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
import { useCanvasPagesQuery } from "@/hooks/canvas/canvasPageHooks";

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
  const { data: canvasPages } = useCanvasPagesQuery(settings.canvasId ?? 0);
  console.log("canvas pages", canvasPages);
  const pageInCanvas = canvasPages?.find((p) => p.title === pageName);

  useEffect(() => {
    const delay = 500;
    const handler = setTimeout(() => {
      const updatedPage = localPageMarkdownUtils.parseMarkdown(pageText);
      if (
        localPageMarkdownUtils.toMarkdown(page) !==
        localPageMarkdownUtils.toMarkdown(updatedPage)
      ) {
        console.log("updating assignment");
        try {
          updatePage.mutate({
            page: updatedPage,
            moduleName,
            pageName,
          });
        } catch (e: any) {
          setError(e.toString());
        }
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
      <div className="p-5 flex flex-row">
        {pageInCanvas && (
          <a
            target="_blank"
            href={`https://snow.instructure.com/courses/${settings.canvasId}/pages/${pageInCanvas.page_id}`}
          >
            View Page In Canvas
          </a>
        )}
        <button>Add to canvas</button>
      </div>
    </div>
  );
}
