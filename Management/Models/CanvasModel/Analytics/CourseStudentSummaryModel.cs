

namespace CanvasModel.Analytics;
public class CourseStudentSummaryModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("page_views")]
  public uint PageViews { get; set; }

  [JsonPropertyName("max_page_views")]
  public uint? MaxPageViews { get; set; }

  [JsonPropertyName("page_views_level")]
  public uint? PageViewsLevel { get; set; }

  [JsonPropertyName("participations")]
  public uint Participations { get; set; }

  [JsonPropertyName("max_participations")]
  public uint? MaxParticipations { get; set; }

  [JsonPropertyName("participations_level")]
  public uint? ParticipationsLevel { get; set; }

  [JsonPropertyName("tardiness_breakdown")]
  public TardinessModel TardinessBreakdown { get; set; }
}
