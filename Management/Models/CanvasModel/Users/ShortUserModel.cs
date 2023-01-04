

namespace Model.Users {
    
    public class ShortUserModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("display_name")]
        public string DisplayName { get; set; }
        
        [JsonPropertyName("avatar_image_url")]
        public string AvatarImageUrl { get; set; }
        
        [JsonPropertyName("html_url")]
        public string HtmlUrl { get; set; }
    }
}
