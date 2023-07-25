namespace LocalModels;

public record LocalModule
{
  public string Name { get; init; } = string.Empty;
  public IEnumerable<LocalAssignment> Assignments { get; init; } =
    Enumerable.Empty<LocalAssignment>();
}
