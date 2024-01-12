using System.Diagnostics;
using LocalModels;
using Management.Services;

public class FileStorageManager
{
  private readonly MyLogger<FileStorageManager> logger;
  private readonly CourseMarkdownLoader _courseMarkdownLoader;
  private readonly MarkdownCourseSaver _saveMarkdownCourse;
  private readonly ILogger<FileStorageManager> _otherLogger;
  private readonly string _basePath;

  public FileStorageManager(
    MyLogger<FileStorageManager> logger,
    CourseMarkdownLoader courseMarkdownLoader,
    MarkdownCourseSaver saveMarkdownCourse,
    ILogger<FileStorageManager> otherLogger,
    FileConfiguration fileConfig
  )
  {
    using var activity = DiagnosticsConfig.Source.StartActivity("loading storage directory");
    this.logger = logger;
    _courseMarkdownLoader = courseMarkdownLoader;
    _saveMarkdownCourse = saveMarkdownCourse;
    _otherLogger = otherLogger;
    _basePath = fileConfig.GetBasePath();

    this.logger.Log("Using storage directory: " + _basePath);
  }
  public async Task SaveCourseAsync(LocalCourse course, LocalCourse? previouslyStoredCourse)
  {
    using var activity = DiagnosticsConfig.Source.StartActivity("Saving Course");
    activity?.AddTag("CourseName", course.Settings.Name);
    await _saveMarkdownCourse.Save(course, previouslyStoredCourse);
  }


  public async Task<IEnumerable<LocalCourse>> LoadSavedCourses()
  {
    return await LoadSavedMarkdownCourses();
  }

  public async Task<IEnumerable<LocalCourse>> LoadSavedMarkdownCourses()
  {

    return await _courseMarkdownLoader.LoadSavedMarkdownCourses();
  }

  public IEnumerable<string> GetEmptyDirectories()
  {
    if(!Directory.Exists(_basePath))
      throw new DirectoryNotFoundException($"Cannot get empty directories,  {_basePath} does not exist");

    return Directory
      .GetDirectories(_basePath, "*")
      .Where(dir => !Directory.EnumerateFileSystemEntries(dir).Any())
      .ToArray();

  }
}


public static class DiagnosticsConfig
{
  public const string SourceName = "canvas-management-source";
  public static ActivitySource Source = new ActivitySource(SourceName);
}
