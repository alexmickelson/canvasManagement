import CheckIcon from "@/components/icons/CheckIcon";
import MarkdownDisplay from "@/components/MarkdownDisplay";
import { useQuizQuery } from "@/hooks/localCourse/quizHooks";
import {
  LocalQuizQuestion,
  QuestionType,
} from "@/models/local/quiz/localQuizQuestion";
import { escapeMatchingText } from "@/services/utils/questionHtmlUtils";

export default function QuizPreview({
  moduleName,
  quizName,
}: {
  quizName: string;
  moduleName: string;
}) {
  const { data: quiz } = useQuizQuery(moduleName, quizName);
  return (
    <div style={{ overflow: "scroll", height: "100%" }}>
      <div className="columns-2">
        <div className="text-end">Name</div>
        <div>{quiz.name}</div>
      </div>
      <div className="columns-2">
        <div className="text-end">Points</div>
        <div>
          {quiz.questions.reduce((sum, question) => sum + question.points, 0)}
        </div>
      </div>
      <div className="columns-2">
        <div className="text-end">Due Date</div>
        <div>{quiz.dueAt}</div>
      </div>
      <div className="columns-2">
        <div className="text-end">Lock At</div>
        <div>{quiz.lockAt}</div>
      </div>
      <div className="columns-2">
        <div className="text-end">Shuffle Answers</div>
        <div>{quiz.shuffleAnswers}</div>
      </div>
      <div className="columns-2">
        <div className="text-end">Allowed Attempts</div>
        <div>{quiz.allowedAttempts}</div>
      </div>
      <div className="columns-2">
        <div className="text-end">One Question at a Time</div>
        <div>{quiz.oneQuestionAtATime}</div>
      </div>
      <div className="columns-2">
        <div className="text-end">Assignment Group Name</div>
        <div>{quiz.localAssignmentGroupName}</div>
      </div>
      <MarkdownDisplay markdown={quiz.description} className="p-3" />
      <div className="p-3 rounded-md bg-slate-950 m-5 flex flex-col gap-3">
        {quiz.questions.map((question, i) => (
          <QuizQuestionPreview key={i} question={question} />
        ))}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

function QuizQuestionPreview({ question }: { question: LocalQuizQuestion }) {
  return (
    <div className="rounded bg-slate-900 px-2">
      <div className="flex flex-row justify-between text-slate-400">
        <div>{question.questionType}</div>
        <div className="">
          {question.points} {question.points === 1 ? " Point" : " Points"}
        </div>
      </div>
      <MarkdownDisplay markdown={question.text} className="ms-4 mb-2" />
      {question.questionType === QuestionType.MATCHING && (
        <div>
          {question.answers.map((answer) => (
            <div
              key={JSON.stringify(answer)}
              className="mx-3 mb-1 bg-dark rounded border border-slate-600 flex flex-row"
            >
              <div className="text-right my-auto flex-1 pe-3">
                {escapeMatchingText(answer.text)}
              </div>
              <div className=" flex-1">{answer.matchedText}</div>
            </div>
          ))}
          {question.matchDistractors.map((distractor) => (
            <div
              key={distractor}
              className="mx-3 mb-1 bg-dark px-2 rounded border flex row"
            >
              DISTRACTOR: {distractor}
            </div>
          ))}
        </div>
      )}
      {question.questionType !== QuestionType.MATCHING && (
        <div>
          {question.answers.map((answer) => (
            <div
              key={JSON.stringify(answer)}
              className="mx-3 mb-1 pt-1 border-t border-slate-700 flex flex-row"
            >
              <div className="w-8 flex flex-col justify-center">
                {answer.correct ? (
                  <CheckIcon />
                ) : question.questionType === QuestionType.MULTIPLE_ANSWERS ? (
                  <span className="mx-auto">{"[ ]"}</span>
                ) : (
                  <div></div>
                )}
              </div>
              <MarkdownDisplay
                markdown={answer.text}
                className="markdownQuizAnswerPreview"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
