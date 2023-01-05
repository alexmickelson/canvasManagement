using System.Collections.Generic;


namespace CanvasModel.Conversations;
public class DetailedConversationModel : ConversationModel
{

  [JsonPropertyName("messages")]
  public IEnumerable<ConversationMessageModel> Messages { get; set; }

}
