

using LocalModels;

public class CouresDifferencesChangesTests
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
    LocalCourse newCourse = oldCourse with
    {
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

  [Fact]
  public void IdenticalQuizzesIgnored()
  {
    var commonDate = new DateTime();
    LocalCourse oldCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = [new(){
        Name = "new module",
        Assignments = [],
        Quizzes = [
          new()
          {
            Name = "Test Quiz",
            Description = @"this is my description ",
            LockAt = commonDate,
            DueAt = commonDate,
            ShuffleAnswers = true,
            OneQuestionAtATime = false,
            LocalAssignmentGroupName = "someId",
            AllowedAttempts = -1,
            Questions = []
          }
        ]
      }]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [new(){
        Name = "new module",
        Assignments = [],
        Quizzes = [
          new()
          {
            Name = "Test Quiz",
            Description = @"this is my description ",
            LockAt = commonDate,
            DueAt = commonDate,
            ShuffleAnswers = true,
            OneQuestionAtATime = false,
            LocalAssignmentGroupName = "someId",
            AllowedAttempts = -1,
            Questions = []
          }
        ]
      }]
    };

    var differences = CourseDifferences.GetNewChanges(newCourse, oldCourse);
    differences.Modules.Count().Should().Be(0);
  }

  [Fact]
  public void CanDetectDifferentQuiz()
  {
    var commonDate = new DateTime();
    LocalCourse oldCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = [new(){
        Name = "new module",
        Assignments = [],
        Quizzes = [
          new()
          {
            Name = "Test Quiz",
            Description = @"this is my description ",
            LockAt = commonDate,
            DueAt = commonDate,
            ShuffleAnswers = true,
            OneQuestionAtATime = false,
            LocalAssignmentGroupName = "someId",
            AllowedAttempts = -1,
            Questions = []
          }
        ]
      }]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [new(){
        Name = "new module",
        Assignments = [],
        Quizzes = [
          new()
          {
            Name = "Test Quiz",
            Description = @"this is my description ",
            LockAt = DateTime.MaxValue,
            DueAt = commonDate,
            ShuffleAnswers = true,
            OneQuestionAtATime = false,
            LocalAssignmentGroupName = "someId",
            AllowedAttempts = -1,
            Questions = []
          }
        ]
      }]
    };

    var differences = CourseDifferences.GetNewChanges(newCourse, oldCourse);
    differences.Modules.Count().Should().Be(1);
    differences.Modules.First().Quizzes.Count().Should().Be(1);
    differences.Modules.First().Quizzes.First().LockAt.Should().Be(DateTime.MaxValue);
  }

  [Fact]
  public void CanDetectOnlyDifferentQuiz_WhenOtherQuizzesStay()
  {
    var commonDate = new DateTime();
    LocalCourse oldCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = [new(){
        Name = "new module",
        Assignments = [],
        Quizzes = [
          new()
          {
            Name = "Test Quiz",
            Description = @"this is my description ",
            LockAt = commonDate,
            DueAt = commonDate,
            ShuffleAnswers = true,
            OneQuestionAtATime = false,
            LocalAssignmentGroupName = "someId",
            AllowedAttempts = -1,
            Questions = []
          }
        ]
      }]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [new(){
        Name = "new module",
        Assignments = [],
        Quizzes = [
          new()
          {
            Name = "Test Quiz",
            Description = @"this is my description ",
            LockAt = commonDate,
            DueAt = commonDate,
            ShuffleAnswers = true,
            OneQuestionAtATime = false,
            LocalAssignmentGroupName = "someId",
            AllowedAttempts = -1,
            Questions = []
          },
          new()
          {
            Name = "Test Quiz 2",
            Description = @"this is my description ",
            LockAt = commonDate,
            DueAt = commonDate,
            ShuffleAnswers = true,
            OneQuestionAtATime = false,
            LocalAssignmentGroupName = "someId",
            AllowedAttempts = -1,
            Questions = []
          }
        ]
      }]
    };

    var differences = CourseDifferences.GetNewChanges(newCourse, oldCourse);
    differences.Modules.Count().Should().Be(1);
    differences.Modules.First().Quizzes.Count().Should().Be(1);
    differences.Modules.First().Quizzes.First().Name.Should().Be("Test Quiz 2");
  }

  [Fact]
  public void SamePagesNotDetected()
  {

    var commonDate = new DateTime();
    LocalCourse oldCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = [new(){
        Name = "new module",
        Pages = [
          new()
          {
            Name= "test page",
            Text = "test description",
            DueAt = commonDate
          }
        ]
      }]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [
        new(){
          Name = "new module",
          Pages = [
            new()
            {
              Name= "test page",
              Text = "test description",
              DueAt = commonDate
            }
          ]
        }
      ]
    };

    var differences = CourseDifferences.GetNewChanges(newCourse, oldCourse);
    differences.Modules.Count().Should().Be(0);
  }

  [Fact]
  public void DifferentPageDetected()
  {

    var commonDate = new DateTime();
    LocalCourse oldCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = [new(){
        Name = "new module",
        Pages = [
          new()
          {
            Name= "test page",
            Text = "test description",
            DueAt = commonDate
          }
        ]
      }]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [
        new(){
          Name = "new module",
          Pages = [
            new()
            {
              Name= "test page",
              Text = "test description changed",
              DueAt = commonDate
            }
          ]
        }
      ]
    };

    var differences = CourseDifferences.GetNewChanges(newCourse, oldCourse);
    differences.Modules.Count().Should().Be(1);
    differences.Modules.First().Pages.Count().Should().Be(1);
    differences.Modules.First().Pages.First().Text.Should().Be("test description changed");
  }

  [Fact]
  public void DifferentPageDetected_ButNotSamePage()
  {

    var commonDate = new DateTime();
    LocalCourse oldCourse = new()
    {
      Settings = new() { Name = "Test Course" },
      Modules = [new(){
        Name = "new module",
        Pages = [
          new()
          {
            Name= "test page",
            Text = "test description",
            DueAt = commonDate
          }
        ]
      }]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [
        new(){
          Name = "new module",
          Pages = [
            new()
            {
              Name= "test page",
              Text = "test description",
              DueAt = commonDate
            },
            new()
            {
              Name= "test page 2",
              Text = "test description",
              DueAt = commonDate
            }
          ]
        }
      ]
    };

    var differences = CourseDifferences.GetNewChanges(newCourse, oldCourse);
    differences.Modules.Count().Should().Be(1);
    differences.Modules.First().Pages.Count().Should().Be(1);
    differences.Modules.First().Pages.First().Name.Should().Be("test page 2");
  }

}