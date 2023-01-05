using System;
using System.Collections.Generic;




namespace CanvasModel.Discussions;
public class TopicEntryModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("user_id")]
  public ulong UserId { get; set; }

  [JsonPropertyName("editor_id")]
  public ulong? EditorId { get; set; }

  [JsonPropertyName("user_name")]
  public string UserName { get; set; }

  [JsonPropertyName("message")]
  public string Message { get; set; }

  [JsonPropertyName("read_state")]
  public string ReadState { get; set; }

  [JsonPropertyName("forced_read_state")]
  public bool ForcedReadState { get; set; }

  [JsonPropertyName("created_at")]
  public DateTime CreatedAt { get; set; }

  [JsonPropertyName("updated_at")]
  public DateTime? UpdatedAt { get; set; }

  [JsonPropertyName("attachment")]
  public FileAttachmentModel? Attachment { get; set; }

  [JsonPropertyName("recent_replies")]
  public IEnumerable<TopicReplyModel>? RecentReplies { get; set; }

  [JsonPropertyName("has_more_replies")]
  public bool? HasMoreReplies { get; set; }


}