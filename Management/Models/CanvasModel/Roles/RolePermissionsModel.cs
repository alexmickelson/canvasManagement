

namespace CanvasModel.Roles;
public class RolePermissionsModel
{

  [JsonPropertyName("enabled")]
  public bool Enabled { get; set; }

  [JsonPropertyName("locked")]
  public bool Locked { get; set; }

  [JsonPropertyName("applies_to_self")]
  public bool AppliesToSelf { get; set; }

  [JsonPropertyName("applies_to_descendants")]
  public bool AppliesToDescendants { get; set; }

  [JsonPropertyName("readonly")]
  public bool Readonly { get; set; }

  [JsonPropertyName("explicit")]
  public bool Explicit { get; set; }

  [JsonPropertyName("prior_default")]
  public bool PriorDefault { get; set; }
}