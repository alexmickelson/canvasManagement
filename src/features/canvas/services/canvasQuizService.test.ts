import { describe, it, expect, vi, beforeEach } from "vitest";
import { canvasQuizService, getAnswersForCanvas } from "./canvasQuizService";
import { CanvasQuizQuestion } from "@/features/canvas/models/quizzes/canvasQuizQuestionModel";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";
import { QuestionType } from "@/features/local/quizzes/models/localQuizQuestion";

// Mock the dependencies
vi.mock("@/services/axiosUtils", () => ({
  axiosClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("./canvasServiceUtils", () => ({
  canvasApi: "https://test.instructure.com/api/v1",
  paginatedRequest: vi.fn(),
}));

vi.mock("./canvasWebRequestUtils", () => ({
  rateLimitAwarePost: vi.fn(),
  rateLimitAwareDelete: vi.fn(),
}));

vi.mock("./canvasAssignmentService", () => ({
  canvasAssignmentService: {
    getAll: vi.fn(() => Promise.resolve([])),
    delete: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock("@/services/htmlMarkdownUtils", () => ({
  markdownToHTMLSafe: vi.fn(({ markdownString }) => `<p>${markdownString}</p>`),
}));

vi.mock("@/features/local/utils/timeUtils", () => ({
  getDateFromStringOrThrow: vi.fn((dateString) => new Date(dateString)),
}));

vi.mock("@/services/utils/questionHtmlUtils", () => ({
  escapeMatchingText: vi.fn((text) => text),
}));

describe("canvasQuizService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getQuizQuestions", () => {
    it("should fetch and sort quiz questions by position", async () => {
      const mockQuestions: CanvasQuizQuestion[] = [
        {
          id: 3,
          quiz_id: 1,
          position: 3,
          question_name: "Question 3",
          question_type: "multiple_choice_question",
          question_text: "What is 2+2?",
          correct_comments: "",
          incorrect_comments: "",
          neutral_comments: "",
        },
        {
          id: 1,
          quiz_id: 1,
          position: 1,
          question_name: "Question 1",
          question_type: "multiple_choice_question",
          question_text: "What is your name?",
          correct_comments: "",
          incorrect_comments: "",
          neutral_comments: "",
        },
        {
          id: 2,
          quiz_id: 1,
          position: 2,
          question_name: "Question 2",
          question_type: "essay_question",
          question_text: "Describe yourself",
          correct_comments: "",
          incorrect_comments: "",
          neutral_comments: "",
        },
      ];

      const { paginatedRequest } = await import("./canvasServiceUtils");
      vi.mocked(paginatedRequest).mockResolvedValue(mockQuestions);

      const result = await canvasQuizService.getQuizQuestions(1, 1);

      expect(result).toHaveLength(3);
      expect(result[0].position).toBe(1);
      expect(result[1].position).toBe(2);
      expect(result[2].position).toBe(3);
      expect(result[0].question_text).toBe("What is your name?");
      expect(result[1].question_text).toBe("Describe yourself");
      expect(result[2].question_text).toBe("What is 2+2?");
    });

    it("should handle questions without position", async () => {
      const mockQuestions: CanvasQuizQuestion[] = [
        {
          id: 1,
          quiz_id: 1,
          question_name: "Question 1",
          question_type: "multiple_choice_question",
          question_text: "What is your name?",
          correct_comments: "",
          incorrect_comments: "",
          neutral_comments: "",
        },
        {
          id: 2,
          quiz_id: 1,
          question_name: "Question 2",
          question_type: "essay_question",
          question_text: "Describe yourself",
          correct_comments: "",
          incorrect_comments: "",
          neutral_comments: "",
        },
      ];

      const { paginatedRequest } = await import("./canvasServiceUtils");
      vi.mocked(paginatedRequest).mockResolvedValue(mockQuestions);

      const result = await canvasQuizService.getQuizQuestions(1, 1);

      expect(result).toHaveLength(2);
      // Should maintain original order when no position is specified
    });
  });

  describe("Question order verification (integration test concept)", () => {
    it("should detect correct question order", async () => {
      // This is a conceptual test showing what the verification should validate
      const _localQuiz: LocalQuiz = {
        name: "Test Quiz",
        description: "A test quiz",
        dueAt: "2023-12-01T23:59:00Z",
        shuffleAnswers: false,
        showCorrectAnswers: true,
        oneQuestionAtATime: false,
        allowedAttempts: 1,
        questions: [
          {
            text: "What is your name?",
            questionType: QuestionType.SHORT_ANSWER,
            points: 5,
            answers: [],
            matchDistractors: [],
          },
          {
            text: "Describe yourself",
            questionType: QuestionType.ESSAY,
            points: 10,
            answers: [],
            matchDistractors: [],
          },
          {
            text: "What is 2+2?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            points: 5,
            answers: [
              { text: "3", correct: false },
              { text: "4", correct: true },
              { text: "5", correct: false },
            ],
            matchDistractors: [],
          },
        ],
      };

      const canvasQuestions: CanvasQuizQuestion[] = [
        {
          id: 1,
          quiz_id: 1,
          position: 1,
          question_name: "Question 1",
          question_type: "short_answer_question",
          question_text: "<p>What is your name?</p>",
          correct_comments: "",
          incorrect_comments: "",
          neutral_comments: "",
        },
        {
          id: 2,
          quiz_id: 1,
          position: 2,
          question_name: "Question 2",
          question_type: "essay_question",
          question_text: "<p>Describe yourself</p>",
          correct_comments: "",
          incorrect_comments: "",
          neutral_comments: "",
        },
        {
          id: 3,
          quiz_id: 1,
          position: 3,
          question_name: "Question 3",
          question_type: "multiple_choice_question",
          question_text: "<p>What is 2+2?</p>",
          correct_comments: "",
          incorrect_comments: "",
          neutral_comments: "",
        },
      ];

      // Mock the getQuizQuestions to return our test data
      const { paginatedRequest } = await import("./canvasServiceUtils");
      vi.mocked(paginatedRequest).mockResolvedValue(canvasQuestions);

      const result = await canvasQuizService.getQuizQuestions(1, 1);

      // Verify the questions are in the expected order
      expect(result).toHaveLength(3);
      expect(result[0].question_text).toContain("What is your name?");
      expect(result[1].question_text).toContain("Describe yourself");
      expect(result[2].question_text).toContain("What is 2+2?");

      // Verify positions are sequential
      expect(result[0].position).toBe(1);
      expect(result[1].position).toBe(2);
      expect(result[2].position).toBe(3);
    });
  });

  describe("getAnswersForCanvas", () => {
    it("includes matching distractors", () => {
      const answers = getAnswersForCanvas(
        {
          text: "Match the following terms",
          questionType: QuestionType.MATCHING,
          points: 2,
          answers: [
            {
              text: "statement",
              matchedText: "a single command to be executed",
              correct: true,
            },
          ],
          matchDistractors: ["reserved word"],
        },
        {} as never
      );

      expect(answers).toEqual([
        {
          answer_match_left: "statement",
          answer_match_right: "a single command to be executed",
          matching_answer_incorrect_matches: "reserved word",
        },
      ]);
    });
  });

  describe("create", () => {
    it("sends matching distractors on the question payload", async () => {
      const { rateLimitAwarePost } = await import("./canvasWebRequestUtils");

      vi.spyOn(canvasQuizService, "getQuizQuestions").mockResolvedValue([]);
      vi.mocked(rateLimitAwarePost).mockImplementation(async () => ({
        data: { id: 1 },
      }) as never);

      await canvasQuizService.create(
        42,
        {
          name: "Matching Quiz",
          description: "",
          dueAt: "2023-12-01T23:59:00Z",
          shuffleAnswers: false,
          showCorrectAnswers: true,
          oneQuestionAtATime: false,
          allowedAttempts: 1,
          questions: [
            {
              text: "Match the following terms",
              questionType: QuestionType.MATCHING,
              points: 2,
              answers: [
                {
                  text: "statement",
                  matchedText: "a single command to be executed",
                  correct: true,
                },
              ],
              matchDistractors: ["reserved word"],
            },
          ],
        } as LocalQuiz,
        {} as never
      );

      const questionRequest = vi
        .mocked(rateLimitAwarePost)
        .mock.calls.find(([url]) => url.endsWith("/questions"));

      const questionPayload = questionRequest?.[1] as
        | {
            question?: {
              matching_answer_incorrect_matches?: string;
            };
          }
        | undefined;

      expect(questionPayload?.question?.matching_answer_incorrect_matches).toBe(
        "reserved word"
      );
    });
  });
});
