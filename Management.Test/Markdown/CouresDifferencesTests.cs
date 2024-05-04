

using LocalModels;

public class CoursesDifferencesTests
{
  [Fact]
  public void CanDetectNewSettings()
  {
    LocalCourse oldCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = []
    };
    LocalCourse newCourse = new()
    {
      Settings = new() { Name = "new course name" },
      Modules = []
    };
    var differences = CourseDifferences.GetNewChanges(newCourse, oldCourse);

    differences.Modules.Should().BeEmpty();
    differences.Settings.Should().NotBeNull();
    differences.Settings?.Name.Should().Be("new course name");
  }

  [Fact]
  public void CanDetectNewModule()
  {

    LocalCourse oldCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = []
    };
    LocalCourse newCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = [
        new()
        {
          Name = "new module",
        }
      ]
    };
    var differences = CourseDifferences.GetNewChanges(newCourse, oldCourse);

    differences.Modules.Should().NotBeNull();
    differences.Modules?.Count().Should().Be(1);
    differences.Modules?.First().Name.Should().Be("new module");
  }

  [Fact]
  public void CanDetectChangedAssignment()
  {
    LocalCourse oldCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = [
        new()
        {
          Name = "new module",
          Assignments = [
            new()
            {
              Name = "test assignment",
              Description = "",
              DueAt = new DateTime(),
              SubmissionTypes = [],
              Rubric = []
            }
          ]
        }]
    };
    LocalCourse newCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = [
        new()
        {
          Name = "new module",
          Assignments = [
            new()
            {
              Name = "test assignment",
              Description = "new description",
              DueAt = new DateTime(),
              SubmissionTypes = [],
              Rubric = []
            }
          ]
        }
      ]
    };
    var differences = CourseDifferences.GetNewChanges(newCourse, oldCourse);

    differences.Modules.Should().NotBeNull();
    differences.Modules?.Count().Should().Be(1);
    differences.Modules?.First().Assignments.First().Description.Should().Be("new description");
  }
  
  [Fact]
  public void CanProperlyIgnoreUnchangedModules()
  {
    var commonDate = new DateTime();
    LocalCourse oldCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = [new()
        {
          Name = "new module",
          Assignments = [
            new()
            {
              Name = "test assignment",
              Description = "",
              DueAt = commonDate,
              SubmissionTypes = [],
              Rubric = []
            }
          ]
        }]
    };
    LocalCourse newCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = [new()
        {
          Name = "new module",
          Assignments = [
            new()
            {
              Name = "test assignment",
              Description = "",
              DueAt = commonDate,
              SubmissionTypes = [],
              Rubric = []
            }
          ]
        }]
    };
    var differences = CourseDifferences.GetNewChanges(newCourse, oldCourse);

    differences.Modules.Should().BeEmpty();
  }
  
  [Fact]
  public void OnlyChangedAssignmentRepresented()
  {
    var commonDate = new DateTime();
    LocalCourse oldCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = [new()
        {
          Name = "new module",
          Assignments = [
            new()
            {
              Name = "test assignment",
              Description = "",
              DueAt = commonDate,
              SubmissionTypes = [AssignmentSubmissionType.ONLINE_UPLOAD],
              Rubric = [ new() {Points = 1, Label = "rubric"} ],
            },
            new()
            {
              Name = "test assignment 2",
              Description = "",
              DueAt = commonDate,
              SubmissionTypes = [],
              Rubric = [],
            }
          ]
        }]
    };
    LocalCourse newCourse = oldCourse with {
      Modules = [
        new()
        {
          Name = "new module",
          Assignments = [
            new()
            {
              Name = "test assignment",
              Description = "",
              DueAt = commonDate,
              SubmissionTypes = [AssignmentSubmissionType.ONLINE_UPLOAD],
              Rubric = [ new() {Points = 1, Label = "rubric"} ],
            },
            new()
            {
              Name = "test assignment 2 with a new name",
              Description = "",
              DueAt = commonDate,
              SubmissionTypes = [],
              Rubric = []
            }
          ]
        }
      ]
    };
    var differences = CourseDifferences.GetNewChanges(newCourse, oldCourse);

    differences.Modules.First().Assignments.Count().Should().Be(1);
    differences.Modules.First().Assignments.First().Name.Should().Be("test assignment 2 with a new name");
  }
}