


namespace Model.Users {
    public class ProfileModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("short_name")]
        public string ShortName { get; set; }
        
        [JsonPropertyName("sortable_name")]
        public string SortableName { get; set; }
        
        [JsonPropertyName("title")]
        public string Title { get; set; }
        
        [JsonPropertyName("bio")]
        public string Bio { get; set; }
        
        [JsonPropertyName("primary_email")]
        public string PrimaryEmail { get; set; }
        
        [JsonPropertyName("login_id")]
        public string LoginId { get; set; }
        
        [JsonPropertyName("sis_user_id")]
        public string SisUserId { get; set; }
        
        [JsonPropertyName("lti_user_id")]
        public string LtiUserId { get; set; }
        
        [JsonPropertyName("avatar_url")]
        public string AvatarUrl { get; set; }
        
        [JsonPropertyName("calendar")]
        public object Calendar { get; set; }
        
        [JsonPropertyName("time_zone")]
        public string TimeZone { get; set; }
        
        [JsonPropertyName("locale")]
        public string Locale { get; set; }

        
    }
}