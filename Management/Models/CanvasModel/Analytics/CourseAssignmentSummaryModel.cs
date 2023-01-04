using System;


namespace Model.Analytics {
    
    public class CourseAssignmentSummaryModel {
        
        [JsonPropertyName("assignment_id")]
        public ulong AssignmentId { get; set; }
        
        [JsonPropertyName("title")]
        public string Title { get; set; }
        
        [JsonPropertyName("due_at")]
        public DateTime DueAt { get; set; }
        
        [JsonPropertyName("unlock_at")]
        public DateTime? UnlockAt { get; set; }
        
        [JsonPropertyName("muted")]
        public bool Muted { get; set; }
        
        [JsonPropertyName("points_possible")]
        public decimal PointsPossible { get; set; }
        
        [JsonPropertyName("non_digital_submission")]
        public bool? NonDigitalSubmission { get; set; }
        
        [JsonPropertyName("max_score")]
        public decimal? MaxScore { get; set; }
        
        [JsonPropertyName("min_score")]
        public decimal? MinScore { get; set; }
        
        [JsonPropertyName("first_quartile")]
        public decimal? FirstQuartile { get; set; }
        
        [JsonPropertyName("median")]
        public decimal? Median { get; set; }
        
        [JsonPropertyName("third_quartile")]
        public decimal? ThirdQuartile { get; set; }
        
        [JsonPropertyName("tardiness_breakdown")]
        public TardinessModel TardinessBreakdown { get; set; }
    }
}
