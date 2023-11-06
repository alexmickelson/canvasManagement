using YamlDotNet.Serialization;

namespace LocalModels;

public record LocalCourse
{
  public IEnumerable<LocalModule> Modules { get; init; } = Enumerable.Empty<LocalModule>();
  public LocalCourseSettings Settings { get; set; }
}

public record LocalCourseSettings
{
  public IEnumerable<LocalAssignmentGroup> AssignmentGroups { get; init; } =
      Enumerable.Empty<LocalAssignmentGroup>();
  public string Name { get; init; } = string.Empty;
  public IEnumerable<DayOfWeek> DaysOfWeek { get; init; } = Enumerable.Empty<DayOfWeek>();
  public ulong? CanvasId { get; init; }
  public DateTime StartDate { get; init; }
  public DateTime EndDate { get; init; }
  public SimpleTimeOnly DefaultDueTime { get; init; } = new SimpleTimeOnly();
  public IEnumerable<AssignmentTemplate> AssignmentTemplates { get; init; } =
    Enumerable.Empty<AssignmentTemplate>();

  public string ToYaml()
  {
    var serializer = new SerializerBuilder().DisableAliases().Build();
    var yaml = serializer.Serialize(this);
    return yaml;
  }

  public static LocalCourseSettings ParseYaml(string rawText)
  {
    var deserializer = new DeserializerBuilder()
      .IgnoreUnmatchedProperties()
      .Build();

    var settings = deserializer.Deserialize<LocalCourseSettings>(rawText);
    return settings;
  }
}

public record SimpleTimeOnly
{
  public int Hour { get; init; } = 1;
  public int Minute { get; init; } = 0;
}
