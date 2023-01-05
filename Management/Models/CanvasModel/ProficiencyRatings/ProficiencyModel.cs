
namespace CanvasModel.ProficiencyRatings;
public struct ProficiencyModel
{
  [JsonPropertyName("ratings")]
  public IEnumerable<ProficiencyRatingModel> Ratings { get; set; }
}
