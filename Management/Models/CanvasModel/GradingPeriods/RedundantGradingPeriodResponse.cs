

namespace CanvasModel.GradingPeriods;
public class RedundantGradingPeriodResponse
{
  [JsonPropertyName("grading_periods")]
  public IEnumerable<GradingPeriodModel> GradingPeriods { get; set; }
}
