

using System.Text.RegularExpressions;

namespace LocalModels;
public static class LocalAssignmentMarkdownParser
{

  public static LocalAssignment ParseMarkdown(string input)
  {
    var settingsString = input.Split("---")[0];
    var (name, localAssignmentGroupName, submissionTypes, fileUploadExtensions, dueAt, lockAt) = parseSettings(settingsString);

    var description = String.Join("---\n", input.Split("---\n")[1..]).Split("## Rubric")[0];

    var rubricString = input.Split("## Rubric\n")[1];
    var rubric = ParseRubricMarkdown(rubricString);
    return new LocalAssignment()
    {
      Name = name.Trim(),
      LocalAssignmentGroupName = localAssignmentGroupName.Trim(),
      SubmissionTypes = submissionTypes,
      AllowedFileUploadExtensions = fileUploadExtensions,
      DueAt = dueAt,
      LockAt = lockAt,
      Rubric = rubric,
      Description = description.Trim()
    };
  }

  private static (string name, string assignmentGroupName, List<string> submissionTypes, List<string> fileUploadExtensions, DateTime dueAt, DateTime? lockAt) parseSettings(string input)
  {
    var name = MarkdownUtils.ExtractLabelValue(input, "Name");
    var rawLockAt = MarkdownUtils.ExtractLabelValue(input, "LockAt");
    var rawDueAt = MarkdownUtils.ExtractLabelValue(input, "DueAt");
    var localAssignmentGroupName = MarkdownUtils.ExtractLabelValue(input, "AssignmentGroupName");
    var submissionTypes = parseSubmissionTypes(input);
    var fileUploadExtensions = parseFileUploadExtensions(input);

    DateTime? lockAt = DateTime.TryParse(rawLockAt, out DateTime parsedLockAt)
      ? parsedLockAt
      : null;
    var dueAt = DateTime.TryParse(rawDueAt, out DateTime parsedDueAt)
      ? parsedDueAt
      : throw new AssignmentMarkdownParseException($"Error with DueAt: {rawDueAt}");

    return (name, localAssignmentGroupName, submissionTypes, fileUploadExtensions, dueAt, lockAt);


  }

  private static List<string> parseSubmissionTypes(string input)
  {
    input = input.Replace("\r\n", "\n");
    List<string> submissionTypes = [];

    // Define a regular expression pattern to match the bulleted list items
    string startOfTypePattern = @"- (.+)";
    Regex regex = new(startOfTypePattern);

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

  private static List<string> parseFileUploadExtensions(string input)
  {
    input = input.Replace("\r\n", "\n");
    List<string> allowedFileUploadExtensions = [];

    // Define a regular expression pattern to match the bulleted list items
    string startOfTypePattern = @"- (.+)";
    Regex regex = new(startOfTypePattern);

    var words = input.Split("AllowedFileUploadExtensions:");
    if(words.Length < 2)
      return [];
    var inputAfterSubmissionTypes = words[1];

    string[] lines = inputAfterSubmissionTypes.Split("\n", StringSplitOptions.RemoveEmptyEntries);

    foreach (string line in lines)
    {
      string trimmedLine = line.Trim();
      Match match = regex.Match(trimmedLine);

      if (!match.Success)
        break;

      string type = match.Groups[1].Value.Trim();
      allowedFileUploadExtensions.Add(type);
    }

    return allowedFileUploadExtensions;
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
    var pointsPattern = @"\s*-\s*(-?\d+(?:\.\d+)?)\s*pt(s)?:";
    var match = Regex.Match(rawMarkdown, pointsPattern);
    if (!match.Success)
      throw new RubricMarkdownParseException($"points not found: {rawMarkdown}");

    var points = double.Parse(match.Groups[1].Value);

    var label = string.Join(": ", rawMarkdown.Split(": ").Skip(1));

    return new RubricItem()
    {
      Points = points,
      Label = label
    };
  }

}
