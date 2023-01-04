using System;



namespace Model.GradeChangelog {
    
    public class GradeChangeEventModel {
        
        [JsonPropertyName("id")]
        public string Id { get; set; }
        
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
        
        [JsonPropertyName("event_type")]
        public string EventType { get; set; }
        
        [JsonPropertyName("excused_after")]
        public bool ExcusedAfter { get; set; }
        
        [JsonPropertyName("excused_before")]
        public bool ExcusedBefore { get; set; }
        
        [JsonPropertyName("grade_after")]
        public string GradeAfter { get; set; }
        
        [JsonPropertyName("grade_before")]
        public string GradeBefore { get; set; }
        
        [JsonPropertyName("graded_anonymously")]
        public bool? GradedAnonymously { get; set; }
        
        [JsonPropertyName("version_number")]
        public string VersionNumber { get; set; }
        
        [JsonPropertyName("request_id")]
        public string RequestId { get; set; }
        
        [JsonPropertyName("links")]
        public GradeChangeEventLinksModel? Links { get; set; }
    }
}