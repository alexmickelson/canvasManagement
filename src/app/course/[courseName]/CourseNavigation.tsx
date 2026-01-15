"use client";
import { BreadCrumbs } from "@/components/BreadCrumbs";
import { Spinner } from "@/components/Spinner";
import {
  useCanvasAssignmentsQuery,
  canvasAssignmentKeys,
} from "@/features/canvas/hooks/canvasAssignmentHooks";
import { canvasCourseKeys } from "@/features/canvas/hooks/canvasCourseHooks";
import {
  useCanvasModulesQuery,
  canvasCourseModuleKeys,
} from "@/features/canvas/hooks/canvasModuleHooks";
import {
  useCanvasPagesQuery,
  canvasPageKeys,
} from "@/features/canvas/hooks/canvasPageHooks";
import {
  useCanvasQuizzesQuery,
  canvasQuizKeys,
} from "@/features/canvas/hooks/canvasQuizHooks";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { useQueryClient } from "@tanstack/react-query";

export function CourseNavigation() {
  const { data: settings } = useLocalCourseSettingsQuery();

  const queryClient = useQueryClient();
  const canvasAssignmentsQuery = useCanvasAssignmentsQuery();
  const canvasAssignmentGroupsQuery = useCanvasAssignmentsQuery();
  const canvasModulesQuery = useCanvasModulesQuery();
  const canvasPagesQuery = useCanvasPagesQuery();
  const canvasQuizzesQuery = useCanvasQuizzesQuery();

  return (
    <div className="pb-1 flex flex-row gap-3">
      <BreadCrumbs />
  
      <a
        href={`https://snow.instructure.com/courses/${settings.canvasId}`}
        className="btn"
        target="_blank"
      >
        View in Canvas
      </a>
      {canvasAssignmentsQuery.isFetching ||
      canvasAssignmentGroupsQuery.isFetching ||
      canvasModulesQuery.isFetching ||
      canvasPagesQuery.isFetching ||
      canvasQuizzesQuery.isFetching ? (
        <div className="flex flex-row">
          <Spinner />
          <div className="ps-1">loading canvas data</div>
        </div>
      ) : (
        <button
          className="unstyled btn-outline"
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: canvasAssignmentKeys.assignments(settings.canvasId),
            });
            queryClient.invalidateQueries({
              queryKey: canvasCourseKeys.assignmentGroups(settings.canvasId),
            });
            queryClient.invalidateQueries({
              queryKey: canvasCourseModuleKeys.modules(settings.canvasId),
            });
            queryClient.invalidateQueries({
              queryKey: canvasPageKeys.pagesInCourse(settings.canvasId),
            });
            queryClient.invalidateQueries({
              queryKey: canvasQuizKeys.quizzes(settings.canvasId),
            });
          }}
        >
          Reload Canvas Data
        </button>
      )}
      {settings?.startDate && (
        <div className="my-auto text-slate-500">
          {getSemesterName(settings.startDate)}
        </div>
      )}
    </div>
  );
}
function getSemesterName(startDate: string) {
  const start = new Date(startDate);
  const year = start.getFullYear();
  const month = start.getMonth();

  if (month < 4) {
    return `Spring ${year}`;
  } else if (month < 7) {
    return `Summer ${year}`;
  } else {
    return `Fall ${year}`;
  }
}
