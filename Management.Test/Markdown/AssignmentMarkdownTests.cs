using LocalModels;

public class AssignmentMarkdownTests
{
  [Fact]
  public void TestCanParseAssignmentSettings()
  {
    var assignment = new LocalAssignment()
    {
      Name = "test assignment",
      Description = "here is the description",
      DueAt = new DateTime(),
      LockAt = new DateTime(),
      SubmissionTypes = [AssignmentSubmissionType.ONLINE_UPLOAD],
      LocalAssignmentGroupName = "Final Project",
      Rubric = new List<RubricItem>() {
        new RubricItem() {Points = 4, Label="do task 1"},
        new RubricItem() {Points = 2, Label="do task 2"},
      }
    };

    var assignmentMarkdown = assignment.ToMarkdown();

    var parsedAssignment = LocalAssignment.ParseMarkdown(assignmentMarkdown);
    parsedAssignment.Should().BeEquivalentTo(assignment);
  }
  [Fact]
  public void AssignmentWithEmptyRubric_CanBeParsed()
  {
    var assignment = new LocalAssignment()
    {
      Name = "test assignment",
      Description = "here is the description",
      DueAt = new DateTime(),
      LockAt = new DateTime(),
      SubmissionTypes = [AssignmentSubmissionType.ONLINE_UPLOAD],
      LocalAssignmentGroupName = "Final Project",
      Rubric = new List<RubricItem>() { }
    };

    var assignmentMarkdown = assignment.ToMarkdown();

    var parsedAssignment = LocalAssignment.ParseMarkdown(assignmentMarkdown);
    parsedAssignment.Should().BeEquivalentTo(assignment);
  }
  [Fact]
  public void AssignmentWithEmptySubmissionTypes_CanBeParsed()
  {
    var assignment = new LocalAssignment()
    {
      Name = "test assignment",
      Description = "here is the description",
      DueAt = new DateTime(),
      LockAt = new DateTime(),
      SubmissionTypes = [],
      LocalAssignmentGroupName = "Final Project",
      Rubric = new List<RubricItem>() {
        new RubricItem() {Points = 4, Label="do task 1"},
        new RubricItem() {Points = 2, Label="do task 2"},
      }
    };

    var assignmentMarkdown = assignment.ToMarkdown();

    var parsedAssignment = LocalAssignment.ParseMarkdown(assignmentMarkdown);
    parsedAssignment.Should().BeEquivalentTo(assignment);
  }

  [Fact]
  public void AssignmentWithoutLockAtDate_CanBeParsed()
  {
    var assignment = new LocalAssignment()
    {
      Name = "test assignment",
      Description = "here is the description",
      DueAt = new DateTime(),
      LockAt = null,
      SubmissionTypes = [],
      LocalAssignmentGroupName = "Final Project",
      Rubric = new List<RubricItem>() {
        new RubricItem() {Points = 4, Label="do task 1"},
        new RubricItem() {Points = 2, Label="do task 2"},
      }
    };

    var assignmentMarkdown = assignment.ToMarkdown();

    var parsedAssignment = LocalAssignment.ParseMarkdown(assignmentMarkdown);
    parsedAssignment.Should().BeEquivalentTo(assignment);
  }

  [Fact]
  public void AssignmentWithoutDescription_CanBeParsed()
  {
    var assignment = new LocalAssignment()
    {
      Name = "test assignment",
      Description = "",
      DueAt = new DateTime(),
      LockAt = new DateTime(),
      SubmissionTypes = [],
      LocalAssignmentGroupName = "Final Project",
      Rubric = new List<RubricItem>() {
        new RubricItem() {Points = 4, Label="do task 1"},
        new RubricItem() {Points = 2, Label="do task 2"},
      }
    };

    var assignmentMarkdown = assignment.ToMarkdown();

    var parsedAssignment = LocalAssignment.ParseMarkdown(assignmentMarkdown);
    parsedAssignment.Should().BeEquivalentTo(assignment);
  }
  [Fact]
  public void Assignments_CanHaveThreeDashes()
  {
    var assignment = new LocalAssignment()
    {
      Name = "test assignment",
      Description = "test assignment\n---\nsomestuff",
      DueAt = new DateTime(),
      LockAt = new DateTime(),
      SubmissionTypes = [],
      LocalAssignmentGroupName = "Final Project",
      Rubric = new List<RubricItem>()
      {
      }
    };

    var assignmentMarkdown = assignment.ToMarkdown();

    var parsedAssignment = LocalAssignment.ParseMarkdown(assignmentMarkdown);
    parsedAssignment.Should().BeEquivalentTo(assignment);
  }
  [Fact]
  public void Assignments_CanRestrictUploadTypes()
  {
    var assignment = new LocalAssignment()
    {
      Name = "test assignment",
      Description = "here is the description",
      DueAt = new DateTime(),
      LockAt = new DateTime(),
      SubmissionTypes = [AssignmentSubmissionType.ONLINE_UPLOAD],
      AllowedFileUploadExtensions = ["pdf", "txt"],
      LocalAssignmentGroupName = "Final Project",
      Rubric = new List<RubricItem>() {}
    };

    var assignmentMarkdown = assignment.ToMarkdown();

    var parsedAssignment = LocalAssignment.ParseMarkdown(assignmentMarkdown);
    parsedAssignment.Should().BeEquivalentTo(assignment);
  }

}
