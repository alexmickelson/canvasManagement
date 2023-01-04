using System.Collections.Generic;


namespace Model.Authentications {
    public struct AuthenticationEventsResponseModel {
        
        [JsonPropertyName("events")]
        public IEnumerable<AuthenticationEventModel> Events { get; set; }
        
    }
}