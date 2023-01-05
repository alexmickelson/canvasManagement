using CanvasModel.Assignments;
using CanvasModel.Users;

namespace CanvasModel.Pages;
public class PageModel
{

  [JsonPropertyName("url")]
  public string Url { get; set; }

  [JsonPropertyName("title")]
  public string Title { get; set; }

  [JsonPropertyName("created_at")]
  public DateTime CreatedAt { get; set; }

  [JsonPropertyName("updated_at")]
  public DateTime UpdatedAt { get; set; }

  [JsonPropertyName("editing_roles")]
  public string EditingRoles { get; set; }

  [JsonPropertyName("last_edited_by")]
  public UserDisplayModel LastEditedBy { get; set; }

  [JsonPropertyName("body")]
  public string? Body { get; set; }

  [JsonPropertyName("published")]
  public bool Published { get; set; }

  [JsonPropertyName("front_page")]
  public bool FrontPage { get; set; }

  [JsonPropertyName("locked_for_user")]
  public bool LockedForUser { get; set; }

  [JsonPropertyName("lock_info")]
  public LockInfoModel? LockInfo { get; set; }

  [JsonPropertyName("lock_explanation")]
  public string? LockExplanation { get; set; }

  [JsonPropertyName("page_id")]
  public string PageId { get; set; }
}