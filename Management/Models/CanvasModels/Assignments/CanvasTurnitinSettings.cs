namespace CanvasModel.Assignments;

public record CanvasTurnitinSettings
(
  [property: JsonPropertyName("originality_report_visibility")]
  string OriginalityReportVisibility,

  [property: JsonPropertyName("s_paper_check")]
  bool SPaperCheck,

  [property: JsonPropertyName("internet_check")]
  bool InternetCheck,

  [property: JsonPropertyName("journal_check")]
  bool JournalCheck,

  [property: JsonPropertyName("exclude_biblio")]
  bool ExcludeBiblio,

  [property: JsonPropertyName("exclude_quoted")]
  bool ExcludeQuoted,

  [property: JsonPropertyName("exclude_small_matches_type")]
  bool? ExcludeSmallMatchesType = null,

  [property: JsonPropertyName("exclude_small_matches_value")]
  uint? ExcludeSmallMatchesValue = null
);
