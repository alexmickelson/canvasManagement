public record CanvasAssignmentCreationRequest
{
  public string? name { get; set; }
  public IEnumerable<string> submission_types { get; set; } = Enumerable.Empty<string>();
  public string? description { get; set; }
  public DateTime? lock_at { get; set; }
  public DateTime? due_at { get; set; }
  public int? points_possible { get; set; }
}
