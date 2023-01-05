

namespace CanvasModel.OutcomeResults;
public class OutcomeRollupScoreModel
{

  [JsonPropertyName("score")]
  public double? Score { get; set; }

  [JsonPropertyName("count")]
  public uint? Count { get; set; }

  [JsonPropertyName("links")]
  public OutcomeRollupScoreLinksModel Links { get; set; }
}
