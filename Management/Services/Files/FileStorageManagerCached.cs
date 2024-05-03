
using System.Diagnostics.CodeAnalysis;
using LocalModels;

public class FileStorageManagerCached : IFileStorageManager
{
  private readonly FileStorageManager manager;

  private readonly object cacheLock = new object();  // Lock object for synchronization


  private DateTime? cacheTime { get; set; } = null;
  private IEnumerable<LocalCourse>? cachedCourses { get; set; } = null;
  private ILogger<FileStorageManagerCached> logger { get; }

  private readonly int cacheSeconds = 2;
  public FileStorageManagerCached(FileStorageManager manager, ILogger<FileStorageManagerCached> logger)
  {
    this.manager = manager;
    this.logger = logger;
  }
  public IEnumerable<string> GetEmptyDirectories()
  {
    return manager.GetEmptyDirectories();
  }

  public async Task<IEnumerable<LocalCourse>> LoadSavedCourses()
  {

    var secondsFromLastLoad = (DateTime.Now - cacheTime)?.Seconds;

    if (cachedCourses != null && secondsFromLastLoad < cacheSeconds)
    {
      logger.LogInformation("returning cached courses from file");
      return cachedCourses;
    }

    cachedCourses = await manager.LoadSavedCourses();
    cacheTime = DateTime.Now;
    return cachedCourses;
  }

  public async Task SaveCourseAsync(LocalCourse course, LocalCourse? previouslyStoredCourse)
  {
    // race condition...
    cacheTime = null;
    cachedCourses = null;
    await manager.SaveCourseAsync(course, previouslyStoredCourse);
  }
}
