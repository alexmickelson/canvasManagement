namespace LocalModels;

public record LocalCourse
{
  public IEnumerable<LocalModule> Modules { get; init; } = Enumerable.Empty<LocalModule>();
  public LocalCourseSettings Settings { get; set; }
}

public record SimpleTimeOnly
{
  public int Hour { get; init; } = 1;
  public int Minute { get; init; } = 0;
}
