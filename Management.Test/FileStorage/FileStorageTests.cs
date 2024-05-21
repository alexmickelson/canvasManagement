using System.Configuration;
using LocalModels;
using Management.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;

public class FileStorageTests
{
  private FileStorageService fileManager { get; set; }

  public FileStorageTests()
  {
    var tempDirectory = Path.GetTempPath();
    var storageDirectory = tempDirectory + "fileStorageTests";
    Console.WriteLine(storageDirectory);
    if (!Directory.Exists(storageDirectory))
      Directory.CreateDirectory(storageDirectory);
    else
    {
      var dirInfo = new DirectoryInfo(storageDirectory);

      foreach (var file in dirInfo.GetFiles())
        file.Delete();
      foreach (var dir in dirInfo.GetDirectories())
        dir.Delete(true);
    }

    var fileManagerLogger = new MyLogger<FileStorageService>(NullLogger<FileStorageService>.Instance);
    var markdownLoaderLogger = new MyLogger<CourseMarkdownLoader>(NullLogger<CourseMarkdownLoader>.Instance);
    var markdownSaverLogger = new MyLogger<MarkdownCourseSaver>(NullLogger<MarkdownCourseSaver>.Instance);
    var otherLogger = NullLoggerFactory.Instance.CreateLogger<FileStorageService>();
    Environment.SetEnvironmentVariable("storageDirectory", storageDirectory);
    var config = new ConfigurationBuilder()
      .AddEnvironmentVariables()
      .Build();
    var fileConfiguration = new FileConfiguration(config);

    var markdownLoader = new CourseMarkdownLoader(markdownLoaderLogger, fileConfiguration);
    var markdownSaver = new MarkdownCourseSaver(markdownSaverLogger, fileConfiguration);
    fileManager = new FileStorageService(fileManagerLogger, markdownLoader, markdownSaver, otherLogger, fileConfiguration);
  }

  [Fact]
  public async Task EmptyCourse_CanBeSavedAndLoaded()
  {
    LocalCourse testCourse = new LocalCourse
    {
      Settings = new() { Name = "test empty course" },
      Modules = []
    };

    await fileManager.SaveCourseAsync(testCourse, null);

    var loadedCourses = await fileManager.LoadSavedCourses();
    var loadedCourse = loadedCourses.First(c => c.Settings.Name == testCourse.Settings.Name);

    loadedCourse.Should().BeEquivalentTo(testCourse);
  }

  [Fact]
  public async Task CourseSettings_CanBeSavedAndLoaded()
  {
    LocalCourse testCourse = new()
    {
      Settings = new()
      {
        AssignmentGroups = [],
        Name = "Test Course with settings",
        DaysOfWeek = [DayOfWeek.Monday, DayOfWeek.Wednesday],
        StartDate = new DateTime(),
        EndDate = new DateTime(),
        DefaultDueTime = new() { Hour = 1, Minute = 59 },
      },
      Modules = []
    };

    await fileManager.SaveCourseAsync(testCourse, null);

    var loadedCourses = await fileManager.LoadSavedCourses();
    var loadedCourse = loadedCourses.First(c => c.Settings.Name == testCourse.Settings.Name);

    loadedCourse.Settings.Should().BeEquivalentTo(testCourse.Settings);
  }


  [Fact]
  public async Task EmptyCourseModules_CanBeSavedAndLoaded()
  {
    LocalCourse testCourse = new()
    {
      Settings = new() { Name = "Test Course with modules" },
      Modules = [
        new()
        {
          Name = "test module 1",
          Assignments = [],
          Quizzes = []
        }
      ]
    };

    await fileManager.SaveCourseAsync(testCourse, null);

    var loadedCourses = await fileManager.LoadSavedCourses();
    var loadedCourse = loadedCourses.First(c => c.Settings.Name == testCourse.Settings.Name);

    loadedCourse.Modules.Should().BeEquivalentTo(testCourse.Modules);
  }

  [Fact]
  public async Task CourseModules_WithAssignments_CanBeSavedAndLoaded()
  {
    LocalCourse testCourse = new()
    {
      Settings = new() { Name = "Test Course with modules and assignments" },
      Modules = [
        new()
        {
          Name = "test module 1 with assignments",
          Assignments = [
            new()
            {
              Name = "test assignment",
              Description = "here is the description",
              DueAt = new DateTime(),
              LockAt = new DateTime(),
              SubmissionTypes = [AssignmentSubmissionType.ONLINE_UPLOAD],
              LocalAssignmentGroupName = "Final Project",
              Rubric = [
                new() { Points = 4, Label = "do task 1" },
                new() { Points = 2, Label = "do task 2" },
              ]
            }
          ],
          Quizzes = []
        }
      ]
    };

    await fileManager.SaveCourseAsync(testCourse, null);

    var loadedCourses = await fileManager.LoadSavedCourses();
    var loadedCourse = loadedCourses.First(c => c.Settings.Name == testCourse.Settings.Name);

    var actualAssignments = loadedCourse.Modules.First().Assignments;
    var expectedAssignments = testCourse.Modules.First().Assignments;
    actualAssignments.Should().BeEquivalentTo(expectedAssignments);
  }


