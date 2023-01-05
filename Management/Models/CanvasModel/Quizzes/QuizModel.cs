
using CanvasModel.Assignments;

namespace CanvasModel.Quizzes;
public class QuizModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("title")]
  public string Title { get; set; }

  [JsonPropertyName("html_url")]
  public string HtmlUrl { get; set; }

  [JsonPropertyName("mobile_url")]
  public string MobileUrl { get; set; }

  [JsonPropertyName("preview_url")]
  public string PreviewUrl { get; set; }

  [JsonPropertyName("description")]
  public string Description { get; set; }

  [JsonPropertyName("quiz_type")]
  public string QuizType { get; set; }

  [JsonPropertyName("assignment_group_id")]
  public ulong AssignmentGroupId { get; set; }

  [JsonPropertyName("time_limit")]
  public decimal? TimeLimit { get; set; }

  [JsonPropertyName("shuffle_answers")]
  public bool? ShuffleAnswers { get; set; }

  [JsonPropertyName("hide_results")]
  public string? HideResults { get; set; }

  [JsonPropertyName("show_correct_answers")]
  public bool? ShowCorrectAnswers { get; set; }

  [JsonPropertyName("show_correct_answers_last_attempt")]
  public bool? ShowCorrectAnswersLastAttempt { get; set; }

  [JsonPropertyName("show_correct_answers_at")]
  public DateTime? ShowCorrectAnswersAt { get; set; }

  [JsonPropertyName("hide_correct_answers_at")]
  public DateTime? HideCorrectAnswersAt { get; set; }

  [JsonPropertyName("one_time_results")]
  public bool? OneTimeResults { get; set; }

  [JsonPropertyName("scoring_policy")]
  public string? ScoringPolicy { get; set; }

  [JsonPropertyName("allowed_attempts")]
  public int AllowedAttempts { get; set; }

  [JsonPropertyName("one_question_at_a_time")]
  public bool? OneQuestionAtATime { get; set; }

  [JsonPropertyName("question_count")]
  public uint? QuestionCount { get; set; }

  [JsonPropertyName("points_possible")]
  public decimal? PointsPossible { get; set; }

  [JsonPropertyName("cant_go_back")]
  public bool? CantGoBack { get; set; }

  [JsonPropertyName("access_code")]
  public string? AccessCode { get; set; }

  [JsonPropertyName("ip_filter")]
  public string? IpFilter { get; set; }

  [JsonPropertyName("due_at")]
  public DateTime? DueAt { get; set; }

  [JsonPropertyName("lock_at")]
  public DateTime? LockAt { get; set; }

  [JsonPropertyName("unlock_at")]
  public DateTime? UnlockAt { get; set; }

  [JsonPropertyName("published")]
  public bool? Published { get; set; }

  [JsonPropertyName("unpublishable")]
  public bool? Unpublishable { get; set; }

  [JsonPropertyName("locked_for_user")]
  public bool? LockedForUser { get; set; }

  [JsonPropertyName("lock_info")]
  public LockInfoModel? LockInfo { get; set; }

  [JsonPropertyName("lock_explanation")]
  public string? LockExplanation { get; set; }

  [JsonPropertyName("speedgrader_url")]
  public string? SpeedGraderUrl { get; set; }

  [JsonPropertyName("quiz_extensions_url")]
  public string QuizExtensionsUrl { get; set; }

  [JsonPropertyName("permissions")]
  public QuizPermissionsModel Permissions { get; set; }

  [JsonPropertyName("all_dates")]
  public object AllDates { get; set; } // exact type unspecified by canvas & no example value given 

  [JsonPropertyName("version_number")]
  public uint? VersionNumber { get; set; }

  [JsonPropertyName("question_types")]
  public IEnumerable<string> QuestionTypes { get; set; }

  [JsonPropertyName("anonymous_submissions")]
  public bool? AnonymousSubmissions { get; set; }
}
