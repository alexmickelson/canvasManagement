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
import { Link } from "@tanstack/react-router";
import {
  CloseMenuOnClick,
  MobileActionsMenu,
} from "@/components/MobileActionsMenu";
import { getCourseSettingsUrl } from "@/services/urlUtils";
import { useCourseContext } from "./context/courseContext";

export function CourseNavigation({
  onShowModules,
}: {
  onShowModules?: () => void;
}) {
  const { data: settings } = useLocalCourseSettingsQuery();
  const { courseName } = useCourseContext();

  const queryClient = useQueryClient();
  const canvasAssignmentsQuery = useCanvasAssignmentsQuery();
  const canvasAssignmentGroupsQuery = useCanvasAssignmentsQuery();
  const canvasModulesQuery = useCanvasModulesQuery();
  const canvasPagesQuery = useCanvasPagesQuery();
  const canvasQuizzesQuery = useCanvasQuizzesQuery();

  const isFetching =
    canvasAssignmentsQuery.isFetching ||
    canvasAssignmentGroupsQuery.isFetching ||
    canvasModulesQuery.isFetching ||
    canvasPagesQuery.isFetching ||
    canvasQuizzesQuery.isFetching;

  const reloadCanvasData = () => {
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
  };

  const viewInCanvasLink = (
    <a
      href={`https://snow.instructure.com/courses/${settings.canvasId}`}
      className="btn"
      target="_blank"
    >
      View in Canvas
    </a>
  );

  const reloadControl = isFetching ? (
    <div className="flex flex-row">
      <Spinner />
      <div className="ps-1">loading canvas data</div>
    </div>
  ) : (
    <button className="unstyled btn-outline" onClick={reloadCanvasData}>
      Reload Canvas Data
    </button>
  );

  return (
    <div className="pb-1 flex flex-row items-center gap-x-3">
      <div className="min-w-0 max-md:flex-auto">
        <BreadCrumbs />
      </div>
      <div className="max-md:hidden flex flex-row items-center gap-3">
        {viewInCanvasLink}
        {reloadControl}
        {settings?.startDate && (
          <div className="my-auto text-slate-500">
            {getSemesterName(settings.startDate)}
          </div>
        )}
      </div>
      <MobileActionsMenu>
        {onShowModules && (
          <CloseMenuOnClick>
            <button onClick={onShowModules}>Modules</button>
          </CloseMenuOnClick>
        )}
        <CloseMenuOnClick>{viewInCanvasLink}</CloseMenuOnClick>
        {reloadControl}
        <CloseMenuOnClick>
          <Link className="btn" to={getCourseSettingsUrl(courseName)}>
            Course Settings
          </Link>
        </CloseMenuOnClick>
        {settings?.startDate && (
          <div className="px-3 pt-2 text-sm text-slate-500">
            {getSemesterName(settings.startDate)}
          </div>
        )}
      </MobileActionsMenu>
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
