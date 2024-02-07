using CanvasModel.Users;

namespace CanvasModel.Submissions;
public record SubmissionCommentModel
(
  [property: JsonPropertyName("id")]
  ulong Id,

  [property: JsonPropertyName("author_id")]
  ulong AuthorId,

  [property: JsonPropertyName("author_name")]
  string AuthorName,

  [property: JsonPropertyName("author")]
  UserDisplayModel Author,

  [property: JsonPropertyName("comment")]
  string Comment,

  [property: JsonPropertyName("created_at")]
  DateTime CreatedAt,

  [property: JsonPropertyName("edited_at")]
  DateTime? EditedAt = null,

  [property: JsonPropertyName("media_comment")]
  MediaCommentModel? MediaComment = null
);
