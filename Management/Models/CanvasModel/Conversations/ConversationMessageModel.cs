using System;
using System.Collections.Generic;


using CanvasModel.Discussions;
using CanvasModel.Submissions;

namespace CanvasModel.Conversations;
public class ConversationMessageModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("created_at")]
  public DateTime CreatedAt { get; set; }

  [JsonPropertyName("body")]
  public string Body { get; set; }

  [JsonPropertyName("author_id")]
  public ulong AuthorId { get; set; }

  [JsonPropertyName("generated")]
  public bool Generated { get; set; }

  [JsonPropertyName("media_comment")]
  public MediaCommentModel? MediaComment { get; set; }

  [JsonPropertyName("forwarded_messages")]
  public IEnumerable<ConversationMessageModel> ForwardedMessages { get; set; }

  [JsonPropertyName("attachments")]
  public IEnumerable<FileAttachmentModel> Attachments { get; set; }
}
