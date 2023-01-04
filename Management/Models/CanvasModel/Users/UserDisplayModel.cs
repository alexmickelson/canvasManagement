



namespace Model.Users {
    
    public class UserDisplayModel {
        
        [JsonPropertyName("id")]
        public ulong? Id { get; set; }
        
        [JsonPropertyName("short_name")]
        public string? ShortName { get; set; }
        
        [JsonPropertyName("display_name")]
        public string? DisplayName { get; set; }
        
        [JsonPropertyName("avatar_image_url")]
        public string AvatarImageUrl { get; set; }
        
        [JsonPropertyName("html_url")]
        public string HtmlUrl { get; set; }

        [JsonPropertyName("pronouns")]
        public string? Pronouns { get; set; }
        
        [JsonPropertyName("anonymous_id")]
        public string AnonymousId { get; set; }
    }
}