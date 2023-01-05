

namespace CanvasModel.Analytics;
public class TardinessModel
{

  [JsonPropertyName("missing")]
  public decimal Missing { get; set; }

  [JsonPropertyName("late")]
  public decimal Late { get; set; }

  [JsonPropertyName("on_time")]
  public decimal OnTime { get; set; }

  [JsonPropertyName("floating")]
  public decimal Floating { get; set; }

  [JsonPropertyName("total")]
  public decimal Total { get; set; }
}
