

namespace Model.Assignments {
    
    public class TurnitinSettingsModel {
        
        [JsonPropertyName("originality_report_visibility")]
        public string OriginalityReportVisibility { get; set; }
        
        [JsonPropertyName("s_paper_check")]
        public bool SPaperCheck { get; set; }
        
        [JsonPropertyName("internet_check")]
        public bool InternetCheck { get; set; }
        
        [JsonPropertyName("journal_check")]
        public bool JournalCheck { get; set; }
        
        [JsonPropertyName("exclude_biblio")]
        public bool ExcludeBiblio { get; set; }
        
        [JsonPropertyName("exclude_quoted")]
        public bool ExcludeQuoted { get; set; }
        
        [JsonPropertyName("exclude_small_matches_type")]
        public bool? ExcludeSmallMatchesType { get; set; }
        
        [JsonPropertyName("exclude_small_matches_value")]
        public uint? ExcludeSmallMatchesValue { get; set; }
    }
}