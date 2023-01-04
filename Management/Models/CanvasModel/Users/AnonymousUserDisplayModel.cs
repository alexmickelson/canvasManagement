


namespace Model.Users {
    public class AnonymousUserDisplayModel {
        
        [JsonPropertyName("anonymous_id")]
        public string AnonymousId { get; set; }
        
        [JsonPropertyName("avatar_image_url")]
        public string AvatarImageUrl { get; set; }

        
    }
}