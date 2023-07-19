namespace LocalModels;

public record LocalCourse
{
  public IEnumerable<LocalModule> Modules { get; init; } = Enumerable.Empty<LocalModule>();
  public string Name { get; init; } = string.Empty;
  public IEnumerable<DayOfWeek> DaysOfWeek { get; init; } = Enumerable.Empty<DayOfWeek>();
  public ulong? CanvasId { get; init; }
}
