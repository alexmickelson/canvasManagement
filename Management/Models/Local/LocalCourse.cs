namespace LocalModels;

public record LocalCourse
{
  public IEnumerable<LocalModule> Modules { get; init; } = Enumerable.Empty<LocalModule>();
  public string Name { get; init; } = string.Empty;
  public IEnumerable<DayOfWeek> DaysOfWeek { get; init; } = Enumerable.Empty<DayOfWeek>();
  public ulong? CanvasId { get; init; }
  public DateTime StartDate { get; init; }
  public DateTime EndDate { get; init; }
  public SimpleTimeOnly DefaultDueTime { get; init; } = new SimpleTimeOnly();
}

public record SimpleTimeOnly
{
  public int Hour { get; init; } = 1;
  public int Minute { get; init; } = 0;
}
