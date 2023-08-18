namespace LocalModels;

public record LocalQuizQuestionAnswer
{
  public ulong? CanvasId { get; init; }
  public string Id { get; init; } = string.Empty;

  //correct gets a weight of 100 in canvas
  public bool Correct { get; init; }
  public string Text { get; init; } = string.Empty;
}
