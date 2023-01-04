

namespace Model.Accounts {

    public class TermsOfServiceModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("terms_type")]
        public string TermsType { get; set; }
        
        [JsonPropertyName("passive")]
        public bool Passive { get; set; }
        
        [JsonPropertyName("account_id")]
        public ulong AccountId { get; set; }
        
        [JsonPropertyName("content")]
        public string Content { get; set; }
    }
}