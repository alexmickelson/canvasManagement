namespace LocalModels;

public record LocalQuizQuestionAnswer
{
  public string Id { get; set; } = string.Empty;

  //correct gets a weight of 100 in canvas
  public bool Correct { get; init; }
  public string Text { get; init; } = string.Empty;
}
