import { CanvasAssignment } from "@/features/canvas/models/assignments/canvasAssignment";
import { CanvasRubricCriteria } from "@/features/canvas/models/assignments/canvasRubricCriteria";
import { CanvasPage } from "@/features/canvas/models/pages/canvasPageModel";
import { CanvasQuiz } from "@/features/canvas/models/quizzes/canvasQuizModel";
import { LocalAssignment } from "@/features/local/assignments/models/localAssignment";
import { RubricItem } from "@/features/local/assignments/models/rubricItem";
import { LocalCoursePage } from "@/features/local/pages/localCoursePageModels";
import { LocalCourseSettings } from "@/features/local/course/localCourseSettings";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";
import {
  dateToMarkdownString,
  getDateFromStringOrThrow,
} from "@/features/local/utils/timeUtils";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import { getClassroomReplaceText } from "@/features/local/classroom50/classroom50UrlUtils";
import { htmlIsCloseEnough } from "@/services/utils/htmlIsCloseEnough";

export type ItemSyncStatus = {
  status: "localOnly" | "incomplete" | "published";
  message: string;
};

function checkPublished(published: boolean | undefined): ItemSyncStatus | null {
  if (!published)
    return { status: "incomplete", message: "not published in canvas" };
  return null;
}

function checkDueDateAndLock(
  localDueAt: string,
  localLockAt: string | undefined,
  canvasDueAt: string | undefined,
  canvasLockAt: string | undefined,
): ItemSyncStatus | null {
  if (!canvasDueAt)
    return { status: "incomplete", message: "due date not in canvas" };

  if (localLockAt && !canvasLockAt)
    return { status: "incomplete", message: "lock date not in canvas" };

  const localDueDate = dateToMarkdownString(
    getDateFromStringOrThrow(localDueAt, "comparing due dates for day"),
  );
  const canvasDueDate = dateToMarkdownString(
    getDateFromStringOrThrow(canvasDueAt, "comparing canvas due date for day"),
  );
  if (localDueDate !== canvasDueDate) {
    return {
      status: "incomplete",
      message: `due date different: ${localDueDate} vs ${canvasDueDate}`,
    };
  }

  return null;
}

function checkRubric(
  localRubric: RubricItem[],
  canvasRubric: CanvasRubricCriteria[] | undefined,
): ItemSyncStatus | null {
  const canvasCount = canvasRubric?.length ?? 0;
  if (localRubric.length !== canvasCount) {
    return { status: "incomplete", message: "rubric count is different" };
  }

  for (let i = 0; i < localRubric.length; i++) {
    const local = localRubric[i];
    const canvas = canvasRubric![i];

    if (local.label !== canvas.description || local.points !== canvas.points) {
      return { status: "incomplete", message: "rubric description or points is different" };
    }

    if (local.ratings && local.ratings.length > 0) {
      const canvasRatings = canvas.ratings ?? [];
      if (local.ratings.length !== canvasRatings.length) {
        return { status: "incomplete", message: "rubric ratings count is different" };
      }
      for (let j = 0; j < local.ratings.length; j++) {
        const lr = local.ratings[j];
        const cr = canvasRatings[j];
        if (lr.description !== cr.description || lr.points !== cr.points) {
          return { status: "incomplete", message: "rubric rating description or points is different" };
        }
      }
    }
  }

  return null;
}

function checkPage(_page: LocalCoursePage, _canvasPage: CanvasPage): null {
  return null;
}

function checkQuiz(
  quiz: LocalQuiz,
  canvasQuiz: CanvasQuiz,
): ItemSyncStatus | null {
  return checkDueDateAndLock(
    quiz.dueAt,
    quiz.lockAt,
    canvasQuiz.due_at,
    canvasQuiz.lock_at,
  );
}

function checkAssignment(
  assignment: LocalAssignment,
  canvasAssignment: CanvasAssignment,
  settings: LocalCourseSettings,
): ItemSyncStatus | null {
  const dueLockStatus = checkDueDateAndLock(
    assignment.dueAt,
    assignment.lockAt,
    canvasAssignment.due_at,
    canvasAssignment.lock_at,
  );
  if (dueLockStatus) return dueLockStatus;

  if (assignment.localAssignmentGroupName) {
    const assignmentGroup = settings.assignmentGroups.find(
      (g) => g.name === assignment.localAssignmentGroupName,
    );
    if (!assignmentGroup?.canvasId) {
      return {
        status: "incomplete",
        message: "assignment group not found in canvas",
      };
    }
    if (canvasAssignment.assignment_group_id !== assignmentGroup.canvasId) {
      return { status: "incomplete", message: "assignment group is different" };
    }
  }

  const rubricStatus = checkRubric(
    assignment.rubric,
    canvasAssignment.rubric,
  );
  if (rubricStatus) return rubricStatus;

  try {
    const htmlIsSame = htmlIsCloseEnough(
      markdownToHTMLSafe({
        markdownString: assignment.description,
        settings,
        replaceText: getClassroomReplaceText({ assignment, settings }),
      }),
      canvasAssignment.description,
    );
    if (!htmlIsSame)
      return {
        status: "incomplete",
        message: "Canvas description is different",
      };
  } catch (exception) {
    return {
      status: "incomplete",
      message: "Error parsing markdown " + exception,
    };
  }

  return null;
}

export function getSyncStatus({
  item,
  canvasItem,
  type,
  settings,
}: {
  item: LocalQuiz | LocalAssignment | LocalCoursePage;
  canvasItem: CanvasQuiz | CanvasAssignment | CanvasPage | undefined;
  type: "assignment" | "page" | "quiz";
  settings: LocalCourseSettings;
}): ItemSyncStatus {
  if (!canvasItem) return { status: "localOnly", message: "not in canvas" };

  const publishedStatus = checkPublished(canvasItem.published);
  if (publishedStatus) return publishedStatus;

  let typeStatus: ItemSyncStatus | null;
  if (type === "page") {
    typeStatus = checkPage(item as LocalCoursePage, canvasItem as CanvasPage);
  } else if (type === "quiz") {
    typeStatus = checkQuiz(item as LocalQuiz, canvasItem as CanvasQuiz);
  } else {
    typeStatus = checkAssignment(
      item as LocalAssignment,
      canvasItem as CanvasAssignment,
      settings,
    );
  }

  return typeStatus ?? { status: "published", message: "" };
}
