

namespace Model.ExternalTools {
    
    public class CourseHomeSubNavigationModel {
        
        [JsonPropertyName("url")]
        public string Url { get; set; }
        
        [JsonPropertyName("enabled")]
        public bool? Enabled { get; set; }
        
        [JsonPropertyName("text")]
        public string Text { get; set; }
        
        [JsonPropertyName("icon_url")]
        public string IconUrl { get; set; }
    }
}
