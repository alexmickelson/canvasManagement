namespace LocalModels;

public record LocalAssignmentGroup
{
  public ulong? CanvasId { get; init; }
  public string Id { get; init; } = string.Empty;
  public required string Name { get; init; }
  public double Weight { get; init; }
}