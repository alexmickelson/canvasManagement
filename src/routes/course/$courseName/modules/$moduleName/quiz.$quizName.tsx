import { createFileRoute } from "@tanstack/react-router";
import EditQuiz from "@/app/course/[courseName]/modules/[moduleName]/quiz/[quizName]/EditQuiz";

export const Route = createFileRoute(
  "/course/$courseName/modules/$moduleName/quiz/$quizName",
)({
  component: QuizPage,
});

function QuizPage() {
  const { moduleName, quizName } = Route.useParams();
  const decodedQuizName = decodeURIComponent(quizName);
  const decodedModuleName = decodeURIComponent(moduleName);
  return <EditQuiz quizName={decodedQuizName} moduleName={decodedModuleName} />;
}
