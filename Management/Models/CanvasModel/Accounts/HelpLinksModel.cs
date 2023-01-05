using System.Collections.Generic;


namespace CanvasModel.Accounts;
public class HelpLinksModel
{

  [JsonPropertyName("help_link_name")]
  public string HelpLinkName { get; set; }

  [JsonPropertyName("help_link_icon")]
  public string HelpLinkIcon { get; set; }

  [JsonPropertyName("custom_help_links")]
  public IEnumerable<HelpLinkModel> CustomHelpLinks { get; set; }

  [JsonPropertyName("default_help_links")]
  public IEnumerable<HelpLinkModel> DefaultHelpLinks { get; set; }
}