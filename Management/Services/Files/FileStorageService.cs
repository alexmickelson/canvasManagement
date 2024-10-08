using LocalModels;
using Management.Services;

public class FileStorageService
{
  private readonly MyLogger<FileStorageService> logger;
  private readonly CourseMarkdownLoader _courseMarkdownLoader;
  private readonly MarkdownCourseSaver _saveMarkdownCourse;
  private readonly ILogger<FileStorageService> _otherLogger;
  private readonly string _basePath;

  public FileStorageService(
    MyLogger<FileStorageService> logger,
    CourseMarkdownLoader courseMarkdownLoader,
    MarkdownCourseSaver saveMarkdownCourse,
    ILogger<FileStorageService> otherLogger,
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

    Console.WriteLine("loading pages from file system");
    return await _courseMarkdownLoader.LoadSavedCourses();
  }

  public async Task<IEnumerable<string>> GetEmptyDirectories()
  {
    if (!Directory.Exists(_basePath))
      throw new DirectoryNotFoundException($"Cannot get empty directories,  {_basePath} does not exist");

    return Directory
      .GetDirectories(_basePath, "*")
      .Where(dir => !Directory.EnumerateFileSystemEntries(dir).Any())
      .ToArray();

  }
}
