using LocalModels;

public class CourseDifferencesDeletionsTests
{
  [Fact]
  public void SameModuleDoesNotGetDeleted()
  {
    LocalCourse oldCourse = new()
    {
      Settings = new() { },
      Modules = [
        new()
        {
          Name = "test module"
        }]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [
        new()
        {
          Name = "test module"
        }]
    };

    var differences = CourseDifferences.GetDeletedChanges(newCourse, oldCourse);

    differences.NamesOfModulesToDeleteCompletely.Should().BeEmpty();
  }
  [Fact]
  public void ChangedModule_OldOneGetsDeleted()
  {
    LocalCourse oldCourse = new()
    {
      Settings = new() { },
      Modules = [
        new()
        {
          Name = "test module"
        }
      ]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [
        new()
        {
          Name = "test module 2"
        }]
    };

    var differences = CourseDifferences.GetDeletedChanges(newCourse, oldCourse);

    differences.NamesOfModulesToDeleteCompletely.Count().Should().Be(1);
    differences.NamesOfModulesToDeleteCompletely.First().Should().Be("test module");
  }

  [Fact]
  public void newAssignmentNameGetsDeleted()
  {
    LocalCourse oldCourse = new()
    {
      Settings = new() { },
      Modules = [
        new()
        {
          Name = "test module",
          Assignments = [
            new()
            {
              Name = "test assignment"
            }
          ]
        }
      ]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [
        new()
        {
          Name = "test module",
          Assignments = [
            new()
            {
              Name = "test assignment changed name"
            }
          ]
        }]
    };

    var differences = CourseDifferences.GetDeletedChanges(newCourse, oldCourse);

    differences.NamesOfModulesToDeleteCompletely.Should().BeEmpty();
    differences.DeleteContentsOfModule.Count().Should().Be(1);
    differences.DeleteContentsOfModule.First().Assignments.Count().Should().Be(1);
    differences.DeleteContentsOfModule.First().Assignments.First().Name.Should().Be("test assignment");
  }
  [Fact]
  public void AssignmentsWithChangedDescriptionsDoNotGetDeleted()
  {
    LocalCourse oldCourse = new()
    {
      Settings = new() { },
      Modules = [
        new()
        {
          Name = "test module",
          Assignments = [
            new()
            {
              Name = "test assignment",
              Description = "test description",
            }
          ]
        }
      ]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [
        new()
        {
          Name = "test module",
          Assignments = [
            new()
            {
              Name = "test assignment",
              Description = "test description",
            }
          ]
        }]
    };

    var differences = CourseDifferences.GetDeletedChanges(newCourse, oldCourse);

    differences.DeleteContentsOfModule.Should().BeEmpty();
  }
  [Fact]
  public void CanDetectChangedAndUnchangedAssignments()
  {
    LocalCourse oldCourse = new()
    {
      Settings = new() { },
      Modules = [
        new()
        {
          Name = "test module",
          Assignments = [
            new()
            {
              Name = "test assignment",
              Description = "test description",
            },
            new()
            {
              Name = "test assignment 2",
              Description = "test description",
            }
          ]
        }
      ]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [
        new()
        {
          Name = "test module",
          Assignments = [
            new()
            {
              Name = "test assignment",
              Description = "test description",
            },
            new()
            {
              Name = "test assignment 2 changed",
              Description = "test description",
            }
          ]
        }]
    };

    var differences = CourseDifferences.GetDeletedChanges(newCourse, oldCourse);

    differences.DeleteContentsOfModule.Count().Should().Be(1);
    differences.DeleteContentsOfModule.First().Assignments.Count().Should().Be(1);
    differences.DeleteContentsOfModule.First().Assignments.First().Name.Should().Be("test assignment 2");
  }

  [Fact]
  public void ChangedQuizzesGetDeleted()
  {
    LocalCourse oldCourse = new()
    {
      Settings = new() { },
      Modules = [
        new()
        {
          Name = "test module",
          Quizzes = [
            new()
            {
              Name = "Test Quiz",
              Description = "test description"
            },
            new()
            {
              Name = "Test Quiz 2",
              Description = "test description"
            }
          ]
        }
      ]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [
        new()
        {
          Name = "test module",
          Quizzes = [
            new()
            {
              Name = "Test Quiz",
              Description = "test description"
            },
            new()
            {
              Name = "Test Quiz 3",
              Description = "test description"
            }
          ]
        }]
    };

    var differences = CourseDifferences.GetDeletedChanges(newCourse, oldCourse);

    differences.DeleteContentsOfModule.Count().Should().Be(1);
    differences.DeleteContentsOfModule.First().Quizzes.Count().Should().Be(1);
    differences.DeleteContentsOfModule.First().Quizzes.First().Name.Should().Be("Test Quiz 2");
  }

  [Fact]
  public void ChangedPagesGetDeleted()
  {
    LocalCourse oldCourse = new()
    {
      Settings = new() { },
      Modules = [
        new()
        {
          Name = "test module",
          Pages = [
            new()
            {
              Name = "Test Page",
              Text = "test contents"
            },
            new()
            {
              Name = "Test Page 2",
              Text = "test contents"
            },
          ]
        }
      ]
    };
    LocalCourse newCourse = oldCourse with
    {
      Modules = [
        new()
        {
          Name = "test module",
          Pages = [
            new()
            {
              Name = "Test Page",
              Text = "test contents"
            },
            new()
            {
              Name = "Test Page 3",
              Text = "test contents"
            },
          ]
        }]
    };

    var differences = CourseDifferences.GetDeletedChanges(newCourse, oldCourse);

    differences.DeleteContentsOfModule.Count().Should().Be(1);
    differences.DeleteContentsOfModule.First().Pages.Count().Should().Be(1);
    differences.DeleteContentsOfModule.First().Pages.First().Name.Should().Be("Test Page 2");
  }
}