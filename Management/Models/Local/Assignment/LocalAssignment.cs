
namespace LocalModels;

public sealed record LocalAssignment : IModuleItem
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
  public DateTime? LockAt { get; init; }
  public DateTime DueAt { get; init; }
  public string? LocalAssignmentGroupName { get; init; }
  public IEnumerable<string> SubmissionTypes { get; init; } = Array.Empty<string>();
  public IEnumerable<RubricItem> Rubric { get; init; } = Array.Empty<RubricItem>();
  public double PointsPossible => Rubric.Sum(r => r.IsExtraCredit ? 0 : r.Points);


  public string GetDescriptionHtml()
  {
    return MarkdownService.Render(Description);
  }

  public ulong? GetCanvasAssignmentGroupId(IEnumerable<LocalAssignmentGroup> assignmentGroups) =>
    assignmentGroups
      .FirstOrDefault(g => g.Name == LocalAssignmentGroupName)?
      .CanvasId;

  public string ToMarkdown() => this.AssignmentToMarkdown();
  public string RubricToMarkdown() => this.AssignmentRubricToMarkdown();
  public static LocalAssignment ParseMarkdown(string input) => LocalAssignmentMarkdownParser.ParseMarkdown(input);
  public static IEnumerable<RubricItem> ParseRubricMarkdown(string rawMarkdown) => LocalAssignmentMarkdownParser.ParseRubricMarkdown(rawMarkdown);


  public bool Equals(LocalAssignment? otherAssignment)
  {
    return ToMarkdown() == otherAssignment?.ToMarkdown();
  }

  public override int GetHashCode() => ToMarkdown().GetHashCode();

}
