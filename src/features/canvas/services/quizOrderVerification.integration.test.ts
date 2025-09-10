import { describe, it, expect, vi, beforeEach } from "vitest";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";
import { QuestionType } from "@/features/local/quizzes/models/localQuizQuestion";
import { DayOfWeek } from "@/features/local/course/localCourseSettings";
import { AssignmentSubmissionType } from "@/features/local/assignments/models/assignmentSubmissionType";

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

describe("Quiz Order Verification Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("demonstrates the question order verification workflow", async () => {
    // This test demonstrates that the verification step is properly integrated
    // into the quiz creation workflow
    
    const testQuiz: LocalQuiz = {
      name: "Test Quiz - Order Verification",
      description: "Testing question order verification",
      dueAt: "2023-12-01T23:59:00Z",
      shuffleAnswers: false,
      showCorrectAnswers: true,
      oneQuestionAtATime: false,
      allowedAttempts: 1,
      questions: [
        {
          text: "First Question",
          questionType: QuestionType.SHORT_ANSWER,
          points: 5,
          answers: [],
          matchDistractors: [],
        },
        {
          text: "Second Question", 
          questionType: QuestionType.ESSAY,
          points: 10,
          answers: [],
          matchDistractors: [],
        },
      ],
    };

    // Import the service after mocks are set up
    const { canvasQuizService } = await import("./canvasQuizService");
    const { axiosClient } = await import("@/services/axiosUtils");
    const { paginatedRequest } = await import("./canvasServiceUtils");

    // Mock successful quiz creation
    vi.mocked(axiosClient.post).mockResolvedValueOnce({
      data: { id: 123, title: "Test Quiz - Order Verification" },
    });

    // Mock question creation responses
    vi.mocked(axiosClient.post)
      .mockResolvedValueOnce({ data: { id: 1, position: 1 } })
      .mockResolvedValueOnce({ data: { id: 2, position: 2 } });

    // Mock reordering call
    vi.mocked(axiosClient.post).mockResolvedValueOnce({ data: {} });

    // Mock assignment cleanup (empty assignments)
    vi.mocked(paginatedRequest).mockResolvedValueOnce([]);

    // Mock the verification call - questions in correct order
    vi.mocked(paginatedRequest).mockResolvedValueOnce([
      {
        id: 1,
        quiz_id: 123,
        position: 1,
        question_name: "Question 1",
        question_type: "short_answer_question", 
        question_text: "<p>First Question</p>",
        correct_comments: "",
        incorrect_comments: "",
        neutral_comments: "",
      },
      {
        id: 2,
        quiz_id: 123,
        position: 2,
        question_name: "Question 2",
        question_type: "essay_question",
        question_text: "<p>Second Question</p>",
        correct_comments: "",
        incorrect_comments: "",
        neutral_comments: "",
      },
    ]);

    // Create the quiz and trigger verification
    const result = await canvasQuizService.create(12345, testQuiz, {
      name: "Test Course",
      canvasId: 12345,
      assignmentGroups: [],
      daysOfWeek: [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday],
      startDate: "2023-08-15",
      endDate: "2023-12-15",
      defaultDueTime: { hour: 23, minute: 59 },
      defaultAssignmentSubmissionTypes: [AssignmentSubmissionType.ONLINE_TEXT_ENTRY],
      defaultFileUploadTypes: [],
      holidays: [],
      assets: []
    });

    // Verify the quiz was created
    expect(result).toBe(123);

    // Verify that the question verification API call was made
    expect(vi.mocked(paginatedRequest)).toHaveBeenCalledWith({
      url: "https://test.instructure.com/api/v1/courses/12345/quizzes/123/questions",
    });

    // The verification would have run and logged success/failure
    // In a real scenario, this would catch order mismatches
  });

  it("demonstrates successful verification workflow", async () => {
    const { canvasQuizService } = await import("./canvasQuizService");
    const { paginatedRequest } = await import("./canvasServiceUtils");

    // Mock questions returned from Canvas in correct order
    vi.mocked(paginatedRequest).mockResolvedValueOnce([
      {
        id: 1,
        quiz_id: 1,
        position: 1,
        question_name: "Question 1",
        question_type: "short_answer_question",
        question_text: "First question",
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
        question_text: "Second question",
        correct_comments: "",
        incorrect_comments: "",
        neutral_comments: "",
      },
    ]);

    const result = await canvasQuizService.getQuizQuestions(1, 1);

    // Verify questions are returned in correct order
    expect(result).toHaveLength(2);
    expect(result[0].position).toBe(1);
    expect(result[1].position).toBe(2);
    expect(result[0].question_text).toBe("First question");
    expect(result[1].question_text).toBe("Second question");
  });
});