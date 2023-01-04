using System;



namespace Model.Discussions {
    
    public class TopicReplyModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("user_id")]
        public ulong UserId { get; set; }
        
        [JsonPropertyName("editor_id")]
        public ulong? EditorId { get; set; }
        
        [JsonPropertyName("user_name")]
        public string UserName { get; set; }
        
        [JsonPropertyName("message")]
        public string Message { get; set; }
        
        [JsonPropertyName("read_state")]
        public string ReadState { get; set; }
        
        [JsonPropertyName("forced_read_state")]
        public bool? ForcedReadState { get; set; }
        
        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
        
        
    }
}