import { CanvasQuiz } from "@/models/canvas/quizzes/canvasQuizModel";
import { axiosClient } from "../axiosUtils";
import { canvasApi } from "./canvasServiceUtils";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
import { markdownToHTMLSafe } from "../htmlMarkdownUtils";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import { canvasAssignmentService } from "./canvasAssignmentService";
import {
  LocalQuizQuestion,
  QuestionType,
} from "@/models/local/quiz/localQuizQuestion";
import { CanvasQuizQuestion } from "@/models/canvas/quizzes/canvasQuizQuestionModel";

const getAnswers = (question: LocalQuizQuestion) => {
  if (question.questionType === QuestionType.MATCHING)
    return question.answers.map((a) => ({
      answer_match_left: a.text,
      answer_match_right: a.matchedText,
    }));

  return question.answers.map((answer) => ({
    answer_html: markdownToHTMLSafe(answer.text),
    answer_weight: answer.correct ? 100 : 0,
  }));
};

const createQuestionOnly = async (
  canvasCourseId: number,
  canvasQuizId: number,
  question: LocalQuizQuestion,
  position: number
) => {
  console.log("Creating individual question"); //, question);

  const url = `${canvasApi}/courses/${canvasCourseId}/quizzes/${canvasQuizId}/questions`;
  const body = {
    question: {
      question_text: markdownToHTMLSafe(question.text),
      question_type: `${question.questionType}_question`,
      points_possible: question.points,
      position,
      answers: getAnswers(question),
    },
  };

  const response = await axiosClient.post<CanvasQuizQuestion>(url, body);
  const newQuestion = response.data;

  if (!newQuestion) throw new Error("Created question is null");

  return { question: newQuestion, position };
};

const hackFixQuestionOrdering = async (
  canvasCourseId: number,
  canvasQuizId: number,
  questionAndPositions: Array<{ question: any; position: number }>
) => {
  console.log("Fixing question order");

  const order = questionAndPositions.map((qp) => ({
    type: "question",
    id: qp.question.id.toString(),
  }));

  const url = `${canvasApi}/courses/${canvasCourseId}/quizzes/${canvasQuizId}/reorder`;
  await axiosClient.post(url, { order });
};

const hackFixRedundantAssignments = async (canvasCourseId: number) => {
  console.log("hack fixing redundant quiz assignments that are auto-created");
  const assignments = await canvasAssignmentService.getAll(canvasCourseId);
  const assignmentsToDelete = assignments.filter(
    (assignment) =>
      !assignment.is_quiz_assignment &&
      assignment.submission_types.includes("online_quiz")
  );

  await Promise.all(
    assignmentsToDelete.map(
      async (assignment) =>
        await canvasAssignmentService.delete(
          canvasCourseId,
          assignment.id,
          assignment.name
        )
    )
  );

  console.log(`Deleted ${assignmentsToDelete.length} redundant assignments`);
};

const createQuizQuestions = async (
  canvasCourseId: number,
  canvasQuizId: number,
  localQuiz: LocalQuiz
) => {
  console.log("Creating quiz questions"); //, localQuiz);

  const tasks = localQuiz.questions.map(
    async (question, index) =>
      await createQuestionOnly(canvasCourseId, canvasQuizId, question, index)
  );
  const questionAndPositions = await Promise.all(tasks);
  await hackFixQuestionOrdering(
    canvasCourseId,
    canvasQuizId,
    questionAndPositions
  );
  await hackFixRedundantAssignments(canvasCourseId);
};

export const canvasQuizService = {
  async getAll(canvasCourseId: number): Promise<CanvasQuiz[]> {
    const url = `${canvasApi}/courses/${canvasCourseId}/quizzes`;
    const response = await axiosClient.get<CanvasQuiz[]>(url);
    return response.data.map((quiz) => ({
      ...quiz,
      due_at: quiz.due_at ? new Date(quiz.due_at).toLocaleString() : undefined,
      lock_at: quiz.lock_at
        ? new Date(quiz.lock_at).toLocaleString()
        : undefined,
    }));
  },

  async create(
    canvasCourseId: number,
    localQuiz: LocalQuiz,
    canvasAssignmentGroupId?: number
  ) {
    console.log("Creating quiz", localQuiz);

    const url = `${canvasApi}/courses/${canvasCourseId}/quizzes`;
    const body = {
      quiz: {
        title: localQuiz.name,
        description: markdownToHTMLSafe(localQuiz.description),
        shuffle_answers: localQuiz.shuffleAnswers,
        access_code: localQuiz.password,
        show_correct_answers: localQuiz.showCorrectAnswers,
        allowed_attempts: localQuiz.allowedAttempts,
        one_question_at_a_time: localQuiz.oneQuestionAtATime,
        cant_go_back: false,
        due_at: localQuiz.dueAt
          ? getDateFromStringOrThrow(
              localQuiz.dueAt,
              "creating quiz"
            ).toISOString()
          : undefined,
        lock_at: localQuiz.lockAt
          ? getDateFromStringOrThrow(
              localQuiz.lockAt,
              "creating quiz"
            ).toISOString()
          : undefined,
        assignment_group_id: canvasAssignmentGroupId,
      },
    };

    const { data: canvasQuiz } = await axiosClient.post<CanvasQuiz>(url, body);
    await createQuizQuestions(canvasCourseId, canvasQuiz.id, localQuiz);
    return canvasQuiz.id;
  },
  async delete(canvasCourseId: number, canvasQuizId: number) {
    const url = `${canvasApi}/courses/${canvasCourseId}/quizzes/${canvasQuizId}`;
    await axiosClient.delete(url);
  },
};
