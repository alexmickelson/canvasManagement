


namespace Model.Users {
    
    public class ActivityStreamSummaryEntryModel {
        
        [JsonPropertyName("type")]
        public string Type { get; set; }
        
        [JsonPropertyName("unread_count")]
        public uint UnreadCount { get; set; }
        
        [JsonPropertyName("count")]
        public uint Count { get; set; }
        
        
    }
}