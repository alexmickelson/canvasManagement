using LocalModels;

public class AssignmentMarkdownTests
{
  [Test]
  public void TestCanParseAssignmentSettings()
  {
    var assignment = new LocalAssignment()
    {
      Name="test assignment",
      Description ="here is the description",
      // LockAtDueDate = false
    };
  }
}