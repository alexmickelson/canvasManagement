using System.Text.RegularExpressions;

namespace LocalModels;

public static class MarkdownUtils
{
  public static string ExtractLabelValue(string input, string label)
  {
    string pattern = $@"{label}: (.*?)\n";
    Match match = Regex.Match(input, pattern);

    if (match.Success)
    {
      return match.Groups[1].Value;
    }

    return string.Empty;
  }

}
