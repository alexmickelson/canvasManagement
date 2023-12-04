using LocalModels;
using Management.Services;
using YamlDotNet.Serialization;

public class FileStorageManager
{
  private readonly MyLogger<FileStorageManager> logger;
  private readonly CourseMarkdownLoader _courseMarkdownLoader;
  private readonly MarkdownCourseSaver _saveMarkdownCourse;
  private readonly string _basePath;

  public FileStorageManager(
    MyLogger<FileStorageManager> logger,
    CourseMarkdownLoader courseMarkdownLoader,
    MarkdownCourseSaver saveMarkdownCourse
  )
  {
    this.logger = logger;
    _courseMarkdownLoader = courseMarkdownLoader;
    _saveMarkdownCourse = saveMarkdownCourse;
    _basePath = FileConfiguration.GetBasePath();

    this.logger.Log("Using storage directory: " + _basePath);
    
  }

  // public string CourseToYaml(LocalCourse course)
  // {
  //   var serializer = new SerializerBuilder().DisableAliases().Build();

  //   var yaml = serializer.Serialize(course);

  //   return yaml;
  // }

  // public LocalCourse ParseCourse(string rawCourse)
  // {
  //   var deserializer = new DeserializerBuilder().IgnoreUnmatchedProperties().Build();

  //   var course = deserializer.Deserialize<LocalCourse>(rawCourse);
  //   return course;
  // }

  public async Task SaveCourseAsync(LocalCourse course)
  {
    // var courseString = CourseToYaml(course);
    // await File.WriteAllTextAsync($"{_basePath}/{course.Settings.Name}.yml", courseString);

    await _saveMarkdownCourse.Save(course);
  }


  public async Task<IEnumerable<LocalCourse>> LoadSavedCourses()
  {

    // var fileNames = Directory.GetFiles(_basePath);

    // var courses = await Task.WhenAll(
    //   fileNames
    //     .Where(name => name.EndsWith(".yml"))
    //     .Select(async n => ParseCourse(await File.ReadAllTextAsync(n)))
    // );
    // return courses;
    return await LoadSavedMarkdownCourses();
  }

  public async Task<IEnumerable<LocalCourse>> LoadSavedMarkdownCourses()
  {
    return await _courseMarkdownLoader.LoadSavedMarkdownCourses();
  }

}