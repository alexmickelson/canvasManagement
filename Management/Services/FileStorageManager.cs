using LocalModels;
using Management.Services;
using YamlDotNet.Serialization;

public class FileStorageManager
{
  private readonly MyLogger<FileStorageManager> logger;
  private static readonly string _basePath = "../storage";

  public FileStorageManager(MyLogger<FileStorageManager> logger)
  {
    if (!Directory.Exists(_basePath))
      throw new Exception("storage folder not found");
    this.logger = logger;
  }
  public string CourseToYaml(LocalCourse course)
  {
    var serializer = new SerializerBuilder().DisableAliases().Build();

    var yaml = serializer.Serialize(course);

    return yaml;
  }

  public LocalCourse ParseCourse(string rawCourse)
  {
    var deserializer = new DeserializerBuilder().IgnoreUnmatchedProperties().Build();

    var course = deserializer.Deserialize<LocalCourse>(rawCourse);
    return course;
  }

  public async Task SaveCourseAsync(LocalCourse course)
  {
    var courseString = CourseToYaml(course);

    var courseDirectory = $"{_basePath}/{course.Settings.Name}";
    if (!Directory.Exists(courseDirectory))
      Directory.CreateDirectory(courseDirectory);

    await saveModules(course);

    await File.WriteAllTextAsync($"{_basePath}/{course.Settings.Name}.yml", courseString);
  }

  private async Task saveModules(LocalCourse course)
  {
    var courseDirectory = $"{_basePath}/{course.Settings.Name}";

    await saveSettings(course, courseDirectory);
    foreach (var module in course.Modules)
    {
      var moduleDirectory = courseDirectory + "/" + module.Name;
      if (!Directory.Exists(moduleDirectory))
        Directory.CreateDirectory(moduleDirectory);

      await saveQuizzes(course, module);
      await saveAssignments(course, module);
    }

    var moduleNames = course.Modules.Select(m => m.Name);
    foreach (var moduleDirectoryPath in Directory.EnumerateDirectories(courseDirectory))
    {
      var directoryName = Path.GetFileName(moduleDirectoryPath);
      if (!moduleNames.Contains(directoryName))
      {
        Console.WriteLine($"deleting extra module directory, it was probably renamed {moduleDirectoryPath}");
        Directory.Delete(moduleDirectoryPath, true);
      }
    }
  }

  private static async Task saveSettings(LocalCourse course, string courseDirectory)
  {
    var settingsFilePath = courseDirectory + "/settings.yml"; ;
    var settingsYaml = course.Settings.ToYaml();
    await File.WriteAllTextAsync(settingsFilePath, settingsYaml);
  }

  private async Task saveQuizzes(LocalCourse course, LocalModule module)
  {
    var quizzesDirectory = $"{_basePath}/{course.Settings.Name}/{module.Name}/quizzes";
    if (!Directory.Exists(quizzesDirectory))
      Directory.CreateDirectory(quizzesDirectory);


    foreach (var quiz in module.Quizzes)
    {
      var markdownPath = quizzesDirectory + "/" + quiz.Name + ".md"; ;
      var quizMarkdown = quiz.ToMarkdown();
      await File.WriteAllTextAsync(markdownPath, quizMarkdown);
    }
    removeOldQuizzes(quizzesDirectory, module);
  }

  private void removeOldQuizzes(string path, LocalModule module)
  {
    var existingFiles = Directory.EnumerateFiles(path);

    var filesToDelete = existingFiles.Where((f) =>
    {
      foreach (var quiz in module.Quizzes)
      {
        var markdownPath = path + "/" + quiz.Name + ".md";
        if (f == markdownPath)
          return false;
      }
      return true;
    });

    foreach (var file in filesToDelete)
    {
      logger.Log($"removing old quiz, it has probably been renamed {file}");
      File.Delete(file);
    }

  }

