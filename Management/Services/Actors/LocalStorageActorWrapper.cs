using Akka.Actor;

using LocalModels;

public class LocalStorageActorWrapper(IActorRef storageActor) : IFileStorageManager
{
  private readonly IActorRef storageActor = storageActor;

  public async Task<IEnumerable<string>> GetEmptyDirectories()
  {
    return await storageActor.Ask<IEnumerable<string>>(new EmptyDirectoryAsk());
  }

  public async Task<IEnumerable<LocalCourse>> LoadSavedCourses()
  {
    return await storageActor.Ask<IEnumerable<LocalCourse>>(new SavedCoursesAsk());
  }

  public async Task SaveCourseAsync(LocalCourse course, LocalCourse? previouslyStoredCourse)
  {
    await storageActor.Ask<SaveCoursesResponseSuccess>(new SaveCoursesRequest(course, previouslyStoredCourse));
  }
}