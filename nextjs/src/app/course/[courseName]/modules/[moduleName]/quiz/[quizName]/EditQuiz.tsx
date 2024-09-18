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

const helpString = `QUESTION REFERENCE
---
Points: 2
this is a question?
*a) correct
b) not correct
---
points: 1
question goes here
[*] correct
[ ] not correct
[] not correct
---
the points default to 1?
*a) true
b) false
---
Markdown is supported

- like
- this
- list

[*] true
[ ] false
---
This is a one point essay question
essay
---
points: 4
this is a short answer question
short_answer
---
points: 4
the underscore is optional
short answer
---
this is a matching question
^ left answer - right dropdown
^ other thing -  another option`;

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
  const [showHelp, setShowHelp] = useState(false);

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
    <div className="h-full flex flex-col align-middle px-1">
      <div className={"min-h-0 flex flex-row w-full"}>
        {showHelp && (
          <pre className=" max-w-96">
            <code>{helpString}</code>
          </pre>
        )}
        <div className="flex-1 h-full">
          <MonacoEditor value={quizText} onChange={setQuizText} />
        </div>
        <div className="flex-1 h-full">
          <div className="text-red-300">{error && error}</div>
          <QuizPreview quiz={quiz} />
        </div>
      </div>
      <QuizButtons
        moduleName={moduleName}
        quizName={quizName}
        toggleHelp={() => setShowHelp((h) => !h)}
      />
    </div>
  );
}

function QuizButtons({
  moduleName,
  quizName,
  toggleHelp,
}: {
  quizName: string;
  moduleName: string;
  toggleHelp: () => void;
}) {
  const { data: canvasQuizzes } = useCanvasQuizzesQuery();
  const { data: quiz } = useQuizQuery(moduleName, quizName);
  const { data: settings } = useLocalCourseSettingsQuery();
  const { courseName } = useCourseContext();
  const addToCanvas = useAddQuizToCanvasMutation();
  const deleteFromCanvas = useDeleteQuizFromCanvasMutation();

  const quizInCanvas = canvasQuizzes.find((c) => c.title === quizName);

  return (
    <div className="p-5 flex flex-row justify-between">
      <div>
        <button onClick={toggleHelp}>Toggle Help</button>
      </div>
      <div className="flex flex-row gap-3 justify-end">
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
    </div>
  );
}
