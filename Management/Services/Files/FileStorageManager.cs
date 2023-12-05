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
  public async Task SaveCourseAsync(LocalCourse course, LocalCourse previouslyStoredCourse)
  {
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

  public async Task<IEnumerable<string>> GetEmptyDirectories()
  {
    if(!Directory.Exists(_basePath))
      throw new DirectoryNotFoundException($"Cannot get empty directories,  {_basePath} does not exist");
        
    return Directory
      .GetDirectories(_basePath, "*")
      .Where(dir => !Directory.EnumerateFileSystemEntries(dir).Any())
      .ToArray();

  }
}