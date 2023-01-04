using System;
using System.Collections.Generic;


namespace Model.Analytics {
    
    public struct UserAssignmentSubmissionDataModel {
        
        [JsonPropertyName("submitted_at")]
        public DateTime? SubmittedAt { get; set; }
        
        [JsonPropertyName("score")]
        public double? Score { get; set; }
    }
    
    public class UserAssignmentDataModel {
        
        [JsonPropertyName("assignment_id")]
        public ulong AssignmentId { get; set; }
        
        [JsonPropertyName("title")]
        public string Title { get; set; }
        
        [JsonPropertyName("points_possible")]
        public double? PointsPossible { get; set; }
        
        [JsonPropertyName("due_at")]
        public DateTime? DueAt { get; set; }
        
        [JsonPropertyName("unlock_at")]
        public DateTime? UnlockAt { get; set; }
        
        [JsonPropertyName("muted")]
        public bool? Muted { get; set; }
        
        [JsonPropertyName("min_score")]
        public double? MinScore { get; set; }
        
        [JsonPropertyName("max_score")]
        public double? MaxScore { get; set; }
        
        [JsonPropertyName("median")]
        public double? Median { get; set; }
        
        [JsonPropertyName("first_quartile")]
        public double? FirstQuartile { get; set; }
        
        [JsonPropertyName("third_quartile")]
        public double? ThirdQuartile { get; set; }
        
        [JsonPropertyName("module_ids")]
        public IEnumerable<ulong> ModuleIds { get; set; }
        
        [JsonPropertyName("submission")]
        public UserAssignmentSubmissionDataModel? Submission { get; set; }
    }
}
