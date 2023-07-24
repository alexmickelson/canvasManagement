using LocalModels;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

public class YamlManager
{
  public string CourseToYaml(LocalCourse course)
  {
    var serializer = new SerializerBuilder().Build();
    var yaml = serializer.Serialize(course);

    // System.Console.WriteLine(yaml);
    return yaml;
  }

  public LocalCourse ParseCourse(string rawCourse)
  {
    var deserializer = new DeserializerBuilder().Build();

    var person = deserializer.Deserialize<LocalCourse>(rawCourse);
    return person;
  }

  public async Task SaveCourseAsync(LocalCourse course)
  {
    var courseString = CourseToYaml(course);

    await File.WriteAllTextAsync($"../storage/{course.Name}.yml", courseString);
  }

  public void SaveCourse(LocalCourse course)
  {
    var courseString = CourseToYaml(course);

    File.WriteAllText($"../storage/{course.Name}.yml", courseString);
  }

  public async Task<IEnumerable<LocalCourse>> LoadSavedCourses()
  {
    string path = "../storage/";
    if (!Directory.Exists(path))
      throw new Exception("storage folder not found");

    var fileNames = Directory.GetFiles(path);

    var courses = await Task.WhenAll(
      fileNames.Select(async n => ParseCourse(await File.ReadAllTextAsync($"../storage/{n}")))
    );
    return courses;
  }
}
