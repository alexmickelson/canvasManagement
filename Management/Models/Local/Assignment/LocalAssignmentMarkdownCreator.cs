using System.Text;
using LocalModels;

namespace LocalModels;
public static class LocalAssignmentMarkdownCreator
{
  public static string AssignmentToMarkdown(this LocalAssignment assignment)
  {
    var settingsMarkdown = assignment.settingsToMarkdown();
    var rubricMarkdown = assignment.RubricToMarkdown();
    var assignmentMarkdown =
      settingsMarkdown + "\n"
      + "---\n\n"
      + assignment.Description + "\n\n"
      + "## Rubric\n\n"
      + rubricMarkdown;

    return assignmentMarkdown;
  }

  public static string AssignmentRubricToMarkdown(this LocalAssignment assignment)
  {
    var builder = new StringBuilder();
    foreach (var item in assignment.Rubric)
    {
      var pointLabel = item.Points > 1 ? "pts" : "pt";
      builder.Append($"- {item.Points}{pointLabel}: {item.Label}" + "\n");
    }
    return builder.ToString();
  }

  private static string settingsToMarkdown(this LocalAssignment assignment)
  {
    var printableDueDate = assignment.DueAt.ToString().Replace('\u202F', ' ');
    var printableLockAt = assignment.LockAt?.ToString().Replace('\u202F', ' ') ?? "";
    var builder = new StringBuilder();
    builder.Append($"Name: {assignment.Name}" + "\n");
    builder.Append($"LockAt: {printableLockAt}" + "\n");
    builder.Append($"DueAt: {printableDueDate}" + "\n");
    builder.Append($"AssignmentGroupName: {assignment.LocalAssignmentGroupName}" + "\n");
    builder.Append($"SubmissionTypes:" + "\n");
    foreach (var submissionType in assignment.SubmissionTypes)
    {
      builder.Append($"- {submissionType}" + "\n");
    }
    builder.Append($"AllowedFileUploadExtensions:" + "\n");
    foreach (var fileExtension in assignment.AllowedFileUploadExtensions)
    {
      builder.Append($"- {fileExtension}" + "\n");
    }
    return builder.ToString();
  }
}
