using Microsoft.AspNetCore.Components.Server.ProtectedBrowserStorage;

public class StorageManagement
{
  private string moduleStorageKey = "module storage key";
  private string assignmentStorageKey = "assignment storage key";
  private string courseIdKey = "course id storage key";

  private CoursePlanner planner { get; }
  private ProtectedLocalStorage storage { get; }
  private CanvasService canvas { get; }

  public StorageManagement(
    CoursePlanner configurationManagement,
    ProtectedLocalStorage BrowserStorage,
    CanvasService canvasService
  )
  {
    planner = configurationManagement;
    storage = BrowserStorage;
    canvas = canvasService;
  }

  public async Task LoadStoredConfig()
  {
    // var storedModules = await storage.GetAsync<IEnumerable<CourseModule>>(moduleStorageKey);
    // if (storedModules.Success)
    // {
    //   planner.Modules =
    //     storedModules.Value
    //     ?? throw new Exception("stored modules was null, it shouldn't have been");
    // }
    // else
    // {
    //   Console.WriteLine("no stored modules");
    // }

    // var storedAssignments = await storage.GetAsync<IEnumerable<CourseModule>>(assignmentStorageKey);
    // if (storedAssignments.Success)
    // {
    //   planner.Modules =
    //     storedAssignments.Value
    //     ?? throw new Exception("stored assignments are null, it shouldn't have been");
    // }
    // else
    // {
    //   Console.WriteLine("no stored assignments");
    // }

    var storedCourseId = await storage.GetAsync<ulong>(courseIdKey);
    if (storedCourseId.Success)
    {
      // var courses =
      planner.Course = await canvas.GetCourse(storedCourseId.Value);
    }
    else
    {
      Console.WriteLine("no stored assignments");
    }
  }

  public async Task Save()
  {
    // await storage.SetAsync(moduleStorageKey, planner.Modules);
    // await storage.SetAsync(assignmentStorageKey, planner.Assignments);

    if (planner.Course != null)
      await storage.SetAsync(courseIdKey, planner.Course.Id);
    else
      await storage.DeleteAsync(courseIdKey);
  }
}
