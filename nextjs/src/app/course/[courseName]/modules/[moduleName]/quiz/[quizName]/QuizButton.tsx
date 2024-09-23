import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { Spinner } from "@/components/Spinner";
import {
  useCanvasQuizzesQuery,
  useAddQuizToCanvasMutation,
  useDeleteQuizFromCanvasMutation,
} from "@/hooks/canvas/canvasQuizHooks";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { useQuizQuery } from "@/hooks/localCourse/quizHooks";
import { baseCanvasUrl } from "@/services/canvas/canvasServiceUtils";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";

export function QuizButtons({
  moduleName,
  quizName,
  toggleHelp,
}: {
  quizName: string;
  moduleName: string;
  toggleHelp: () => void;
}) {
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  const { data: canvasQuizzes } = useCanvasQuizzesQuery();
  const { data: quiz } = useQuizQuery(moduleName, quizName);
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
            onClick={() => addToCanvas.mutate({ quiz, moduleName })}
          >
            Add to canvas
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
