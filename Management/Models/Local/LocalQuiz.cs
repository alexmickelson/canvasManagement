using System.Text.RegularExpressions;
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

  public static LocalQuiz ParseMarkdown(string input)
  {

    var splitInput = input.Split(Environment.NewLine + Environment.NewLine);
    var settings = splitInput[0];

    var name = extractLabelValue(settings, "Name");
    var lockAtDueDate = bool.Parse(extractLabelValue(settings, "LockAtDueDate"));
    var shuffleAnswers = bool.Parse(extractLabelValue(settings, "ShuffleAnswers"));
    var oneQuestionAtATime = bool.Parse(extractLabelValue(settings, "OneQuestionAtATime"));
    var allowedAttempts = int.Parse(extractLabelValue(settings, "AllowedAttempts"));
    var dueAt = DateTime.Parse(extractLabelValue(settings, "DueAt"));
    var lockAt = DateTime.Parse(extractLabelValue(settings, "LockAt"));
    var description = extractDescription(settings);

    // var assignmentGroup = ExtractLabelValue(settings, "AssignmentGroup");
    return new LocalQuiz()
    {
      Id = "id-" + name,
      Name = name,
      Description = description,
      LockAtDueDate = lockAtDueDate,
      LockAt = lockAt,
      DueAt = dueAt,
      ShuffleAnswers = shuffleAnswers,
      OneQuestionAtATime = oneQuestionAtATime,
      // LocalAssignmentGroupId = "someId",
      AllowedAttempts = allowedAttempts,
      Questions = new LocalQuizQuestion[] { }
    };
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

  static string extractDescription(string input)
  {
    string pattern = "Description: (.*?)$";
    Match match = Regex.Match(input, pattern, RegexOptions.Singleline);

    if (match.Success)
    {
      return match.Groups[1].Value;
    }

    return string.Empty;
  }
}
