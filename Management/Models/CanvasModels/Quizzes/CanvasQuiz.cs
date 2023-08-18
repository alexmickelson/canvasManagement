using CanvasModel.Assignments;

namespace CanvasModel.Quizzes;

public record CanvasQuiz
{
  [JsonPropertyName("id")]
  public ulong Id { get; init; }

  [JsonPropertyName("title")]
  public required string Title { get; init; }

  [JsonPropertyName("html_url")]
  public required string HtmlUrl { get; init; }

  [JsonPropertyName("mobile_url")]
  public required string MobileUrl { get; init; }

  [JsonPropertyName("preview_url")]
  public string? PreviewUrl { get; init; }

  [JsonPropertyName("description")]
  public required string Description { get; init; }

  [JsonPropertyName("quiz_type")]
  public required string QuizType { get; init; }

  [JsonPropertyName("assignment_group_id")]
  public ulong? AssignmentGroupId { get; init; }

  [JsonPropertyName("time_limit")]
  public decimal? TimeLimit { get; init; }

  [JsonPropertyName("shuffle_answers")]
  public bool? ShuffleAnswers { get; init; }

  [JsonPropertyName("hide_results")]
  public string? HideResults { get; init; }

  [JsonPropertyName("show_correct_answers")]
  public bool? ShowCorrectAnswers { get; init; }

  [JsonPropertyName("show_correct_answers_last_attempt")]
  public bool? ShowCorrectAnswersLastAttempt { get; init; }

  [JsonPropertyName("show_correct_answers_at")]
  public DateTime? ShowCorrectAnswersAt { get; init; }

  [JsonPropertyName("hide_correct_answers_at")]
  public DateTime? HideCorrectAnswersAt { get; init; }

  [JsonPropertyName("one_time_results")]
  public bool? OneTimeResults { get; init; }

  [JsonPropertyName("scoring_policy")]
  public string? ScoringPolicy { get; init; }

  [JsonPropertyName("allowed_attempts")]
  public int AllowedAttempts { get; init; }

  [JsonPropertyName("one_question_at_a_time")]
  public bool? OneQuestionAtATime { get; init; }

  [JsonPropertyName("question_count")]
  public uint? QuestionCount { get; init; }

  [JsonPropertyName("points_possible")]
  public decimal? PointsPossible { get; init; }

  [JsonPropertyName("cant_go_back")]
  public bool? CantGoBack { get; init; }

  [JsonPropertyName("access_code")]
  public string? AccessCode { get; init; }

  [JsonPropertyName("ip_filter")]
  public string? IpFilter { get; init; }

  [JsonPropertyName("due_at")]
  public DateTime? DueAt { get; init; }

  [JsonPropertyName("lock_at")]
  public DateTime? LockAt { get; init; }

  [JsonPropertyName("unlock_at")]
  public DateTime? UnlockAt { get; init; }

  [JsonPropertyName("published")]
  public bool? Published { get; init; }

  [JsonPropertyName("unpublishable")]
  public bool? Unpublishable { get; init; }

  [JsonPropertyName("locked_for_user")]
  public bool? LockedForUser { get; init; }

  [JsonPropertyName("lock_info")]
  public CanvasLockInfo? LockInfo { get; init; }

  [JsonPropertyName("lock_explanation")]
  public string? LockExplanation { get; init; }

  [JsonPropertyName("speedgrader_url")]
  public string? SpeedGraderUrl { get; init; }

  [JsonPropertyName("quiz_extensions_url")]
  public string? QuizExtensionsUrl { get; init; }

  [JsonPropertyName("permissions")]
  public required CanvasQuizPermissions Permissions { get; init; }

  [JsonPropertyName("all_dates")]
  public object? AllDates { get; init; }

  [JsonPropertyName("version_number")]
  public uint? VersionNumber { get; init; }

  [JsonPropertyName("question_types")]
  public IEnumerable<string>? QuestionTypes { get; init; }

  [JsonPropertyName("anonymous_submissions")]
  public bool? AnonymousSubmissions { get; init; }
}
