using System;
using System.Collections.Generic;


namespace CanvasModel.ExternalTools;
public class ExternalToolModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("domain")]
  public string Domain { get; set; }

  [JsonPropertyName("consumer_key")]
  public string ConsumerKey { get; set; }

  [JsonPropertyName("name")]
  public string Name { get; set; }

  [JsonPropertyName("description")]
  public string Description { get; set; }

  [JsonPropertyName("created_at")]
  public DateTime? CreatedAt { get; set; }

  [JsonPropertyName("updated_at")]
  public DateTime? UpdatedAt { get; set; }

  [JsonPropertyName("privacy_level")]
  public string PrivacyLevel { get; set; }

  [JsonPropertyName("custom_fields")]
  public Dictionary<string, string> CustomFields { get; set; }

  [JsonPropertyName("account_navigation")]
  public AccountNavigationModel AccountNavigation { get; set; }

  [JsonPropertyName("course_home_sub_navigation")]
  public CourseHomeSubNavigationModel CourseHomeSubNavigation { get; set; }

  [JsonPropertyName("course_navigation")]
  public CourseNavigationModel CourseNavigation { get; set; }

  [JsonPropertyName("editor_button")]
  public EditorButtonModel EditorButton { get; set; }

  [JsonPropertyName("homework_submission")]
  public HomeworkSubmissionModel HomeworkSubmission { get; set; }

  [JsonPropertyName("migration_selection")]
  public MigrationSelectionModel MigrationSelection { get; set; }

  [JsonPropertyName("resource_selection")]
  public ResourceSelectionModel ResourceSelection { get; set; }

  [JsonPropertyName("tool_configuration")]
  public ToolConfigurationModel ToolConfiguration { get; set; }

  [JsonPropertyName("user_navigation")]
  public UserNavigationModel UserNavigation { get; set; }

  [JsonPropertyName("selection_width")]
  public uint? SelectionWidth { get; set; }

  [JsonPropertyName("selection_height")]
  public uint? SelectionHeight { get; set; }

  [JsonPropertyName("icon_url")]
  public string IconUrl { get; set; }

  [JsonPropertyName("not_selectable")]
  public bool? NotSelectable { get; set; }
}
