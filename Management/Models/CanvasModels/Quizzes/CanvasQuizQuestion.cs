namespace CanvasModel.Quizzes;

public record CanvasQuizQuestion
{
  [JsonPropertyName("id")]
  public ulong Id { get; init; }

  [JsonPropertyName("quiz_id")]
  public int QuizId { get; init; }

  [JsonPropertyName("position")]
  public int? Position { get; init; }

  [JsonPropertyName("question_name")]
  public required string QuestionName { get; init; }

  [JsonPropertyName("question_type")]
  public required string QuestionType { get; init; }

  [JsonPropertyName("question_text")]
  public required string QuestionText { get; init; }

  [JsonPropertyName("correct_comments")]
  public required string CorrectComments { get; init; }

  [JsonPropertyName("incorrect_comments")]
  public required string IncorrectComments { get; init; }

  [JsonPropertyName("neutral_comments")]
  public required string NeutralComments { get; init; }

  [JsonPropertyName("answers")]
  public IEnumerable<CanvasQuizAnswer>? Answers { get; init; }
}
