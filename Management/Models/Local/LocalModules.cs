namespace LocalModels;

public record LocalModule
{
  public string Name { get; init; } = string.Empty;
  public string Id { get; init; } = DateTime.UtcNow.Ticks.ToString();
  public ulong? CanvasId { get; set; } = null;
  public string Notes { get; set; } = string.Empty;
  public IEnumerable<LocalAssignment> Assignments { get; init; } =
    Enumerable.Empty<LocalAssignment>();

  public IEnumerable<LocalQuiz> Quizzes { get; init; } = Enumerable.Empty<LocalQuiz>();

}
