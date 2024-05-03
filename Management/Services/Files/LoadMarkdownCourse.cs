using LocalModels;
using Management.Services;

public class CourseMarkdownLoader
{
  private readonly MyLogger<CourseMarkdownLoader> logger;
  private readonly string _basePath;

  public CourseMarkdownLoader(MyLogger<CourseMarkdownLoader> logger, FileConfiguration fileConfig)
  {
    this.logger = logger;
    _basePath = fileConfig.GetBasePath();
  }

  public async Task<IEnumerable<LocalCourse>> LoadSavedCourses()
  {
    var courseDirectories = Directory.GetDirectories(_basePath);

    var courses = await Task.WhenAll(
      courseDirectories
        .Where(d =>
        {
          var settingsPath = $"{d}/settings.yml";
          return File.Exists(settingsPath);
        })
        .Select(async d => await LoadCourseByPath(d))
    );
    return courses.OrderBy(c => c.Settings.Name);
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

    return new()
    {
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

    var folderName = Path.GetFileName(courseDirectory);
    return settings with { Name = folderName };
  }

  private async Task<IEnumerable<LocalModule>> loadCourseModules(string courseDirectory)
  {
    var modulePaths = Directory.GetDirectories(courseDirectory);
    var modules = await Task.WhenAll(
      modulePaths
        .Select(loadModuleFromPath)
    );
    return modules.OrderBy(m => m.Name);
  }

  private async Task<LocalModule> loadModuleFromPath(string modulePath)
  {
    var moduleName = Path.GetFileName(modulePath);
    var assignments = await loadAssignmentsFromPath(modulePath);
    var quizzes = await loadQuizzesFromPath(modulePath);
    var pages = await loadPagesFromPath(modulePath);

    return new LocalModule()
    {
      Name = moduleName,
      Assignments = assignments,
      Quizzes = quizzes,
      Pages = pages,
    };
  }

  private async Task<IEnumerable<LocalAssignment>> loadAssignmentsFromPath(string modulePath)
  {
    var assignmentsPath = $"{modulePath}/assignments";
    if (!Directory.Exists(assignmentsPath))
    {
      logger.Log($"error loading course by name, assignments folder does not exist in {modulePath}");
      Directory.CreateDirectory(assignmentsPath);
    }

    var assignmentFiles = Directory.GetFiles(assignmentsPath);
    var assignmentPromises = assignmentFiles
      .Select(async filePath =>
      {
        var rawFile = (await File.ReadAllTextAsync(filePath)).Replace("\r\n", "\n");
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
      logger.Log($"quizzes folder does not exist in {modulePath}, creating now");
      Directory.CreateDirectory(quizzesPath);
    }

    var quizFiles = Directory.GetFiles(quizzesPath);
    var quizPromises = quizFiles
      .Select(async path =>
      {
        var rawQuiz = (await File.ReadAllTextAsync(path)).Replace("\r\n", "\n");
        return LocalQuiz.ParseMarkdown(rawQuiz);
      });

    return await Task.WhenAll(quizPromises);
  }
  private async Task<IEnumerable<LocalCoursePage>> loadPagesFromPath(string modulePath)
  {
    using var activity = DiagnosticsConfig.Source?.StartActivity("loading Pages from path");
    var pagesPath = $"{modulePath}/pages";
    if (!Directory.Exists(pagesPath))
    {
      logger.Log($"pages folder does not exist in {modulePath}, creating now");
      Directory.CreateDirectory(pagesPath);
    }

    var pageFiles = Directory.GetFiles(pagesPath);
    var pagePromises = pageFiles
      .Select(async path =>
      {
        var rawPage = (await File.ReadAllTextAsync(path)).Replace("\r\n", "\n");
        return LocalCoursePage.ParseMarkdown(rawPage);
      });

    return await Task.WhenAll(pagePromises);
  }
}
