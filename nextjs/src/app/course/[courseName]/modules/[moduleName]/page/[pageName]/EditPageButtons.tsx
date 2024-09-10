import { Spinner } from "@/components/Spinner";
import {
  useCanvasPagesQuery,
  useCreateCanvasPageMutation,
  useDeleteCanvasPageMutation,
  useUpdateCanvasPageMutation,
} from "@/hooks/canvas/canvasPageHooks";
import { usePageQuery } from "@/hooks/localCourse/pageHooks";
import React from "react";

export default function EditPageButtons({
  moduleName,
  pageName,
  courseCanvasId,
}: {
  pageName: string;
  moduleName: string;
  courseCanvasId: number;
}) {
  const { data: page } = usePageQuery(moduleName, pageName);
  const { data: canvasPages } = useCanvasPagesQuery(courseCanvasId);
  const createPageInCanvas = useCreateCanvasPageMutation(courseCanvasId);
  const updatePageInCanvas = useUpdateCanvasPageMutation(courseCanvasId);
  const deletePageInCanvas = useDeleteCanvasPageMutation(courseCanvasId);

  const pageInCanvas = canvasPages?.find((p) => p.title === pageName);

  const requestIsPending =
    createPageInCanvas.isPending ||
    updatePageInCanvas.isPending ||
    deletePageInCanvas.isPending;

  return (
    <div className="p-5 flex flex-row gap-x-3">
      {pageInCanvas && (
        <a
          target="_blank"
          href={`https://snow.instructure.com/courses/${courseCanvasId}/pages/${pageInCanvas.page_id}`}
        >
          View Page In Canvas
        </a>
      )}
      {!pageInCanvas && (
        <button
          onClick={() => createPageInCanvas.mutate(page)}
          disabled={requestIsPending}
        >
          Add to Canvas
        </button>
      )}
      {pageInCanvas && (
        <button
          onClick={() =>
            updatePageInCanvas.mutate({
              page,
              canvasPageId: pageInCanvas.page_id,
            })
          }
          disabled={requestIsPending}
        >
          Update in Canvas
        </button>
      )}
      {pageInCanvas && (
        <button
          onClick={() => deletePageInCanvas.mutate(pageInCanvas.page_id)}
          disabled={requestIsPending}
        >
          Delete from Canvas
        </button>
      )}
      {requestIsPending && <Spinner />}
    </div>
  );
}
