using System.Threading.Tasks.Sources;
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

  public async Task Save(LocalCourse course, LocalCourse? previouslyStoredCourse)
  {
    var courseDirectory = $"{_basePath}/{course.Settings.Name}";
    if (!Directory.Exists(courseDirectory))
      Directory.CreateDirectory(courseDirectory);
    await saveSettings(course, courseDirectory);
    await saveModules(course, courseDirectory, previouslyStoredCourse);
  }

  private async Task saveModules(LocalCourse course, string courseDirectory, LocalCourse? previouslyStoredCourse)
  {
    foreach (var module in course.Modules)
    {
      var moduleDirectory = courseDirectory + "/" + module.Name;
      if (!Directory.Exists(moduleDirectory))
        Directory.CreateDirectory(moduleDirectory);

      await saveQuizzes(course, module, previouslyStoredCourse);
      await saveAssignments(course, module, previouslyStoredCourse);
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

  private async Task saveQuizzes(LocalCourse course, LocalModule module, LocalCourse? previouslyStoredCourse)
  {
    var quizzesDirectory = $"{_basePath}/{course.Settings.Name}/{module.Name}/quizzes";
    if (!Directory.Exists(quizzesDirectory))
      Directory.CreateDirectory(quizzesDirectory);


    foreach (var quiz in module.Quizzes)
    {

      var previousModule = previouslyStoredCourse?.Modules.FirstOrDefault(m => m.Name == module.Name);
      var previousQuiz = previousModule?.Quizzes.FirstOrDefault(q => q == quiz);

      if (previousQuiz == null)
      {
        var markdownPath = quizzesDirectory + "/" + quiz.Name + ".md"; ;
        var quizMarkdown = quiz.ToMarkdown();
        logger.Log("saving quiz " + markdownPath);
        await File.WriteAllTextAsync(markdownPath, quizMarkdown);
      }
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

  private async Task saveAssignments(LocalCourse course, LocalModule module, LocalCourse? previouslyStoredCourse)
  {
    var assignmentsDirectory = $"{_basePath}/{course.Settings.Name}/{module.Name}/assignments";
    if (!Directory.Exists(assignmentsDirectory))
      Directory.CreateDirectory(assignmentsDirectory);

    foreach (var assignment in module.Assignments)
    {

      var previousModule = previouslyStoredCourse?.Modules.FirstOrDefault(m => m.Name == module.Name);
      var previousAssignment = previousModule?.Assignments.FirstOrDefault(a => a == assignment);

      if (previousAssignment == null)
      {
        var assignmentMarkdown = assignment.ToMarkdown();

        var filePath = assignmentsDirectory + "/" + assignment.Name + ".md";
        logger.Log("saving assignment " + filePath);
        await File.WriteAllTextAsync(filePath, assignmentMarkdown);
      }
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