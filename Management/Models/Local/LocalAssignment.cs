using System.Collections;
using System.Text;
using System.Text.RegularExpressions;
using YamlDotNet.Serialization;

namespace LocalModels;

public record RubricItem
{
  public static readonly string extraCredit = "(Extra Credit) ";
  public required string Label { get; set; }
  public required int Points { get; set; }
  public bool IsExtraCredit => Label.Contains(extraCredit.ToLower(), StringComparison.CurrentCultureIgnoreCase);
}

public static class SubmissionType
{
  public static readonly string ONLINE_TEXT_ENTRY = "online_text_entry";
  public static readonly string ONLINE_UPLOAD = "online_upload";
  public static readonly string ONLINE_QUIZ = "online_quiz";
  // public static readonly string ON_PAPER = "on_paper";
  public static readonly string DISCUSSION_TOPIC = "discussion_topic";
  // public static readonly string EXTERNAL_TOOL = "external_tool";
  public static readonly string ONLINE_URL = "online_url";
  // public static readonly string MEDIA_RECORDING = "media_recording";
  // public static readonly string STUDENT_ANNOTATION = "student_annotation";
  public static readonly string NONE = "none";
  public static readonly IEnumerable<string> AllTypes = new string[]
  {
    ONLINE_TEXT_ENTRY,
    ONLINE_UPLOAD,
    ONLINE_QUIZ,
    // ON_PAPER,
    DISCUSSION_TOPIC,
    // EXTERNAL_TOOL,
    ONLINE_URL,
    // MEDIA_RECORDING,
    // STUDENT_ANNOTATION,
    NONE,
  };
}

public record LocalAssignment
{
  // public ulong? CanvasId { get; init; } = null;
  public string Name { get; init; } = "";
  public string Description { get; init; } = "";
  public bool LockAtDueDate { get; init; }
  public IEnumerable<RubricItem> Rubric { get; init; } = Array.Empty<RubricItem>();
  public DateTime? LockAt { get; init; }
  public DateTime DueAt { get; init; }
  public string? LocalAssignmentGroupName { get; init; }
  public int PointsPossible => Rubric.Sum(r => r.IsExtraCredit ? 0 : r.Points);
  public IEnumerable<string> SubmissionTypes { get; init; } = Array.Empty<string>();

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

  public string ToMarkdown()
  {
    var assignmentYaml = ToYaml();
    var assignmentMarkdown =
      "```yaml" + Environment.NewLine
      + assignmentYaml
      + "```" + Environment.NewLine
      + "<!-- assignment markdown below -->" + Environment.NewLine
      + Description;

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

  public static IEnumerable<RubricItem> ParseRubricMarkdown(string rawMarkdown)
  {
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