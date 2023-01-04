using System.Collections.Generic;



namespace Model.Groups {
    
    public class GroupModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("description")]
        public string? Description { get; set; }
        
        [JsonPropertyName("is_public")]
        public bool? IsPublic { get; set; }
        
        [JsonPropertyName("followed_by_user")]
        public bool FollowedByUser { get; set; }
        
        [JsonPropertyName("join_level")]
        public string JoinLevel { get; set; }
        
        [JsonPropertyName("members_count")]
        public uint MembersCount { get; set; }
        
        [JsonPropertyName("avatar_url")]
        public string AvatarUrl { get; set; }
        
        [JsonPropertyName("context_type")]
        public string ContextType { get; set; }
        
        [JsonPropertyName("course_id")]
        public ulong? CourseId { get; set; }
        
        [JsonPropertyName("account_id")]
        public ulong? AccountId { get; set; }
        
        [JsonPropertyName("role")]
        public string Role { get; set; }
        
        [JsonPropertyName("group_category_id")]
        public ulong GroupCategoryId { get; set; }
        
        [JsonPropertyName("sis_group_id")]
        public string? SisGroupId { get; set; }
        
        [JsonPropertyName("sis_import_id")]
        public ulong? SisImportId { get; set; }
        
        [JsonPropertyName("storage_quota_mb")]
        public uint StorageQuoteMb { get; set; }
        
        [JsonPropertyName("permissions")]
        public Dictionary<string, bool> Permissions { get; set; }
    }
}
