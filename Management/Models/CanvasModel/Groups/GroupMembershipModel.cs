

namespace Model.Groups {
    
    public class GroupMembershipModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("group_id")]
        public ulong GroupId { get; set; }
        
        [JsonPropertyName("user_id")]
        public ulong UserId { get; set; }
        
        [JsonPropertyName("workflow_state")]
        public string WorkflowState { get; set; }
        
        [JsonPropertyName("moderator")]
        public bool Moderator { get; set; }
        
        [JsonPropertyName("just_created")]
        public bool? JustCreated { get; set; }
        
        [JsonPropertyName("sis_import_id")]
        public ulong? SisImportId { get; set; }
    }
}
