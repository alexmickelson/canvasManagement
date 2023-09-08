namespace CanvasModel.Quizzes;

public record CanvasQuizAnswer
{
  [JsonPropertyName("id")]
  public ulong Id { get; init; }

  [JsonPropertyName("text")]
  public required string Text { get; init; }

  [JsonPropertyName("html")]
  public string? Html { get; init; }

  [JsonPropertyName("weight")]
  public double Weight { get; init; }

  // [JsonPropertyName("comments")]
  // public string? Comments { get; init; }

  // [JsonPropertyName("text_after_answers")]
  // public string? TextAfterAnswers { get; init; }

  // [JsonPropertyName("answer_match_left")]
  // public string? AnswerMatchLeft { get; init; }

  // [JsonPropertyName("answer_match_right")]
  // public string? AnswerMatchRight { get; init; }

  // [JsonPropertyName("matching_answer_incorrect_matches")]
  // public string? MatchingAnswerIncorrectMatches { get; init; }

  // [JsonPropertyName("numerical_answer_type")]
  // public string? NumericalAnswerType { get; init; }

  // [JsonPropertyName("exact")]
  // public int? Exact { get; init; }

  // [JsonPropertyName("margin")]
  // public int? Margin { get; init; }

  // [JsonPropertyName("approximate")]
  // public double? Approximate { get; init; }

  // [JsonPropertyName("precision")]
  // public int? Precision { get; init; }

  // [JsonPropertyName("start")]
  // public int? Start { get; init; }

  // [JsonPropertyName("end")]
  // public int? End { get; init; }

  // [JsonPropertyName("blank_id")]
  // public int? BlankId { get; init; }
}
