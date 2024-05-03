using CanvasModel.Quizzes;
using LocalModels;
using RestSharp;

namespace Management.Services.Canvas;

public interface ICanvasQuizService
{
  Task<IEnumerable<CanvasQuiz>> GetAll(ulong courseId);
  Task<ulong> Create(ulong canvasCourseId, LocalQuiz localQuiz, ulong? canvasAssignmentGroupId);
  Task CreateQuizQuestions(ulong canvasCourseId, ulong canvasQuizId, LocalQuiz localQuiz);

}
public class CanvasQuizService(
  IWebRequestor webRequestor,
  CanvasServiceUtils utils,
  ICanvasAssignmentService assignments,
  ILogger<CanvasQuizService> logger
): ICanvasQuizService
{
  private readonly IWebRequestor webRequestor = webRequestor;
  private readonly CanvasServiceUtils utils = utils;
  private readonly ICanvasAssignmentService assignments = assignments;
  private readonly ILogger<CanvasQuizService> logger = logger;

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
    using var activity = DiagnosticsConfig.Source.StartActivity("Creating all canvas quiz");
    activity?.SetCustomProperty("localQuiz", localQuiz);
    activity?.SetTag("canvas syncronization", true);
    Console.WriteLine($"Creating Quiz {localQuiz.Name}");

    var url = $"courses/{canvasCourseId}/quizzes";
    var body = new
    {
      quiz = new
      {
        title = localQuiz.Name,
        description = localQuiz.GetDescriptionHtml(),
        // assignment_group_id = "quiz", // TODO: support specific assignment groups
        // time_limit = localQuiz.TimeLimit,
        shuffle_answers = localQuiz.ShuffleAnswers,
        access_code = localQuiz.Password,
        show_correct_answers = localQuiz.showCorrectAnswers,
        // hide_results = localQuiz.HideResults,
        allowed_attempts = localQuiz.AllowedAttempts,
        one_question_at_a_time = false,
        cant_go_back = false,
        due_at = localQuiz.DueAt,
        lock_at = localQuiz.LockAt,
        assignment_group_id = canvasAssignmentGroupId,
      }
    };
    var request = new RestRequest(url);
    request.AddBody(body);
    var (canvasQuiz, response) = await webRequestor.PostAsync<CanvasQuiz>(request);
    if (canvasQuiz == null)
      throw new Exception("Created canvas quiz was null");
    activity?.SetCustomProperty("canvasQuizId", canvasQuiz.Id);

    await CreateQuizQuestions(canvasCourseId, canvasQuiz.Id, localQuiz);
    return canvasQuiz.Id;
  }

  public async Task CreateQuizQuestions(
    ulong canvasCourseId,
    ulong canvasQuizId,
    LocalQuiz localQuiz
  )
  {
    using var activity = DiagnosticsConfig.Source.StartActivity("Creating all quiz questions");
    activity?.SetCustomProperty("canvasQuizId", canvasQuizId);
    activity?.SetTag("canvas syncronization", true);


    var tasks = localQuiz.Questions.Select(
      async (q, i) => await createQuestionOnly(canvasCourseId, canvasQuizId, q, i)
    ).ToArray();
    var questionAndPositions = await Task.WhenAll(tasks);
    await hackFixQuestionOrdering(canvasCourseId, canvasQuizId, questionAndPositions);
    await hackFixRedundantAssignments(canvasCourseId);
  }

  private async Task hackFixRedundantAssignments(ulong canvasCourseId)
  {
    using var activity = DiagnosticsConfig.Source.StartActivity("hack fixing redundant quiz assignments that are auto-created");
    activity?.SetTag("canvas syncronization", true);

    var canvasAssignments = await assignments.GetAll(canvasCourseId);
    var assignmentsToDelete = canvasAssignments
      .Where(
        assignment =>
          !assignment.IsQuizAssignment
          && assignment.SubmissionTypes.Contains(AssignmentSubmissionType.ONLINE_QUIZ)
      )
      .ToArray();
    var tasks = assignmentsToDelete.Select(
      async (a) =>
      {
        await assignments.Delete(
          canvasCourseId,
          a.Id,
          a.Name
        );
      }
    ).ToArray();
    await Task.WhenAll(tasks);
  }

  private async Task hackFixQuestionOrdering(ulong canvasCourseId, ulong canvasQuizId, IEnumerable<(CanvasQuizQuestion question, int position)> questionAndPositions)
  {
    using var activity = DiagnosticsConfig.Source.StartActivity("hack fixing question ordering with reorder");
    activity?.SetCustomProperty("canvasQuizId", canvasQuizId);
    activity?.SetTag("canvas syncronization", true);

    var order = questionAndPositions.OrderBy(t => t.position).Select(tuple =>
    {
      return new
      {
        type = "question",
        id = tuple.question.Id.ToString(),
      };
    }).ToArray();

    var url = $"courses/{canvasCourseId}/quizzes/{canvasQuizId}/reorder";

    var request = new RestRequest(url);
    request.AddBody(new { order });
    var response = await webRequestor.PostAsync(request);

    if (!response.IsSuccessStatusCode)
      throw new NullReferenceException("error re-ordering questions, reorder response is not successfull");
  }

  private async Task<(CanvasQuizQuestion question, int position)> createQuestionOnly(
    ulong canvasCourseId,
    ulong canvasQuizId,
    LocalQuizQuestion q,
    int position
  )
  {
    using var activity = DiagnosticsConfig.Source.StartActivity("creating quiz question");
    activity?.SetTag("canvas syncronization", true);
    activity?.SetTag("localQuestion", q);
    activity?.SetCustomProperty("localQuestion", q);
    activity?.SetTag("success", false);

    var url = $"courses/{canvasCourseId}/quizzes/{canvasQuizId}/questions";
    var answers = getAnswers(q);
    var body = new
    {
      question = new
      {
        question_text = q.HtmlText,
        question_type = q.QuestionType + "_question",
        points_possible = q.Points,
        position,
        answers
      }
    };
    var request = new RestRequest(url);
    request.AddBody(body);

    var (newQuestion, response) = await webRequestor.PostAsync<CanvasQuizQuestion>(request);
    if (newQuestion == null)
      throw new NullReferenceException("error creating new question, created question is null");


    activity?.SetCustomProperty("canvasQuizId", newQuestion.Id);
    activity?.SetTag("success", true);

    return (newQuestion, position);
  }

  private static object[] getAnswers(LocalQuizQuestion q)
  {
    if (q.QuestionType == QuestionType.MATCHING)
      return q.Answers
        .Select(a => new
        {
          answer_match_left = a.Text,
          answer_match_right = a.MatchedText
        })
        .ToArray();

    return q.Answers
        .Select(a => new { answer_html = a.HtmlText, answer_weight = a.Correct ? 100 : 0 })
        .ToArray();
  }
}
