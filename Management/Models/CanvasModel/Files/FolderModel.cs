using System;


namespace CanvasModel.Files;
public class FolderModel
{

  [JsonPropertyName("context_type")]
  public string ContextType { get; set; }

  [JsonPropertyName("context_id")]
  public ulong ContextId { get; set; }

  [JsonPropertyName("files_count")]
  public uint FilesCount { get; set; }

  [JsonPropertyName("position")]
  public int? Position { get; set; }

  [JsonPropertyName("updated_at")]
  public DateTime UpdatedAt { get; set; }

  [JsonPropertyName("folders_url")]
  public string FoldersUrl { get; set; }

  [JsonPropertyName("files_url")]
  public string FilesUrl { get; set; }

  [JsonPropertyName("full_name")]
  public string FullName { get; set; }

  [JsonPropertyName("lock_at")]
  public DateTime? LockAt { get; set; }

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("folders_count")]
  public uint FoldersCount { get; set; }

  [JsonPropertyName("name")]
  public string Name { get; set; }

  [JsonPropertyName("parents_folder_id")]
  public ulong? ParentFolderId { get; set; }

  [JsonPropertyName("created_at")]
  public DateTime CreatedAt { get; set; }

  [JsonPropertyName("unlock_at")]
  public DateTime? UnlockAt { get; set; }

  [JsonPropertyName("hidden")]
  public bool? Hidden { get; set; }

  [JsonPropertyName("hidden_for_user")]
  public bool? HiddenForUser { get; set; }

  [JsonPropertyName("locker")]
  public bool? Locked { get; set; }

  [JsonPropertyName("locked_for_user")]
  public bool? LockedForUser { get; set; }

  [JsonPropertyName("for_submissions")]
  public bool? ForSubmissions { get; set; }
}
