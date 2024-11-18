"use client";
import { Spinner } from "@/components/Spinner";
import {
  canvasAssignmentKeys,
  useCanvasAssignmentsQuery,
} from "@/hooks/canvas/canvasAssignmentHooks";
import { canvasCourseKeys } from "@/hooks/canvas/canvasCourseHooks";
import {
  canvasCourseModuleKeys,
  useCanvasModulesQuery,
} from "@/hooks/canvas/canvasModuleHooks";
import {
  canvasPageKeys,
  useCanvasPagesQuery,
} from "@/hooks/canvas/canvasPageHooks";
import {
  canvasQuizKeys,
  useCanvasQuizzesQuery,
} from "@/hooks/canvas/canvasQuizHooks";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export function CourseNavigation() {
  const [settings] = useLocalCourseSettingsQuery();

  const queryClient = useQueryClient();
  const canvasAssignmentsQuery = useCanvasAssignmentsQuery();
  const canvasAssignmentGroupsQuery = useCanvasAssignmentsQuery();
  const canvasModulesQuery = useCanvasModulesQuery();
  const canvasPagesQuery = useCanvasPagesQuery();
  const canvasQuizzesQuery = useCanvasQuizzesQuery();

  return (
    <div className="pb-1 ps-5 flex flex-row gap-3">
      <Link href={"/"} className="btn">
        Back to Course List
      </Link>
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
    </div>
  );
}
