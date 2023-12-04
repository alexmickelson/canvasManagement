using LocalModels;
using Management.Services;

public class CourseMarkdownLoader
{
  private readonly MyLogger<CourseMarkdownLoader> logger;
  private readonly string _basePath;

  public CourseMarkdownLoader(MyLogger<CourseMarkdownLoader> logger)
  {
    this.logger = logger;
    _basePath = FileConfiguration.GetBasePath();
  }

  public async Task<IEnumerable<LocalCourse>> LoadSavedMarkdownCourses()
  {
    var courseDirectories = Directory.GetDirectories(_basePath);

    var courses = await Task.WhenAll(
      courseDirectories.Select(async n => await LoadCourseByPath(n))
    );
    return courses;
  }

  public async Task<LocalCourse> LoadCourseByPath(string courseDirectory)
  {
    if (!Directory.Exists(courseDirectory))
    {
      var errorMessage = $"error loading course by name, could not find folder {courseDirectory}";
      logger.Log(errorMessage);
      throw new LoadCourseFromFileException(errorMessage);
    }

    LocalCourseSettings settings = await loadCourseSettings(courseDirectory);
    var modules = await loadCourseModules(courseDirectory);

    return new() {
      Settings = settings,
      Modules = modules
    };
  }

  private async Task<LocalCourseSettings> loadCourseSettings(string courseDirectory)
  {
    var settingsPath = $"{courseDirectory}/settings.yml";
    if (!File.Exists(settingsPath))
    {
      var errorMessage = $"error loading course by name, settings file {settingsPath}";
      logger.Log(errorMessage);
      throw new LoadCourseFromFileException(errorMessage);
    }

    var settingsString = await File.ReadAllTextAsync(settingsPath);
    var settings = LocalCourseSettings.ParseYaml(settingsString);
    return settings;
  }

  private async Task<IEnumerable<LocalModule>> loadCourseModules(string courseDirectory)
  {
    var modulePaths = Directory.GetDirectories(courseDirectory);
    var modules = await Task.WhenAll(
      modulePaths
        .Select(loadModuleFromPath)
    );
    return modules;
  }

  private async Task<LocalModule> loadModuleFromPath(string modulePath)
  {
    var moduleName = Path.GetFileName(modulePath);
    var assignments = await loadAssignmentsFromPath(modulePath);
    var quizzes = await loadQuizzesFromPath(modulePath);

    return new LocalModule()
    {
      Name = moduleName,
      Assignments = assignments,
      Quizzes = quizzes,
    };
  }

  private async Task<IEnumerable<LocalAssignment>> loadAssignmentsFromPath(string modulePath)
  {
    var assignmentsPath = $"{modulePath}/assignments";
    if (!Directory.Exists(assignmentsPath))
    {
      var errorMessage = $"error loading course by name, assignments folder does not exist in {modulePath}";
      logger.Log(errorMessage);
      throw new LoadCourseFromFileException(errorMessage);
    }
    var assignmentFiles = Directory.GetFiles(assignmentsPath);
    var assignmentPromises = assignmentFiles
      .Select(async filePath =>
      {
        var rawFile = await File.ReadAllTextAsync(filePath);
        return LocalAssignment.ParseMarkdown(rawFile);
      })
      .ToArray();
    return await Task.WhenAll(assignmentPromises);
  }

  private async Task<IEnumerable<LocalQuiz>> loadQuizzesFromPath(string modulePath)
  {
    var quizzesPath = $"{modulePath}/quizzes";
    if (!Directory.Exists(quizzesPath))
    {
      var errorMessage = $"error loading course by name, quizzes folder does not exist in {modulePath}";
      logger.Log(errorMessage);
      throw new LoadCourseFromFileException(errorMessage);
    }

    var quizFiles = Directory.GetFiles(quizzesPath);
    var quizPromises = quizFiles
      .Select(async path =>
      {
        var rawQuiz = await File.ReadAllTextAsync(path);
        return LocalQuiz.ParseMarkdown(rawQuiz);
      });

    return await Task.WhenAll(quizPromises);
  }
}