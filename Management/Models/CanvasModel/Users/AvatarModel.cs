


namespace Model.Users {
    public class AvatarModel {
        
        [JsonPropertyName("type")]
        public string Type { get; set; }
        
        [JsonPropertyName("url")]
        public string Url { get; set; }
        
        [JsonPropertyName("token")]
        public string Token { get; set; }
        
        [JsonPropertyName("display_name")]
        public string DisplayName { get; set; }
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("content_type")]
        public string ContentType { get; set; }
        
        [JsonPropertyName("filename")]
        public string Filename { get; set; }
        
        [JsonPropertyName("size")]
        public ulong Size { get; set; }

        
    }
}