using System.Text.RegularExpressions;
using YamlDotNet.Serialization;

namespace LocalModels;

public record LocalQuiz: IModuleItem
{

  public required string Name { get; init; }
  public required string Description { get; init; }
  public string? Password { get; init; } = null;
  public DateTime? LockAt { get; init; }
  public DateTime DueAt { get; init; }
  public bool ShuffleAnswers { get; init; } = true;
  public bool showCorrectAnswers { get; init; } = true;
  public bool OneQuestionAtATime { get; init; } = false;
  public string? LocalAssignmentGroupName { get; init; }
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
      .FirstOrDefault(g => g.Name == LocalAssignmentGroupName)?
      .CanvasId;

  public string GetDescriptionHtml() => Markdig.Markdown.ToHtml(Description);

  public string ToYaml()
  {
    var serializer = new SerializerBuilder().DisableAliases().Build();
    var yaml = serializer.Serialize(this);
    return yaml;
  }

  public string ToMarkdown()
  {
    var questionMarkdownArray = Questions.Select(q => q.ToMarkdown()).ToArray();
    var questionDelimiter = "\n\n---\n\n";
    var questionMarkdown = string.Join(questionDelimiter, questionMarkdownArray);

    return $@"Name: {Name}
LockAt: {LockAt}
DueAt: {DueAt}
Password: {Password}
ShuffleAnswers: {ShuffleAnswers.ToString().ToLower()}
ShowCorrectAnswers: {showCorrectAnswers.ToString().ToLower()}
OneQuestionAtATime: {OneQuestionAtATime.ToString().ToLower()}
AssignmentGroup: {LocalAssignmentGroupName}
AllowedAttempts: {AllowedAttempts}
Description: {Description}
---
{questionMarkdown}
";
  }

  public static LocalQuiz ParseMarkdown(string input)
  {

    var splitInput = input.Split("---\n");
    var settings = splitInput[0];
    var quizWithoutQuestions = getQuizWithOnlySettings(settings);

    var questions = splitInput[1..]
      .Where(str => !string.IsNullOrWhiteSpace(str))
      .Select((q, i) => LocalQuizQuestion.ParseMarkdown(q, i))
      .ToArray();
    return quizWithoutQuestions with
    {
      Questions = questions
    };
  }

  private static LocalQuiz getQuizWithOnlySettings(string settings)
  {

    var name = extractLabelValue(settings, "Name");

    var rawShuffleAnswers = extractLabelValue(settings, "ShuffleAnswers");
    var shuffleAnswers = bool.TryParse(rawShuffleAnswers, out bool parsedShuffleAnswers)
      ? parsedShuffleAnswers
      : throw new QuizMarkdownParseException($"Error with ShuffleAnswers: {rawShuffleAnswers}");


    var rawPassword = extractLabelValue(settings, "Password");
    var password = rawPassword == null || rawPassword.Trim() == string.Empty
      ? null
      : rawPassword;


    var rawShowCorrectAnswers = extractLabelValue(settings, "ShowCorrectAnswers");
    var showCorrectAnswers = bool.TryParse(rawShowCorrectAnswers, out bool parsedShowCorrectAnswers)
      ? parsedShowCorrectAnswers
      : true; //default to true


    var rawOneQuestionAtATime = extractLabelValue(settings, "OneQuestionAtATime");
    var oneQuestionAtATime = bool.TryParse(rawOneQuestionAtATime, out bool parsedOneQuestion)
      ? parsedOneQuestion
      : throw new QuizMarkdownParseException($"Error with oneQuestionAtATime: {rawOneQuestionAtATime}");

    var rawAllowedAttempts = extractLabelValue(settings, "AllowedAttempts");
    var allowedAttempts = int.TryParse(rawAllowedAttempts, out int parsedAllowedAttempts)
      ? parsedAllowedAttempts
      : throw new QuizMarkdownParseException($"Error with AllowedAttempts: {rawAllowedAttempts}");


    var rawDueAt = extractLabelValue(settings, "DueAt");
    var dueAt = DateTime.TryParse(rawDueAt, out DateTime parsedDueAt)
      ? parsedDueAt
      : throw new QuizMarkdownParseException($"Error with DueAt: {rawDueAt}");


    var rawLockAt = extractLabelValue(settings, "LockAt");
    DateTime? lockAt = DateTime.TryParse(rawLockAt, out DateTime parsedLockAt)
      ? parsedLockAt
      : null;


    var description = extractDescription(settings);
    var assignmentGroup = extractLabelValue(settings, "AssignmentGroup");

    return new LocalQuiz()
    {
      Name = name,
      Description = description,
      Password = password,
      LockAt = lockAt,
      DueAt = dueAt,
      ShuffleAnswers = shuffleAnswers,
      showCorrectAnswers = showCorrectAnswers,
      OneQuestionAtATime = oneQuestionAtATime,
      LocalAssignmentGroupName = assignmentGroup,
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

public class QuizMarkdownParseException : Exception
{
  public QuizMarkdownParseException(string message): base(message)
  {

  }
}
