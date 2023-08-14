namespace LocalModels;

public record LocalModule
{
  public string Name { get; init; } = string.Empty;
  public IEnumerable<LocalAssignment> Assignments { get; init; } =
    Enumerable.Empty<LocalAssignment>();

  public IEnumerable<LocalQuiz> Quizzes { get; init; } = Enumerable.Empty<LocalQuiz>();

  public ulong? CanvasId { get; set; } = null;
  public string Notes { get; set; } = string.Empty;
}
