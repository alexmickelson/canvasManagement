

namespace Model.Analytics {
    
    public class DepartmentStatisticsModel {
        
        [JsonPropertyName("courses")]
        public ulong Courses { get; set; }
        
        [JsonPropertyName("subaccounts")]
        public ulong Subaccounts { get; set; }
        
        [JsonPropertyName("teacher")]
        public ulong Teachers { get; set; }
        
        [JsonPropertyName("students")]
        public ulong Students { get; set; }
        
        [JsonPropertyName("discussion_topics")]
        public ulong DiscussionTopics { get; set; }
        
        [JsonPropertyName("media_objects")]
        public ulong MediaObjects { get; set; }
        
        [JsonPropertyName("attachments")]
        public ulong Attachments { get; set; }
        
        [JsonPropertyName("assignments")]
        public ulong Assignments { get; set; }
    }
}
