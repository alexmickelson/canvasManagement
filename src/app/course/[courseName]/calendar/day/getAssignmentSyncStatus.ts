import { CanvasAssignment } from "@/features/canvas/models/assignments/canvasAssignment";
import { CanvasPage } from "@/features/canvas/models/pages/canvasPageModel";
import { CanvasQuiz } from "@/features/canvas/models/quizzes/canvasQuizModel";
import { LocalAssignment } from "@/features/local/assignments/models/localAssignment";
import { LocalCoursePage } from "@/features/local/pages/localCoursePageModels";
import { LocalCourseSettings } from "@/features/local/course/localCourseSettings";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";
import {
  dateToMarkdownString,
  getDateFromStringOrThrow,
} from "@/features/local/utils/timeUtils";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
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

  const assignmentGroup = settings.assignmentGroups.find(
    (g) => g.name === assignment.localAssignmentGroupName,
  );
  if (
    assignmentGroup?.canvasId !== undefined &&
    canvasAssignment.assignment_group_id !== assignmentGroup.canvasId
  ) {
    return { status: "incomplete", message: "assignment group is different" };
  }

  try {
    const htmlIsSame = htmlIsCloseEnough(
      markdownToHTMLSafe({
        markdownString: assignment.description,
        settings,
        replaceText: [
          {
            source: "insert_github_classroom_url",
            destination: assignment.githubClassroomAssignmentShareLink || "",
          },
        ],
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
