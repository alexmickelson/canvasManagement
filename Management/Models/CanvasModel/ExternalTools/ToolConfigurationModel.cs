

namespace Model.ExternalTools {
    
    public class ToolConfigurationModel {
        
        [JsonPropertyName("url")]
        public string Url { get; set; }
        
        [JsonPropertyName("enabled")]
        public bool? Enabled { get; set; }
        
        [JsonPropertyName("message_type")]
        public string MessageType { get; set; }
        
        [JsonPropertyName("prefer_sis_email")]
        public bool? PreferSisEmail { get; set; }
    }
}
