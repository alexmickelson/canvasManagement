using System.Collections;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Text.RegularExpressions;
using YamlDotNet.Serialization;

namespace LocalModels;

public record LocalAssignment
{
  private string _name = "";
  public string Name
  {
    get => _name;
    init
    {
      if (value.Contains(':'))
        throw new AssignmentMarkdownParseException("Name cannot contain a ':' character, it breaks windows filesystems " + value);
      _name = value;
    }
  }
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
    var output = "<h2>Rubric</h2>";
    var lineStrings = Rubric.Select(
      item => $"- {item.Points}pts: {item.Label} <br/>"
    );
    output += string.Join("\n", lineStrings);
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

  public string ToMarkdown()
  {
    var settingsMarkdown = settingsToMarkdown();
    var rubricMarkdown = RubricToMarkdown();
    var assignmentMarkdown =
      settingsMarkdown + "\n"
      + "---\n\n"
      + Description + "\n\n"
      + "## Rubric\n\n"
      + rubricMarkdown;

    return assignmentMarkdown;
  }

  public string RubricToMarkdown()
  {
    var builder = new StringBuilder();
    foreach (var item in Rubric)
    {
      var pointLabel = item.Points > 1 ? "pts" : "pt";
      builder.Append($"- {item.Points}{pointLabel}: {item.Label}" + "\n");
    }
    return builder.ToString();
  }

  private string settingsToMarkdown()
  {
    var builder = new StringBuilder();
    builder.Append($"Name: {Name}" + "\n");
    builder.Append($"LockAt: {LockAt}" + "\n");
    builder.Append($"DueAt: {DueAt}" + "\n");
    builder.Append($"AssignmentGroupName: {LocalAssignmentGroupName}" + "\n");
    builder.Append($"SubmissionTypes:" + "\n");
    foreach (var submissionType in SubmissionTypes)
    {
      builder.Append($"- {submissionType}" + "\n");
    }
    return builder.ToString();
  }

  public static LocalAssignment ParseMarkdown(string input) => LocalAssignmentMarkdownParser.ParseMarkdown(input);
}
