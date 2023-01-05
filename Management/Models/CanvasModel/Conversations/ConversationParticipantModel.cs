


namespace CanvasModel.Conversations;
public class ConversationParticipantModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("name")]
  public string Name { get; set; }

  [JsonPropertyName("full_name")]
  public string FullName { get; set; }

  [JsonPropertyName("avatar_url")]
  public string? AvatarUrl { get; set; }
}
