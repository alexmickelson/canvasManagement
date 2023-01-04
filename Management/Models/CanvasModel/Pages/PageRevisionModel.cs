using System;


using Model.Users;

namespace Model.Pages {
    public class PageRevisionModel {
        
        [JsonPropertyName("revision_id")]
        public ulong RevisionId { get; set; }
        
        [JsonPropertyName("updated_at")]
        public DateTime UpdatedAt { get; set; }
        
        [JsonPropertyName("latest")]
        public bool Latest { get; set; }
        
        [JsonPropertyName("edited_by")]
        public UserDisplayModel? EditedBy { get; set; }
        
        [JsonPropertyName("url")]
        public string? Url { get; set; }
        
        [JsonPropertyName("title")]
        public string? Title { get; set; }
        
        [JsonPropertyName("body")]
        public string? Body { get; set; }
    }
}