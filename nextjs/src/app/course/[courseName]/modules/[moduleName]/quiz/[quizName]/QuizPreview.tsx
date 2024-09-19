import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import {
  LocalQuizQuestion,
  QuestionType,
} from "@/models/local/quiz/localQuizQuestion";
import { quizQuestionMarkdownUtils } from "@/models/local/quiz/utils/quizQuestionMarkdownUtils";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";

export default function QuizPreview({ quiz }: { quiz: LocalQuiz }) {
  return (
    <div style={{ overflow: "scroll", height: "100%" }}>
      <div className="columns-2">
        <div className="text-end">Name</div>
        <div>{quiz.name}</div>
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
      <div className="p-3" style={{ whiteSpace: "pre-wrap" }}>
        {quiz.description}
      </div>
      <hr />
      <div className="p-3 rounded-md bg-slate-950 m-5 flex flex-col gap-3">
        {quiz.questions.map((question, i) => (
          <QuizQuestionPreview
            key={quizQuestionMarkdownUtils.toMarkdown(question)}
            question={question}
          />
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

      <div
        className="ms-4 mb-2"
        dangerouslySetInnerHTML={{ __html: markdownToHTMLSafe(question.text) }}
      ></div>
      {question.questionType === QuestionType.MATCHING && (
        <div>
          {question.answers.map((answer) => (
            <div
              key={JSON.stringify(answer)}
              className="mx-3 mb-1 bg-dark rounded border border-slate-600 flex flex-row"
            >
              <div className="text-right my-auto">{answer.text} - </div>
              <div className="">{answer.matchedText}</div>
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
              className="mx-3 mb-1 bg-dark rounded border-slate-700 flex flex-row border"
            >
              <div className="w-8 flex flex-col justify-center">
                {answer.correct ? (
                  <svg className="h-6" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 12.6111L8.92308 17.5L20 6.5"
                      stroke="green"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : question.questionType === QuestionType.MULTIPLE_ANSWERS ? (
                  <span className="mx-auto">{"[ ]"}</span>
                ) : (
                  <div></div>
                )}
              </div>
              <div
                className="markdownQuizAnswerPreview"
                dangerouslySetInnerHTML={{
                  __html: markdownToHTMLSafe(answer.text),
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
