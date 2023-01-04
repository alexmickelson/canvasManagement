

namespace Model.Files {
    public class LicenseModel {
        
        [JsonPropertyName("id")]
        public string Id { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("url")]
        public string Url { get; set; }
    }
}
