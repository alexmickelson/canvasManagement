"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import {
  useQuizQuery,
  useUpdateQuizMutation,
} from "@/hooks/localCourse/quizHooks";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import { useEffect, useState } from "react";
import QuizPreview from "./QuizPreview";
import {
  useAddQuizToCanvasMutation,
  useCanvasQuizzesQuery,
  useDeleteQuizFromCanvasMutation,
} from "@/hooks/canvas/canvasQuizHooks";
import { Spinner } from "@/components/Spinner";
import { baseCanvasUrl, canvasApi } from "@/services/canvas/canvasServiceUtils";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { getCourseUrl } from "@/services/urlUtils";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import Link from "next/link";

export default function EditQuiz({
  moduleName,
  quizName,
}: {
  quizName: string;
  moduleName: string;
}) {
  const { data: quiz } = useQuizQuery(moduleName, quizName);
  const updateQuizMutation = useUpdateQuizMutation();
  const [quizText, setQuizText] = useState(quizMarkdownUtils.toMarkdown(quiz));
  const [error, setError] = useState("");

  useEffect(() => {
    const delay = 500;
    const handler = setTimeout(() => {
      try {
        if (
          quizMarkdownUtils.toMarkdown(quiz) !==
          quizMarkdownUtils.toMarkdown(
            quizMarkdownUtils.parseMarkdown(quizText)
          )
        ) {
          const updatedQuiz = quizMarkdownUtils.parseMarkdown(quizText);
          updateQuizMutation.mutate({
            quiz: updatedQuiz,
            moduleName,
            quizName,
          });
        }
        setError("");
      } catch (e: any) {
        setError(e.toString());
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [moduleName, quiz, quizName, quizText, updateQuizMutation]);

  return (
    <div className="h-full flex flex-col">
      <div className="columns-2 min-h-0 flex-1">
        <div className="flex-1 h-full">
          <MonacoEditor value={quizText} onChange={setQuizText} />
        </div>
        <div className="h-full">
          <div className="text-red-300">{error && error}</div>
          <QuizPreview quiz={quiz} />
        </div>
      </div>
      <QuizButtons moduleName={moduleName} quizName={quizName} />
    </div>
  );
}

function QuizButtons({
  moduleName,
  quizName,
}: {
  quizName: string;
  moduleName: string;
}) {
  const { data: canvasQuizzes } = useCanvasQuizzesQuery();
  const { data: quiz } = useQuizQuery(moduleName, quizName);
  const { data: settings } = useLocalCourseSettingsQuery();
  const { courseName } = useCourseContext();
  const addToCanvas = useAddQuizToCanvasMutation();
  const deleteFromCanvas = useDeleteQuizFromCanvasMutation();

  const quizInCanvas = canvasQuizzes.find((c) => c.title === quizName);

  return (
    <div className="p-5 flex flex-row gap-3 justify-end">
        {(addToCanvas.isPending || deleteFromCanvas.isPending) && <Spinner />}
        {quizInCanvas && !quizInCanvas.published && (
          <div className="text-rose-300 my-auto">Not Published</div>
        )}
        {!quizInCanvas && (
          <button
            disabled={addToCanvas.isPending}
            onClick={() => addToCanvas.mutate(quiz)}
          >
            Add to canvas....
          </button>
        )}
        {quizInCanvas && (
          <a
            className="btn"
            target="_blank"
            href={`${baseCanvasUrl}/courses/${settings.canvasId}/quizzes/${quizInCanvas.id}`}
          >
            View in Canvas
          </a>
        )}
        {quizInCanvas && (
          <button
            className="btn-danger"
            disabled={deleteFromCanvas.isPending}
            onClick={() => deleteFromCanvas.mutate(quizInCanvas.id)}
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
