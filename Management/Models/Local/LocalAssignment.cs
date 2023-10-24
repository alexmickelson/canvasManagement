using YamlDotNet.Serialization;

namespace LocalModels;

public record RubricItem
{
  public static readonly string extraCredit = "(Extra Credit) ";
  public string Id { get; set; } = "";
  public string Label { get; set; } = "";
  public int Points { get; set; } = 0;
  public bool IsExtraCredit => Label.Contains(extraCredit);
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
  public string Id { get; init; } = "";
  public ulong? CanvasId { get; init; } = null;
  public string Name { get; init; } = "";
  public string Description { get; init; } = "";
  // public bool UseTemplate { get; init; } = false;
  public string? TemplateId { get; init; } = string.Empty;
  public Dictionary<string, string> TemplateVariables { get; init; } =
    new Dictionary<string, string>();
  public bool LockAtDueDate { get; init; }
  public IEnumerable<RubricItem> Rubric { get; init; } = Array.Empty<RubricItem>();
  public DateTime? LockAt { get; init; }
  public DateTime DueAt { get; init; }
  public string? LocalAssignmentGroupId { get; init; }
  public int PointsPossible { get; init; }
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

  public string GetDescriptionHtml(IEnumerable<AssignmentTemplate>? templates)
  {
    if (TemplateId != null && TemplateId != "" && templates == null)
      throw new Exception("cannot get description for assignment if templates not provided");

    var rubricHtml = GetRubricHtml();

    if (TemplateId != null && TemplateId != "")
    {
      var template =
        (templates?.FirstOrDefault(t => t.Id == TemplateId))
        ?? throw new Exception($"Could not find template with id {TemplateId}");

      var html = Markdig.Markdown.ToHtml(template.Markdown);

      foreach (KeyValuePair<string, string> entry in TemplateVariables)
      {
        html = html.Replace($"%7B%7B{entry.Key}%7D%7D", entry.Value);
      }
      return html + "<hr>" + rubricHtml;
    }

    return Markdig.Markdown.ToHtml(Description) + "<hr>" + rubricHtml;
  }

  public ulong? GetCanvasAssignmentGroupId(IEnumerable<LocalAssignmentGroup> assignmentGroups) =>
    assignmentGroups
      .FirstOrDefault(g => g.Id == LocalAssignmentGroupId)?
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
}
