import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { Spinner } from "@/components/Spinner";
import {
  useCanvasPagesQuery,
  useCreateCanvasPageMutation,
  useDeleteCanvasPageMutation,
  useUpdateCanvasPageMutation,
} from "@/hooks/canvas/canvasPageHooks";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { usePageQuery } from "@/hooks/localCourse/pageHooks";
import { baseCanvasUrl } from "@/services/canvas/canvasServiceUtils";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";
import React from "react";

export default function EditPageButtons({
  moduleName,
  pageName,
}: {
  pageName: string;
  moduleName: string;
}) {
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  const { data: page } = usePageQuery(moduleName, pageName);
  const { data: canvasPages } = useCanvasPagesQuery();
  const createPageInCanvas = useCreateCanvasPageMutation();
  const updatePageInCanvas = useUpdateCanvasPageMutation();
  const deletePageInCanvas = useDeleteCanvasPageMutation();

  const pageInCanvas = canvasPages?.find((p) => p.title === pageName);

  const requestIsPending =
    createPageInCanvas.isPending ||
    updatePageInCanvas.isPending ||
    deletePageInCanvas.isPending;

  return (
    <div className="p-5 flex justify-end flex-row gap-x-3">
      {requestIsPending && <Spinner />}
      {!pageInCanvas && (
        <button
          onClick={() => createPageInCanvas.mutate({ page, moduleName })}
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
        <a
          className="btn"
          target="_blank"
          href={`${baseCanvasUrl}/courses/${settings.canvasId}/pages/${pageInCanvas.url}`}
        >
          View in Canvas
        </a>
      )}
      {pageInCanvas && (
        <button
          className="btn-danger"
          onClick={() => deletePageInCanvas.mutate(pageInCanvas.page_id)}
          disabled={requestIsPending}
        >
          Delete from Canvas
        </button>
      )}
      <Link className="btn" href={getCourseUrl(courseName)} shallow={true}>
        Go Back
      </Link>
    </div>
  );
}
