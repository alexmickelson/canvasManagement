import { LocalQuiz } from "@/models/local/quiz/localQuiz";

export default function QuizPreview({quiz}: {quiz: LocalQuiz}) {
  return (
    <div>

      <div>{quiz.description}</div>
    </div>
  )
}
