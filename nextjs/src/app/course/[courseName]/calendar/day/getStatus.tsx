"use client";
import { CanvasAssignment } from "@/models/canvas/assignments/canvasAssignment";
import { CanvasPage } from "@/models/canvas/pages/canvasPageModel";
import { CanvasQuiz } from "@/models/canvas/quizzes/canvasQuizModel";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import {
  dateToMarkdownString,
  getDateFromStringOrThrow,
} from "@/models/local/utils/timeUtils";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import { htmlIsCloseEnough } from "@/services/utils/htmlIsCloseEnough";
import { ReactNode } from "react";

export const getStatus = ({
  item,
  canvasItem,
  type,
}: {
  item: LocalQuiz | LocalAssignment | LocalCoursePage;
  canvasItem?: CanvasQuiz | CanvasAssignment | CanvasPage;
  type: "assignment" | "page" | "quiz";
}): {
  status: "localOnly" | "incomplete" | "published";
  message: ReactNode;
} => {
  if (!canvasItem) return { status: "localOnly", message: "not in canvas" };

  if (!canvasItem.published)
    return { status: "incomplete", message: "not published in canvas" };

  if (type === "page") {
    const canvasPage = canvasItem as CanvasPage;
    const page = item as LocalCoursePage;

    if (!canvasPage.published)
      return { status: "incomplete", message: "canvas page not published" };
    return { status: "published", message: "" };
  } else if (type === "quiz") {
    const quiz = item as LocalQuiz;
    const canvasQuiz = canvasItem as CanvasQuiz;

    if (!canvasQuiz.due_at)
      return { status: "incomplete", message: "due date not in canvas" };

    if (quiz.lockAt && !canvasQuiz.lock_at)
      return { status: "incomplete", message: "lock date not in canvas" };

    const localDueDate = dateToMarkdownString(
      getDateFromStringOrThrow(quiz.dueAt, "comparing due dates for day")
    );

    const canvasDueDate = dateToMarkdownString(
      getDateFromStringOrThrow(
        canvasQuiz.due_at,
        "comparing canvas due date for day"
      )
    );
    if (localDueDate !== canvasDueDate) {
      return {
        status: "incomplete",
        message: (
          <div>
            due date different
            <div>{localDueDate}</div>
            <div>{canvasDueDate}</div>
          </div>
        ),
      };
    }
  } else if (type === "assignment") {
    const assignment = item as LocalAssignment;
    const canvasAssignment = canvasItem as CanvasAssignment;

    if (!canvasAssignment.due_at)
      return { status: "incomplete", message: "due date not in canvas" };

    if (assignment.lockAt && !canvasAssignment.lock_at)
      return { status: "incomplete", message: "lock date not in canvas" };

    const localDueDate = dateToMarkdownString(
      getDateFromStringOrThrow(assignment.dueAt, "comparing due dates for day")
    );
    const canvasDueDate = dateToMarkdownString(
      getDateFromStringOrThrow(
        canvasAssignment.due_at,
        "comparing canvas due date for day"
      )
    );

    if (localDueDate !== canvasDueDate)
      return {
        status: "incomplete",
        message: (
          <div>
            due date different
            <div>{localDueDate}</div>
            <div>{canvasDueDate}</div>
          </div>
        ),
      };

    const htmlIsSame = htmlIsCloseEnough(
      markdownToHTMLSafe(assignment.description),
      canvasAssignment.description
    );
    if (!htmlIsSame)
      return {
        status: "incomplete",
        message: "Canvas description is different",
      };
  }

  return { status: "published", message: "" };
};
