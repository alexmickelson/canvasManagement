

namespace CanvasModel.ProficiencyRatings;
public class ProficiencyRatingModel
{

  [JsonPropertyName("description")]
  public string Description { get; set; }

  [JsonPropertyName("points")]
  public double Points { get; set; }

  [JsonPropertyName("mastery")]
  public bool Mastery { get; set; }

  [JsonPropertyName("color")]
  public string Color { get; set; }
}
