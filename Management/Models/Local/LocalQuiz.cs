public record LocalQuiz
{
  public string Id { get; init; } = "";  public ulong? CanvasId { get; init; } = null;
  public string Name { get; init; } = "";
  public string Description { get; init; } = "";
  public bool LockAtDueDate { get; init; }
  public DateTime? LockAt { get; init; }
  public DateTime DueAt { get; init; }
  public bool ShuffleAnswers { get; init; }
  public bool OneQuestionAtATime { get; init; }
  public int AllowedAttempts { get; init; }
  //quiz type
}