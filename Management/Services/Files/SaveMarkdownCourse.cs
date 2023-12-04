using LocalModels;
using Management.Services;

public class MarkdownCourseSaver
{
  private readonly MyLogger<MarkdownCourseSaver> logger;
  private readonly string _basePath;

  public MarkdownCourseSaver(MyLogger<MarkdownCourseSaver> logger)
  {
    this.logger = logger;
    _basePath = FileConfiguration.GetBasePath();
  }

  public async Task Save(LocalCourse course)
  {
    var courseDirectory = $"{_basePath}/{course.Settings.Name}";
    if (!Directory.Exists(courseDirectory))
      Directory.CreateDirectory(courseDirectory);
    await saveSettings(course, courseDirectory);
    await saveModules(course, courseDirectory);
  }

  private async Task saveModules(LocalCourse course, string courseDirectory)
  {
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

}