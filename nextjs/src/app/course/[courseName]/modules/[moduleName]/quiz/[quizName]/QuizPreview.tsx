import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import {
  LocalQuizQuestion,
  QuestionType,
} from "@/models/local/quiz/localQuizQuestion";
import { quizQuestionMarkdownUtils } from "@/models/local/quiz/utils/quizQuestionMarkdownUtils";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";

export default function QuizPreview({ quiz }: { quiz: LocalQuiz }) {
  return (
    <div  style={{ overflow: "scroll", height: "100%" }}>
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
      {quiz.questions.map((question, i) => (
        <QuizQuestionPreview
          key={quizQuestionMarkdownUtils.toMarkdown(question)}
          question={question}
        />
      ))}
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
  console.log(question);
  return (
    <div className="rounded">
      <div>Points: {question.points}</div>
      <div>Type: {question.questionType}</div>
      <div
        dangerouslySetInnerHTML={{ __html: markdownToHTMLSafe(question.text) }}
      ></div>
      {question.questionType === QuestionType.MATCHING && (
        <div>
          {question.answers.map((answer) => (
            <div
              key={JSON.stringify(answer)}
              className="mx-3 mb-1 bg-dark px-2 rounded border flex row"
            >
              <div className="col text-right my-auto p-1">{answer.text} - </div>
              <div className="col my-auto">{answer.matchedText}</div>
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
              className="mx-3 mb-1 bg-dark px-2 rounded flex flex-row border"
            >
              {answer.correct ? (
                <svg
                  style={{ width: "1em" }}
                  className="me-1 my-auto"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 12.6111L8.92308 17.5L20 6.5"
                    stroke="green"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <div className="mr-1 my-auto" style={{ width: "1em" }}>
                  {question.questionType === QuestionType.MULTIPLE_ANSWERS && (
                    <span>[ ]</span>
                  )}
                </div>
              )}
              <div
                className="markdownQuizAnswerPreview p-1"
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