  [Fact]
  public async Task CourseModules_WithQuizzes_CanBeSavedAndLoaded()
  {
    LocalCourse testCourse = new()
    {
      Settings = new() { Name = "Test Course with modules and quiz" },
      Modules = [
        new()
        {
          Name = "test module 1 with quiz",
          Assignments = [],
          Quizzes = [
            new()
            {
              Name = "Test Quiz",
              Description = "quiz description",
              LockAt = new DateTime(2022, 10, 3, 12, 5, 0),
              DueAt = new DateTime(2022, 10, 3, 12, 5, 0),
              ShuffleAnswers = true,
              OneQuestionAtATime = true,
              LocalAssignmentGroupName = "Assignments",
              Questions = [
                new()
                {
                  Text = "test essay",
                  QuestionType = QuestionType.ESSAY,
                  Points = 1
                }
              ]
            }
          ]
        }
      ]
    };

    await fileManager.SaveCourseAsync(testCourse, null);

    var loadedCourses = await fileManager.LoadSavedCourses();
    var loadedCourse = loadedCourses.First(c => c.Settings.Name == testCourse.Settings.Name);

    loadedCourse.Modules.First().Quizzes.Should().BeEquivalentTo(testCourse.Modules.First().Quizzes);
  }


  [Fact]
  public async Task MarkdownStorage_FullyPopulated_DoesNotLoseData()
  {
    LocalCourse testCourse = new()
    {
      Settings = new()
      {
        AssignmentGroups = [],
        Name = "Test Course with lots of data",
        DaysOfWeek = [DayOfWeek.Monday, DayOfWeek.Wednesday],
        StartDate = new DateTime(),
        EndDate = new DateTime(),
        DefaultDueTime = new() { Hour = 1, Minute = 59 },
      },
      Modules = [
        new()
        {
          Name = "new test module",
          Assignments = [
            new()
            {
              Name = "test assignment",
              Description = "here is the description",
              DueAt = new DateTime(),
              LockAt = new DateTime(),
              SubmissionTypes = [AssignmentSubmissionType.ONLINE_UPLOAD],
              LocalAssignmentGroupName = "Final Project",
              Rubric = [
                new() { Points = 4, Label = "do task 1" },
                new() { Points = 2, Label = "do task 2" },
              ]
            }
          ],
          Quizzes = [
            new()
            {
              Name = "Test Quiz",
              Description = "quiz description",
              LockAt = new DateTime(),
              DueAt = new DateTime(),
              ShuffleAnswers = true,
              OneQuestionAtATime = false,
              LocalAssignmentGroupName = "someId",
              AllowedAttempts = -1,
              Questions = [
                new()
                {
                  Text = "test short answer",
                  QuestionType = QuestionType.SHORT_ANSWER,
                  Points = 1
                }
              ]
            }
          ]
        }
      ]
    };

    await fileManager.SaveCourseAsync(testCourse, null);

    var loadedCourses = await fileManager.LoadSavedCourses();
    var loadedCourse = loadedCourses.First(c => c.Settings.Name == testCourse.Settings.Name);

    loadedCourse.Should().BeEquivalentTo(testCourse);
  }


  [Fact]
  public async Task MarkdownStorage_CanPersistPages()
  {
    LocalCourse testCourse = new()
    {
      Settings = new()
      {
        AssignmentGroups = [],
        Name = "Test Course with page",
        DaysOfWeek = [DayOfWeek.Monday, DayOfWeek.Wednesday],
        StartDate = new DateTime(),
        EndDate = new DateTime(),
        DefaultDueTime = new() { Hour = 1, Minute = 59 },
      },
      Modules = [
        new()
        {
          Name = "page test module",
          Pages = [
            new()
            {
              Name = "test page persistence",
              DueAt = new DateTime(),
              Text = "this is some\n## markdown\n"
            }
          ]
        }
      ]
    };

    await fileManager.SaveCourseAsync(testCourse, null);

    var loadedCourses = await fileManager.LoadSavedCourses();
    var loadedCourse = loadedCourses.First(c => c.Settings.Name == testCourse.Settings.Name);

    loadedCourse.Should().BeEquivalentTo(testCourse);
  }
}
