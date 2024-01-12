namespace LocalModels;

public record LocalCoursePage
{
  public required string Title { get; init; }
  public required string Text { get; set; }
  public DateTime? DueDateForOrdering { get; init; }
}
