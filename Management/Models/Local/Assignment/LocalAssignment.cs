using System.Collections;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Text.RegularExpressions;
using YamlDotNet.Serialization;

namespace LocalModels;

public record LocalAssignment
{
  // public ulong? CanvasId { get; init; } = null;
  public string Name { get; init; } = "";
  public string Description { get; init; } = "";
  // public bool LockAtDueDate { get; init; }
  public DateTime? LockAt { get; init; }
  public DateTime DueAt { get; init; }
  public string? LocalAssignmentGroupName { get; init; }
  public IEnumerable<string> SubmissionTypes { get; init; } = Array.Empty<string>();
  public IEnumerable<RubricItem> Rubric { get; init; } = Array.Empty<RubricItem>();
  public int PointsPossible => Rubric.Sum(r => r.IsExtraCredit ? 0 : r.Points);

  public string GetRubricHtml()
  {
    var output = "<h1>Rubric</h1><pre><code class=\"language-json\">[\n";

    var lineStrings = Rubric.Select(
      item => $"  {{\"label\": \"{item.Label}\", \"points\": {item.Points}}}"
    );
    output += string.Join(",\n", lineStrings);
    output += "\n]</code></pre>";
    return output;
  }

  public string GetDescriptionHtml()
  {
    var rubricHtml = GetRubricHtml();

    return Markdig.Markdown.ToHtml(Description) + "<hr>" + rubricHtml;
  }

  public ulong? GetCanvasAssignmentGroupId(IEnumerable<LocalAssignmentGroup> assignmentGroups) =>
    assignmentGroups
      .FirstOrDefault(g => g.Name == LocalAssignmentGroupName)?
      .CanvasId;


  public string ToYaml()
  {
    var serializer = new SerializerBuilder().DisableAliases().Build();
    var yaml = serializer.Serialize(this);
    return yaml;
  }

  public static LocalAssignment ParseMarkdown(string input)
  {
    var settingsString = input.Split("---")[0];
    var (name, localAssignmentGroupName, submissionTypes, dueAt, lockAt) = parseSettings(settingsString);

    var description = input.Split("---" + Environment.NewLine)[1].Split("## Rubric")[0];

    var rubricString = input.Split("## Rubric" + Environment.NewLine)[1];
    var rubric = ParseRubricMarkdown(rubricString);
    return new LocalAssignment()
    {
      Name=name.Trim(),
      LocalAssignmentGroupName=localAssignmentGroupName.Trim(),
      SubmissionTypes=submissionTypes,
      DueAt=dueAt,
      LockAt=lockAt,
      Rubric=rubric,
      Description=description.Trim()
    };
  }

  private static (string name, string assignmentGroupName, List<string> submissionTypes, DateTime dueAt, DateTime? lockAt) parseSettings(string input)
  {
    var name = extractLabelValue(input, "Name");
    var rawLockAt = extractLabelValue(input, "LockAt");
    var rawDueAt = extractLabelValue(input, "DueAt");
    var localAssignmentGroupName = extractLabelValue(input, "AssignmentGroupName");
    var submissionTypes = parseSubmissionTypes(input);

    DateTime? lockAt = DateTime.TryParse(rawLockAt, out DateTime parsedLockAt)
      ? parsedLockAt
      : null;
    var dueAt = DateTime.TryParse(rawDueAt, out DateTime parsedDueAt)
      ? parsedDueAt
      : throw new QuizMarkdownParseException($"Error with DueAt: {rawDueAt}");

    return (name, localAssignmentGroupName, submissionTypes, dueAt, lockAt);


  }

  private static List<string> parseSubmissionTypes(string input)
  {
    List<string> submissionTypes = new List<string>();

    // Define a regular expression pattern to match the bulleted list items
    string startOfTypePattern = @"- (.+)";
    Regex regex = new Regex(startOfTypePattern);

    var inputAfterSubmissionTypes = input.Split("SubmissionTypes:" + Environment.NewLine)[1];

    string[] lines = inputAfterSubmissionTypes.Split(Environment.NewLine, StringSplitOptions.RemoveEmptyEntries);

    foreach (string line in lines)
    {
      string trimmedLine = line.Trim();
      Match match = regex.Match(trimmedLine);

      if (!match.Success)
        break;

      string type = match.Groups[1].Value.Trim();
      submissionTypes.Add(type);
    }

    return submissionTypes;
  }

  static string extractLabelValue(string input, string label)
  {
    string pattern = $@"{label}: (.*?)\n";
    Match match = Regex.Match(input, pattern);

    if (match.Success)
    {
      return match.Groups[1].Value;
    }

    return string.Empty;
  }

  public string ToMarkdown()
  {
    var settingsMarkdown = settingsToMarkdown();
    var rubricMarkdown = RubricToMarkdown();
    var assignmentMarkdown =
      settingsMarkdown + Environment.NewLine
      + "---" + Environment.NewLine + Environment.NewLine
      + Description + Environment.NewLine
      + Environment.NewLine + "## Rubric" + Environment.NewLine + Environment.NewLine
      + rubricMarkdown;

    return assignmentMarkdown;
  }

  public string RubricToMarkdown()
  {
    var builder = new StringBuilder();
    foreach (var item in Rubric)
    {
      var pointLabel = item.Points > 1 ? "pts" : "pt";
      builder.Append($"- {item.Points}{pointLabel}: {item.Label}" + Environment.NewLine);
    }
    return builder.ToString();
  }

  private string settingsToMarkdown()
  {
    var builder = new StringBuilder();
    builder.Append($"Name: {Name}" + Environment.NewLine);
    builder.Append($"LockAt: {LockAt}" + Environment.NewLine);
    builder.Append($"DueAt: {DueAt}" + Environment.NewLine);
    builder.Append($"AssignmentGroupName: {LocalAssignmentGroupName}" + Environment.NewLine);
    builder.Append($"SubmissionTypes:" + Environment.NewLine);
    foreach (var submissionType in SubmissionTypes)
    {
      builder.Append($"- {submissionType}" + Environment.NewLine);
    }
    return builder.ToString();
  }

  public static IEnumerable<RubricItem> ParseRubricMarkdown(string rawMarkdown)
  {
    if(rawMarkdown.Trim() == string.Empty)
      return [];
    var lines = rawMarkdown.Trim().Split(Environment.NewLine);
    var items = lines.Select(parseIndividualRubricItemMarkdown).ToArray();
    return items;
  }

  private static RubricItem parseIndividualRubricItemMarkdown(string rawMarkdown)
  {
    var pointsPattern = @"\s*-\s*(\d+)\s*pt(s)?:";
    var match = Regex.Match(rawMarkdown, pointsPattern);
    if (!match.Success)
      throw new RubricMarkdownParseException($"points not found: {rawMarkdown}");

    var points = int.Parse(match.Groups[1].Value);

    var label = string.Join(": ", rawMarkdown.Split(": ").Skip(1));

    return new RubricItem()
    {
      Points = points,
      Label = label
    };
  }
}

public class RubricMarkdownParseException : Exception
{
  public RubricMarkdownParseException(string message) : base(message) { }
}
public class AssignmentMarkdownParseException : Exception
{
  public AssignmentMarkdownParseException(string message) : base(message) { }
}