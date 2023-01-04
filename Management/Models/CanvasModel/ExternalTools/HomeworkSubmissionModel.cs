

namespace Model.ExternalTools {
    
    public class HomeworkSubmissionModel {
        
        [JsonPropertyName("url")]
        public string Url { get; set; }
        
        [JsonPropertyName("enabled")]
        public bool? Enabled { get; set; }
        
        [JsonPropertyName("text")]
        public string Text { get; set; }
        
        [JsonPropertyName("message_type")]
        public string MessageType { get; set; }
    }
}
