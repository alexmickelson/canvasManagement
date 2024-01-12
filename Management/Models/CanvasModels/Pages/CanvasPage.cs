
namespace CanvasModel.Pages;
public record CanvasPage (
  [property: JsonPropertyName("page_id")] string PageId,
  [property: JsonPropertyName("url")] string Url,
  [property: JsonPropertyName("title")] string Title,
  [property: JsonPropertyName("published")] bool Published,
  [property: JsonPropertyName("front_page")] bool FrontPage,
  [property: JsonPropertyName("body")] string? Body
);
// [JsonPropertyName("created_at")]
// public DateTime CreatedAt { get; set; }

// [JsonPropertyName("updated_at")]
// public DateTime UpdatedAt { get; set; }

// [JsonPropertyName("editing_roles")]
// public string EditingRoles { get; set; }

// [JsonPropertyName("last_edited_by")]
// public UserDisplayModel LastEditedBy { get; set; }

// [JsonPropertyName("locked_for_user")]
// public bool LockedForUser { get; set; }

// [JsonPropertyName("lock_info")]
// public LockInfoModel? LockInfo { get; set; }

// [JsonPropertyName("lock_explanation")]
// public string? LockExplanation { get; set; }


