
namespace CanvasModel.Assignments;

public record CanvasAssignmentGroup
{
  [JsonPropertyName("id")]
  public ulong Id { get; init; }

  [JsonPropertyName("name")]
  public required string Name { get; init; }

  [JsonPropertyName("position")]
  public int Position { get; init; }

  [JsonPropertyName("group_weight")]
  public double GroupWeight { get; init; }

  // [JsonPropertyName("sis_source_id")]
  // public string? SisSourceId { get; init; } = null;

  // [JsonPropertyName("integration_data")]
  // public Dictionary<string, string> IntegrationData { get; init; } = new Dictionary<string, string>();

  // [JsonPropertyName("assignments")]
  // public List<CanvasAssignment> Assignments { get; init; }

  // [JsonPropertyName("rules")]
  // public object Rules { get; init; } // The specific type for 'Rules' is not detailed in the spec, so using object for now.
}
