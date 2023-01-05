
namespace CanvasModel.Modules;
public class ModuleItemModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("module_id")]
  public ulong ModuleId { get; set; }

  [JsonPropertyName("position")]
  public uint Position { get; set; }

  [JsonPropertyName("title")]
  public string Title { get; set; }

  [JsonPropertyName("indent")]
  public uint? Indent { get; set; }

  [JsonPropertyName("type")]
  public string Type { get; set; }

  [JsonPropertyName("content_id")]
  public ulong? ContentId { get; set; }

  [JsonPropertyName("html_url")]
  public string HtmlUrl { get; set; }

  [JsonPropertyName("url")]
  public string? Url { get; set; }

  [JsonPropertyName("page_url")]
  public string? PageUrl { get; set; }

  [JsonPropertyName("external_url")]
  public string? ExternalUrl { get; set; }

  [JsonPropertyName("new_tab")]
  public bool NewTab { get; set; }

  // [OptIn]
  [JsonPropertyName("completion_requirement")]
  public CompletionRequirementModel? CompletionRequirement { get; set; }

  [JsonPropertyName("published")]
  public bool? Published { get; set; }
}
