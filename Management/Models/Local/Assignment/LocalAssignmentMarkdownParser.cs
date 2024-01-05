

using System.Text.RegularExpressions;

namespace LocalModels;
public static class LocalAssignmentMarkdownParser
{

  public static LocalAssignment ParseMarkdown(string input)
  {
    var settingsString = input.Split("---")[0];
    var (name, localAssignmentGroupName, submissionTypes, dueAt, lockAt) = parseSettings(settingsString);

    var description = input.Split("---\n")[1].Split("## Rubric")[0];

    var rubricString = input.Split("## Rubric\n")[1];
    var rubric = ParseRubricMarkdown(rubricString);
    return new LocalAssignment()
    {
      Name = name.Trim(),
      LocalAssignmentGroupName = localAssignmentGroupName.Trim(),
      SubmissionTypes = submissionTypes,
      DueAt = dueAt,
      LockAt = lockAt,
      Rubric = rubric,
      Description = description.Trim()
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
    input = input.Replace("\r\n", "\n");
    List<string> submissionTypes = new List<string>();

    // Define a regular expression pattern to match the bulleted list items
    string startOfTypePattern = @"- (.+)";
    Regex regex = new Regex(startOfTypePattern);

    var words = input.Split("SubmissionTypes:");
    var inputAfterSubmissionTypes = words[1];

    string[] lines = inputAfterSubmissionTypes.Split("\n", StringSplitOptions.RemoveEmptyEntries);

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

  private static string extractLabelValue(string input, string label)
  {
    string pattern = $@"{label}: (.*?)\n";
    Match match = Regex.Match(input, pattern);

    if (match.Success)
    {
      return match.Groups[1].Value;
    }

    return string.Empty;
  }


  public static IEnumerable<RubricItem> ParseRubricMarkdown(string rawMarkdown)
  {
    if (rawMarkdown.Trim() == string.Empty)
      return [];
    var lines = rawMarkdown.Trim().Split("\n");
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