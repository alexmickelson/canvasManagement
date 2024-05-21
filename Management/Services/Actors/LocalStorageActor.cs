using Akka.Actor;

using LocalModels;

using Management.Services;

using Microsoft.Extensions.DependencyInjection;

public class LocalStorageActor : ReceiveActor
{
  private readonly IServiceProvider serviceProvider;
  private readonly IServiceScope scope;
  private readonly MyLogger<CanvasQueueActor> logger;
  private readonly FileStorageService storage;

  private DateTime? cacheTime { get; set; } = null;
  private IEnumerable<LocalCourse>? cachedCourses { get; set; } = null;
  private readonly int cacheSeconds = 2;

  public LocalStorageActor(IServiceProvider serviceProviderArg)
  {
    serviceProvider = serviceProviderArg;
    scope = serviceProvider.CreateScope();
    logger = scope.ServiceProvider.GetRequiredService<MyLogger<CanvasQueueActor>>();
    storage = scope.ServiceProvider.GetRequiredService<FileStorageService>();

    Receive<EmptyDirectoryAsk>(m =>
    {
      storage
        .GetEmptyDirectories()
        .PipeTo(Sender);
    });

    ReceiveAsync<SavedCoursesAsk>(async m =>
    {
      var secondsFromLastLoad = (DateTime.Now - cacheTime)?.TotalSeconds;

      if (cachedCourses != null && secondsFromLastLoad < cacheSeconds)
      {
        logger.Log("returning cached courses from file");
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