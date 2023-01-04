using System;



namespace Model.Courses {
    
    public class CourseProgressModel {
        
        [JsonPropertyName("requirement_count")]
        public uint? RequirementCount { get; set; }
        
        [JsonPropertyName("requirement_completed_count")]
        public uint? RequirementCompletedCount { get; set; }
        
        [JsonPropertyName("next_requirement_url")]
        public string? NextRequirementUrl { get; set; }
        
        [JsonPropertyName("completed_at")]
        public DateTime? CompletedAt { get; set; }
    }
}