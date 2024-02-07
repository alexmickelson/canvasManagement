
namespace LocalModels;
public class RubricMarkdownParseException : Exception
{
  public RubricMarkdownParseException(string message) : base(message) { }
}
public class AssignmentMarkdownParseException : Exception
{
  public AssignmentMarkdownParseException(string message) : base(message) { }
}
