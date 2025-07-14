import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import Modal, { useModal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import {
  useCanvasQuizzesQuery,
  useAddQuizToCanvasMutation,
  useDeleteQuizFromCanvasMutation,
} from "@/hooks/canvas/canvasQuizHooks";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import {
  useDeleteQuizMutation,
  useQuizQuery,
} from "@/hooks/localCourse/quizHooks";
import { baseCanvasUrl } from "@/services/canvas/canvasServiceUtils";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function QuizButtons({
  moduleName,
  quizName,
  toggleHelp,
}: {
  quizName: string;
  moduleName: string;
  toggleHelp: () => void;
}) {
  const router = useRouter();
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  const { data: canvasQuizzes } = useCanvasQuizzesQuery();

  const { data: quiz } = useQuizQuery(moduleName, quizName);
  const addToCanvas = useAddQuizToCanvasMutation();
  const deleteFromCanvas = useDeleteQuizFromCanvasMutation();
  const deleteLocal = useDeleteQuizMutation();
  const modal = useModal();

  const quizInCanvas = canvasQuizzes?.find((c) => c.title === quizName);

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
        {!quizInCanvas && (
          <Modal
            modalControl={modal}
            buttonText="Delete Localy"
            buttonClass="btn-danger"
            modalWidth="w-1/5"
          >
            {({ closeModal }) => (
              <div>
                <div className="text-center">
                  Are you sure you want to delete this quiz locally?
                </div>
                <br />
                <div className="flex justify-around gap-3">
                  <button
                    onClick={async () => {
                      await deleteLocal.mutateAsync({
                        moduleName,
                        quizName,
                        courseName,
                      });
                      router.push(getCourseUrl(courseName));
                    }}
                    className="btn-danger"
                  >
                    Yes
                  </button>
                  <button onClick={closeModal}>No</button>
                </div>
              </div>
            )}
          </Modal>
        )}

        <Link className="btn" href={getCourseUrl(courseName)} shallow={true}>
          Go Back
        </Link>
      </div>
    </div>
  );
}
