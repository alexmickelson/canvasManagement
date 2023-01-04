

namespace Model.ExternalTools {
    
    public class AccountNavigationModel {
        
        [JsonPropertyName("url")]
        public string Url { get; set; }
        
        [JsonPropertyName("enabled")]
        public bool? Enabled { get; set; }
        
        [JsonPropertyName("text")]
        public string Text { get; set; }
        
        [JsonPropertyName("selection_width")]
        public uint? SelectionWidth { get; set; }
        
        [JsonPropertyName("selection_height")]
        public uint? SelectionHeight { get; set; }
        
        [JsonPropertyName("display_type")]
        public string DisplayType { get; set; } 
    }
}
