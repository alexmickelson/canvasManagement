using LocalModels;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

public class FileStorageManager
{
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

    var courseDirectory = $"../storage/{course.Settings.Name}";
    if (!Directory.Exists(courseDirectory))
      Directory.CreateDirectory(courseDirectory);

    await saveModules(course);

    await File.WriteAllTextAsync($"../storage/{course.Settings.Name}.yml", courseString);
  }

  private static async Task saveModules(LocalCourse course)
  {
    var courseDirectory = $"../storage/{course.Settings.Name}";

    await saveSettings(course, courseDirectory);
    foreach (var module in course.Modules)
    {
      var moduleDirectory = courseDirectory + "/" + module.Name;
      if (!Directory.Exists(moduleDirectory))
        Directory.CreateDirectory(moduleDirectory);

      await saveQuizzes(course, module);
      await saveAssignments(course, module);
    }

  }

  private static async Task saveSettings(LocalCourse course, string courseDirectory)
  {
    var settingsFilePath = courseDirectory + "/settings.yml"; ;
    var settingsYaml = course.Settings.ToYaml();
    await File.WriteAllTextAsync(settingsFilePath, settingsYaml);
  }

  private static async Task saveQuizzes(LocalCourse course, LocalModule module)
  {
    var quizzesDirectory = $"../storage/{course.Settings.Name}/{module.Name}/quizzes";
    if (!Directory.Exists(quizzesDirectory))
      Directory.CreateDirectory(quizzesDirectory);

    foreach (var quiz in module.Quizzes)
    {
      var markdownPath = quizzesDirectory + "/" + quiz.Name + ".md"; ;
      var quizMarkdown = quiz.ToMarkdown();
      await File.WriteAllTextAsync(markdownPath, quizMarkdown);
    }
  }

  private static async Task saveAssignments(LocalCourse course, LocalModule module)
  {
    var assignmentsDirectory = $"../storage/{course.Settings.Name}/{module.Name}/assignments";
    if (!Directory.Exists(assignmentsDirectory))
      Directory.CreateDirectory(assignmentsDirectory);

    foreach (var assignment in module.Assignments)
    {
      var assignmentYaml = assignment.ToYaml();
      var assignmentMarkdown =
        "```yaml" + Environment.NewLine
        + assignmentYaml
        + "```" + Environment.NewLine
        + "<!-- assignment markdown below -->" + Environment.NewLine
        + assignment.Description;

      var filePath = assignmentsDirectory + "/" + assignment.Name + ".md";
      await File.WriteAllTextAsync(filePath, assignmentMarkdown);
    }
  }

  public async Task<IEnumerable<LocalCourse>> LoadSavedCourses()
  {
    string path = "../storage/";
    if (!Directory.Exists(path))
      throw new Exception("storage folder not found");

    var fileNames = Directory.GetFiles(path);

    var courses = await Task.WhenAll(
      fileNames
        .Where(name => name.EndsWith(".yml"))
        .Select(async n => ParseCourse(await File.ReadAllTextAsync($"../storage/{n}")))
    );
    return courses;
  }
}
