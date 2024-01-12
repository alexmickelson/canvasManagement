namespace LocalModels;

public record LocalModule
{
  public string Name { get; init; } = string.Empty;
  public string Notes { get; set; } = string.Empty;
  public IEnumerable<LocalAssignment> Assignments { get; init; } = [];
  public IEnumerable<LocalQuiz> Quizzes { get; init; } = [];
  public IEnumerable<LocalCoursePage> Pages { get; init; } = [];
}
