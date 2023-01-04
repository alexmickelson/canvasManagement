using System.Collections.Generic;


namespace Model.Conversations {
    
    public class DetailedConversationModel : ConversationModel {
        
        [JsonPropertyName("messages")]
        public IEnumerable<ConversationMessageModel> Messages { get; set; }
        
    }
}
