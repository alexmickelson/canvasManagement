using CanvasModel.Quizzes;
using LocalModels;
using RestSharp;

namespace Management.Services.Canvas;

public class CanvasQuizService
{
  private readonly IWebRequestor webRequestor;
  private readonly CanvasServiceUtils utils;

  public CanvasQuizService(IWebRequestor webRequestor, CanvasServiceUtils utils)
  {
    this.webRequestor = webRequestor;
    this.utils = utils;
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

  public async Task<LocalQuiz> Create(ulong canvasCourseId, LocalQuiz localQuiz)
  {
    Console.WriteLine($"Creating Quiz {localQuiz.Name}");

    var url = $"courses/{canvasCourseId}/quizzes";
    var body = new
    {
      quiz = new
      {
        title = localQuiz.Name,
        description = localQuiz.Description,
        // assignment_group_id = "quiz", TODO: support specific assignment groups
        // time_limit = localQuiz.TimeLimit,
        shuffle_answers = localQuiz.ShuffleAnswers,
        // hide_results = localQuiz.HideResults,
        allowed_attempts = localQuiz.AllowedAttempts,
        one_question_at_a_time = true,
        cant_go_back = false,
        due_at = localQuiz.DueAt,
        lock_at = localQuiz.LockAt,
      }
    };
    var request = new RestRequest(url);
    request.AddBody(body);
    var (canvasQuiz, response) = await webRequestor.PostAsync<CanvasQuiz>(request);
    if (canvasQuiz == null)
      throw new Exception("Created canvas quiz was null");


    var updatedQuiz = localQuiz with { CanvasId = canvasQuiz.Id };
    var quizWithQuestions = await CreateQuizQuestions(canvasCourseId, updatedQuiz);


    return quizWithQuestions;
  }

  public async Task<LocalQuiz> CreateQuizQuestions(ulong canvasCourseId, LocalQuiz localQuiz)
  {
    var tasks = localQuiz.Questions
      .Select(
        async (question) =>
        {
          var newQuestion = await createQuestionOnly(canvasCourseId, localQuiz, question);

          var answersWithIds = question.Answers
            .Select(answer =>
            {
              var canvasAnswer = newQuestion.Answers?.FirstOrDefault(ca => ca.Html == answer.Text);
              if (canvasAnswer == null)
              {
                Console.WriteLine(JsonSerializer.Serialize(newQuestion));
                Console.WriteLine(JsonSerializer.Serialize(question));
                throw new NullReferenceException(
                  "Could not find canvas answer to update local answer id"
                );
              }
              return answer with { CanvasId = canvasAnswer.Id };
            })
            .ToArray();
          return question with { CanvasId = newQuestion.Id, Answers = answersWithIds };
        }
      )
      .ToArray();
    var updatedQuestions = await Task.WhenAll(tasks);
    return localQuiz with { Questions = updatedQuestions };
  }

  private async Task<CanvasQuizQuestion> createQuestionOnly(
    ulong canvasCourseId,
    LocalQuiz localQuiz,
    LocalQuizQuestion q
  )
  {
    var url = $"courses/{canvasCourseId}/quizzes/{localQuiz.CanvasId}/questions";
    var answers = q.Answers
      .Select(a => new { answer_html = a.Text, answer_weight = a.Correct ? 100 : 0 })
      .ToArray();
    var body = new
    {
      question = new
      {
        question_text = q.Text,
        question_type = q.QuestionType+"_question",
        possible_points = q.Points,
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
