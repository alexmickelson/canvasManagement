

namespace CanvasModel.SisImports;
public class SisImportStatisticModel
{

  [JsonPropertyName("created")]
  public ulong? Created { get; set; }

  [JsonPropertyName("concluded")]
  public ulong? Concluded { get; set; }

  [JsonPropertyName("deactivated")]
  public ulong? Deactivated { get; set; }

  [JsonPropertyName("restored")]
  public ulong? Restored { get; set; }

  [JsonPropertyName("deleted")]
  public ulong? Deleted { get; set; }
}
