using System.Text.RegularExpressions;

namespace LocalModels;

public record AssignmentTemplate
{
  public string Id { get; set; } = String.Empty;
  public string Name { get; set; } = String.Empty;
  public string Markdown { get; set; } = String.Empty;

  public static IEnumerable<string> GetVariables(string markdown)
  {
    string pattern = "{{(.*?)}}";
    MatchCollection matches = Regex.Matches(markdown, pattern);

    return matches.Select(match => match.Groups[1].Value);
  }
}
