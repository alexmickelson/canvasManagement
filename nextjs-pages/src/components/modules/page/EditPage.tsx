"use client";

import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { usePageQuery } from "@/hooks/localCourse/pageHooks";
import { localPageMarkdownUtils } from "@/models/local/page/localCoursePage";
import { useState } from "react";
import PagePreview from "./PagePreview";

export default function EditPage({
  moduleName,
  pageName,
}: {
  pageName: string;
  moduleName: string;
}) {
  const { data: page } = usePageQuery(moduleName, pageName);
  const [pageText, setPageText] = useState(
    localPageMarkdownUtils.toMarkdown(page)
  );
  const [error, setError] = useState("");

  return (
    <div className="h-full flex flex-col">
      <div className="columns-2 min-h-0 flex-1">
        <div className="flex-1 h-full">
          <MonacoEditor value={pageText} onChange={setPageText} />
        </div>
        <div className="h-full">
          <div className="text-red-300">{error && error}</div>
          <PagePreview page={page} />
        </div>
      </div>
      <div className="p-5">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add to canvas....
        </button>
      </div>
    </div>
  );
}