  private async Task saveAssignments(LocalCourse course, LocalModule module)
  {
    var assignmentsDirectory = $"{_basePath}/{course.Settings.Name}/{module.Name}/assignments";
    if (!Directory.Exists(assignmentsDirectory))
      Directory.CreateDirectory(assignmentsDirectory);

    foreach (var assignment in module.Assignments)
    {
      var assignmentMarkdown = assignment.ToMarkdown();

      var filePath = assignmentsDirectory + "/" + assignment.Name + ".md";
      await File.WriteAllTextAsync(filePath, assignmentMarkdown);
    }
    removeOldAssignments(assignmentsDirectory, module);
  }
  private void removeOldAssignments(string path, LocalModule module)
  {
    var existingFiles = Directory.EnumerateFiles(path);

    var filesToDelete = existingFiles.Where((f) =>
    {
      foreach (var assignment in module.Assignments)
      {
        var markdownPath = path + "/" + assignment.Name + ".md";
        if (f == markdownPath)
          return false;
      }
      return true;
    });

    foreach (var file in filesToDelete)
    {
      logger.Log($"removing old assignment, it has probably been renamed {file}");
      File.Delete(file);
    }
  }

  public async Task<IEnumerable<LocalCourse>> LoadSavedCourses()
  {

    var fileNames = Directory.GetFiles(_basePath);

    var courses = await Task.WhenAll(
      fileNames
        .Where(name => name.EndsWith(".yml"))
        .Select(async n => ParseCourse(await File.ReadAllTextAsync($"{_basePath}/{n}")))
    );
    return courses;
  }

  // public async Task<LocalCourse> LoadCourseByName(string courseName)
  // {
  //   var courseDirectory = $"{_basePath}/{courseName}";
  //   if (!Directory.Exists(courseDirectory))
  //   {
  //     var errorMessage = $"error loading course by name, could not find folder {courseDirectory}";
  //     logger.Log(errorMessage);
  //     throw new LoadCourseFromFileException(errorMessage);
  //   }
  //   var settingsPath = $"{courseDirectory}/settings.yml";
  //   if (!Directory.Exists(settingsPath))
  //   {
  //     var errorMessage = $"error loading course by name, settings file {settingsPath}";
  //     logger.Log(errorMessage);
  //     throw new LoadCourseFromFileException(errorMessage);
  //   }

  //   var settingsString = await File.ReadAllTextAsync(settingsPath);
  //   var settings = LocalCourseSettings.ParseYaml(settingsString);

  //   var modulePaths = Directory.GetDirectories(courseDirectory);
  //   var modules = modulePaths
  //     .Select(LoadModuleFromPath)
  //     .ToArray();

  // }

  // public async Task<LocalModule> LoadModuleFromPath(string modulePath)
  // {
  //   var assignmentsPath = $"{modulePath}/assignments";
  //   if (!Directory.Exists(assignmentsPath))
  //   {
  //     var errorMessage = $"error loading course by name, assignments folder does not exist in {modulePath}";
  //     logger.Log(errorMessage);
  //     throw new LoadCourseFromFileException(errorMessage);
  //   }

  //   var quizzesPath = $"{modulePath}/quizzes";
  //   if (!Directory.Exists(quizzesPath))
  //   {
  //     var errorMessage = $"error loading course by name, quizzes folder does not exist in {modulePath}";
  //     logger.Log(errorMessage);
  //     throw new LoadCourseFromFileException(errorMessage);
  //   }


  //   var assignments = LoadAssignmentsFromPath(assignmentsPath);
  //   var quizzes = LoadQuizzesFromPath(quizzesPath);


  // }
  // public async Task<IEnumerable<LocalAssignment>> LoadAssignmentsFromPath(string assignmentsFolder)
  // {

  // }
  // public async Task<IEnumerable<LocalAssignment>> LoadQuizzesFromPath(string quizzesFolder)
  // {

  // }
}


public class LoadCourseFromFileException(string message) : Exception(message)
{
}