


namespace Model.Accounts {
    
    public class AccountModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("uuid")]
        public string Uuid { get; set; }
        
        [JsonPropertyName("parent_account_id")]
        public ulong? ParentAccountId { get; set; }
        
        [JsonPropertyName("root_account_id")]
        public ulong? RootAccountId { get; set; }
        
        [JsonPropertyName("default_user_storage_quota_mb")]
        public ulong? DefaultUserStorageQuotaMb { get; set; }
        
        [JsonPropertyName("default_group_storage_quota_mb")]
        public ulong? DefaultGroupStorageQuotaMb { get; set; }
        
        [JsonPropertyName("default_time_zone")]
        public string DefaultTimeZone { get; set; }
        
        [JsonPropertyName("sis_account_id")]
        public string? SisAccountId { get; set; }
        
        [JsonPropertyName("integrationI-d")]
        public string? IntegrationId { get; set; }
        
        [JsonPropertyName("sis_import_id")]
        public string? SisImportId { get; set; }
        
        [JsonPropertyName("lti_guid")]
        public string LtiGuid { get; set; }
        
        [JsonPropertyName("workflow_state")]
        public string WorkflowState { get; set; }
    }
}