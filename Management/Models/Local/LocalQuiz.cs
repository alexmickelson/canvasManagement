using YamlDotNet.Serialization;

namespace LocalModels;

public record LocalQuiz
{
  public required string Id { get; init; }
  public ulong? CanvasId { get; init; } = null;
  public required string Name { get; init; }
  public required string Description { get; init; }
  public bool LockAtDueDate { get; init; } = true;
  public DateTime? LockAt { get; init; }
  public DateTime DueAt { get; init; }
  public bool ShuffleAnswers { get; init; } = true;
  public bool OneQuestionAtATime { get; init; } = false;
  public string? LocalAssignmentGroupId { get; init; }
  public int AllowedAttempts { get; init; } = -1; // -1 is infinite
  // public bool ShowCorrectAnswers { get; init; }
  // public int? TimeLimit { get; init; } = null;
  // public string? HideResults { get; init; } = null;
  // If null, students can see their results after any attempt.
  // If “always”, students can never see their results.
  // If “until_after_last_attempt”, students can only see results after their last attempt. (Only valid if allowed_attempts > 1). Defaults to null.
  public IEnumerable<LocalQuizQuestion> Questions { get; init; } =
    Enumerable.Empty<LocalQuizQuestion>();
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
    var questionMarkdownArray = Questions.Select(q => q.ToMarkdown()).ToArray();
    var questionDelimiter = Environment.NewLine + "---" + Environment.NewLine;
    var questionMarkdown = string.Join(questionDelimiter, questionMarkdownArray);

    return $@"Name: {Name}
Id: {Id}
CanvasId: {CanvasId}
LockAtDueDate: {LockAtDueDate.ToString().ToLower()}
LockAt: {LockAt}
DueAt: {DueAt}
ShuffleAnswers: {ShuffleAnswers.ToString().ToLower()}
OneQuestionAtATime: {OneQuestionAtATime.ToString().ToLower()}
LocalAssignmentGroupId: {LocalAssignmentGroupId}
AllowedAttempts: {AllowedAttempts}
Description: {Description}
---
{questionMarkdown}
";
  }
}
