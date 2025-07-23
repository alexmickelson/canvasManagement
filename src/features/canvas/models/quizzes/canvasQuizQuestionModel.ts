import { CanvasQuizAnswer } from "./canvasQuizAnswerModel";

export interface CanvasQuizQuestion {
  id: number;
  quiz_id: number;
  position?: number;
  question_name: string;
  question_type: string;
  question_text: string;
  correct_comments: string;
  incorrect_comments: string;
  neutral_comments: string;
  answers?: CanvasQuizAnswer[];
}