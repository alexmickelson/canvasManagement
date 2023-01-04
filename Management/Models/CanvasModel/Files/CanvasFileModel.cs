using System;


namespace Model.Files {
    public class CanvasFileModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("uuid")]
        public string Uuid { get; set; }
        
        [JsonPropertyName("folder_id")]
        public ulong FolderId { get; set; }
        
        [JsonPropertyName("display_name")]
        public string DisplayName { get; set; }
        
        [JsonPropertyName("filename")]
        public string Filename { get; set; }
        
        [JsonPropertyName("content_type")]
        public string ContentType { get; set; }
        
        [JsonPropertyName("url")]
        public string Url { get; set; }
        
        [JsonPropertyName("size")]
        public ulong Size { get; set; }
        
        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }
        
        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }
        
        [JsonPropertyName("unlock_at")]
        public DateTime? UnlockAt { get; set; }
        
        [JsonPropertyName("locked")]
        public bool Locked { get; set; }
        
        [JsonPropertyName("hidden")]
        public bool Hidden { get; set; }
        
        [JsonPropertyName("lock_at")]
        public DateTime? LockAt { get; set; }
        
        [JsonPropertyName("hidden_for_user")]
        public bool HiddenForUser { get; set; }
        
        [JsonPropertyName("thumbnail_url")]
        public string ThumbnailUrl { get; set; }
        
        [JsonPropertyName("modified_at")]
        public DateTime? ModifiedAt { get; set; }
        
        [JsonPropertyName("mime_class")]
        public string MimeClass { get; set; }
        
        [JsonPropertyName("media_entry_id")]
        public string MediaEntryId { get; set; }
        
        [JsonPropertyName("locked_for_user")]
        public bool LockedForUser { get; set; }
        
        [JsonPropertyName("lock_info")]
        // public LockInfo? LockInfo { get; set; }
        public object? LockInfo { get; set; }
        
        [JsonPropertyName("lock_explanation")]
        public string LockExplanation { get; set; }
        
        [JsonPropertyName("preview_url")]
        public string PreviewUrl { get; set; }
    }
}