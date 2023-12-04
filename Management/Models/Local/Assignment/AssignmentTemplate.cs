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
  // public static string GetHtml(AssignmentTemplate template, LocalAssignment assignment) 
  // {

  //   var html = Markdig.Markdown.ToHtml(template.Markdown);

  //   foreach (KeyValuePair<string, string> entry in assignment.template_variables)
  //   {
  //     html = html.Replace($"%7B%7B{entry.Key}%7D%7D", entry.Value);
  //   }
  //   return html;
  // } 
  
}
