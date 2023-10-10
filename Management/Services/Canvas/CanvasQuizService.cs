using System.Runtime.InteropServices;
using System.Security.Cryptography.X509Certificates;
using CanvasModel.Quizzes;
using LocalModels;
using RestSharp;

namespace Management.Services.Canvas;

public class CanvasQuizService
{
  private readonly IWebRequestor webRequestor;
  private readonly CanvasServiceUtils utils;
  private readonly CanvasAssignmentService assignments;

  public CanvasQuizService(
    IWebRequestor webRequestor,
    CanvasServiceUtils utils,
    CanvasAssignmentService assignments
  )
  {
    this.webRequestor = webRequestor;
    this.utils = utils;
    this.assignments = assignments;
  }

  public async Task<IEnumerable<CanvasQuiz>> GetAll(ulong courseId)
  {
    var url = $"courses/{courseId}/quizzes";
    var request = new RestRequest(url);
    var quizResponse = await utils.PaginatedRequest<IEnumerable<CanvasQuiz>>(request);
    return quizResponse.SelectMany(
      quizzes =>
        quizzes.Select(
          a => a with { DueAt = a.DueAt?.ToLocalTime(), LockAt = a.LockAt?.ToLocalTime() }
        )
    );
  }

  public async Task<ulong> Create(
    ulong canvasCourseId,
    LocalQuiz localQuiz,
    ulong? canvasAssignmentGroupId
  )
  {
    Console.WriteLine($"Creating Quiz {localQuiz.Name}");

    var url = $"courses/{canvasCourseId}/quizzes";
    var body = new
    {
      quiz = new
      {
        title = localQuiz.Name,
        description = localQuiz.Description,
        // assignment_group_id = "quiz", // TODO: support specific assignment groups
        // time_limit = localQuiz.TimeLimit,
        shuffle_answers = localQuiz.ShuffleAnswers,
        // hide_results = localQuiz.HideResults,
        allowed_attempts = localQuiz.AllowedAttempts,
        one_question_at_a_time = false,
        cant_go_back = false,
        due_at = localQuiz.DueAt,
        lock_at = localQuiz.LockAtDueDate ? localQuiz.DueAt : localQuiz.LockAt,
        assignment_group_id = canvasAssignmentGroupId,
      }
    };
    var request = new RestRequest(url);
    request.AddBody(body);
    var (canvasQuiz, response) = await webRequestor.PostAsync<CanvasQuiz>(request);
    if (canvasQuiz == null)
      throw new Exception("Created canvas quiz was null");

    await CreateQuizQuestions(canvasCourseId, canvasQuiz.Id, localQuiz);
    return canvasQuiz.Id;
  }

  public async Task CreateQuizQuestions(
    ulong canvasCourseId,
    ulong canvasQuizId,
    LocalQuiz localQuiz
  )
  {
    var tasks = localQuiz.Questions.Select(createQuestion(canvasCourseId, canvasQuizId)).ToArray();
    await Task.WhenAll(tasks);
    await hackFixRedundantAssignments(canvasCourseId);
  }

  private async Task hackFixRedundantAssignments(ulong canvasCourseId)
  {
    var canvasAssignments = await assignments.GetAll(canvasCourseId);

    var assignmentsToDelete = canvasAssignments
      .Where(
        assignment =>
          !assignment.IsQuizAssignment
          && assignment.SubmissionTypes.Contains(SubmissionType.ONLINE_QUIZ)
      )
      .ToArray();
    var tasks = assignmentsToDelete.Select(
      async (a) =>
      {
        await assignments.Delete(
          canvasCourseId,
          new LocalAssignment { Name = a.Name, CanvasId = a.Id }
        );
      }
    );
    await Task.WhenAll(tasks);
  }

  private Func<LocalQuizQuestion, Task> createQuestion(
    ulong canvasCourseId,
    ulong canvasQuizId
  )
  {
    return async (question) => await createQuestionOnly(canvasCourseId, canvasQuizId, question);
  }

  private async Task<CanvasQuizQuestion> createQuestionOnly(
    ulong canvasCourseId,
    ulong canvasQuizId,
    LocalQuizQuestion q
  )
  {
    var url = $"courses/{canvasCourseId}/quizzes/{canvasQuizId}/questions";
    var answers = q.Answers
      .Select(a => new { answer_html = a.HtmlText, answer_weight = a.Correct ? 100 : 0 })
      .ToArray();
    var body = new
    {
      question = new
      {
        question_text = q.HtmlText,
        question_type = q.QuestionType + "_question",
        points_possible = q.Points,
        // position
        answers
      }
    };
    var request = new RestRequest(url);
    request.AddBody(body);
    var (newQuestion, response) = await webRequestor.PostAsync<CanvasQuizQuestion>(request);
    if (newQuestion == null)
      throw new NullReferenceException("error creating new question, created question is null");

    return newQuestion;
  }
}
