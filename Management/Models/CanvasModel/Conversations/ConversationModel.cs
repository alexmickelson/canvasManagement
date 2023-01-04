using System;
using System.Collections.Generic;



namespace Model.Conversations {
    
    public class ConversationModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("subject")]
        public string Subject { get; set; }
        
        [JsonPropertyName("workflow_state")]
        public string WorkflowState { get; set; }
        
        [JsonPropertyName("last_message")]
        public string LastMessage { get; set; }
        
        [JsonPropertyName("last_message_at")]
        public DateTime? LastMessageAt { get; set; }
        
        [JsonPropertyName("message_count")]
        public uint MessageCount { get; set; }
        
        [JsonPropertyName("subscribed")]
        public bool? Subscribed { get; set; }
        
        [JsonPropertyName("private")]
        public bool? Private { get; set; }
        
        [JsonPropertyName("starred")]
        public bool? Starred { get; set; }
        
        [JsonPropertyName("properties")]
        public IEnumerable<string>? Properties { get; set; }
        
        [JsonPropertyName("audience")]
        public IEnumerable<ulong>? Audience { get; set; }
        
        [JsonPropertyName("audience_contexts")]
        public Dictionary<string, Dictionary<string, IEnumerable<string>>>? AudienceContexts { get; set; }
        
        [JsonPropertyName("avatar_url")]
        public string AvatarUrl { get; set; }
        
        [JsonPropertyName("participants")]
        public IEnumerable<ConversationParticipantModel>? Participants { get; set; }
        
        [JsonPropertyName("visible")]
        public bool? Visible { get; set; }
        
        [JsonPropertyName("context_name")]
        public string ContextName { get; set; }
    }
}
