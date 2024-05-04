using Akka.Actor;

using LocalModels;

using Microsoft.Extensions.DependencyInjection;

public class LocalStorageActor : ReceiveActor
{
  private readonly IServiceProvider serviceProvider;
  private readonly IServiceScope scope;
  private readonly ILogger<CanvasQueueActor> logger;
  private readonly FileStorageManager storage;

  private DateTime? cacheTime { get; set; } = null;
  private IEnumerable<LocalCourse>? cachedCourses { get; set; } = null;
  private readonly int cacheSeconds = 2;

  public LocalStorageActor(IServiceProvider serviceProviderArg)
  {
    serviceProvider = serviceProviderArg;
    scope = serviceProvider.CreateScope();
    logger = scope.ServiceProvider.GetRequiredService<ILogger<CanvasQueueActor>>();
    storage = scope.ServiceProvider.GetRequiredService<FileStorageManager>();

    Receive<EmptyDirectoryAsk>(m =>
    {
      storage
        .GetEmptyDirectories()
        .PipeTo(Sender);
    });

    ReceiveAsync<SavedCoursesAsk>(async m =>
    {
      var secondsFromLastLoad = (DateTime.Now - cacheTime)?.Seconds;

      if (cachedCourses != null && secondsFromLastLoad < cacheSeconds)
      {
        logger.LogInformation("returning cached courses from file");
        Sender.Tell(cachedCourses);
        return;
      }

      cachedCourses = await storage.LoadSavedCourses();
      cacheTime = DateTime.Now;
      Sender.Tell(cachedCourses);
    });

    ReceiveAsync<SaveCoursesRequest>(async m =>
    {
      cacheTime = null;
      cachedCourses = null;
      await storage.SaveCourseAsync(m.Course, m.PreviouslyStoredCourse);
    });
  }
}

public record EmptyDirectoryAsk();
public record SavedCoursesAsk();

public record SaveCoursesRequest(LocalCourse Course, LocalCourse? PreviouslyStoredCourse);
public record SaveCoursesResponseSuccess();