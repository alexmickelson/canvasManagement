using CanvasModel.EnrollmentTerms;
using CanvasModel.Courses;
using CanvasModel;
using LocalModels;
using CanvasModel.Assignments;
using CanvasModel.Modules;
using Management.Services.Canvas;
using System.Text.RegularExpressions;

namespace Management.Planner;

public class CoursePlanner
{
  private readonly YamlManager yamlManager;
  private readonly CanvasService canvas;
  public bool LoadingCanvasData { get; internal set; } = false;

  public CoursePlanner(YamlManager yamlManager, CanvasService canvas)
  {
    this.yamlManager = yamlManager;
    this.canvas = canvas;
  }

  private Timer _debounceTimer;
  private int _debounceInterval = 1000;
  private LocalCourse? _localCourse { get; set; }
  public LocalCourse? LocalCourse
  {
    get => _localCourse;
    set
    {
      if (value == null)
      {
        _localCourse = null;
        StateHasChanged?.Invoke();
        return;
      }

      var verifiedCourse = value.GeneralCourseCleanup();

      _debounceTimer?.Dispose();
      _debounceTimer = new Timer(
        (_) => saveCourseToFile(),
        null,
        _debounceInterval,
        Timeout.Infinite
      );

      _localCourse = verifiedCourse;
      StateHasChanged?.Invoke();
    }
  }

  private void saveCourseToFile()
  {
    _debounceTimer?.Dispose();
    // ignore initial load of course
    if (LocalCourse != null)
    {
      Console.WriteLine("Saving file");
      yamlManager.SaveCourse(LocalCourse);
    }
  }

  public event Action? StateHasChanged;

  public IEnumerable<CanvasAssignment>? CanvasAssignments { get; internal set; }
  public IEnumerable<CanvasModule>? CanvasModules { get; internal set; }
  public Dictionary<ulong, IEnumerable<CanvasModuleItem>>? CanvasModulesItems { get; internal set; }

  public async Task<(
    IEnumerable<CanvasAssignment> CanvasAssignments,
    IEnumerable<CanvasModule> CanvasModules,
    Dictionary<ulong, IEnumerable<CanvasModuleItem>> CanvasModulesItems
  )> LoadCanvasData()
  {
    LoadingCanvasData = true;
    StateHasChanged?.Invoke();

    var canvasId =
      LocalCourse?.CanvasId ?? throw new Exception("no canvas id found for selected course");

    var assignmentsTask = canvas.Assignments.GetAll(canvasId);
    var modulesTask = canvas.GetModules(canvasId);

    CanvasAssignments = await assignmentsTask;
    CanvasModules = await modulesTask;

    CanvasModulesItems = await canvas.GetAllModulesItems(canvasId, CanvasModules);
    // Console.WriteLine(JsonSerializer.Serialize(CanvasModulesItems));

    LoadingCanvasData = false;
    StateHasChanged?.Invoke();
    return (CanvasAssignments, CanvasModules, CanvasModulesItems);
  }

  public async Task SyncWithCanvas()
  {
    if (
      LocalCourse == null
      || LocalCourse.CanvasId == null
      || CanvasAssignments == null
      || CanvasModules == null
    )
      return;

    Console.WriteLine("syncing with canvas");
    LoadingCanvasData = true;
    StateHasChanged?.Invoke();

    var (canvasAssignments, canvasModules, canvasModuleItems) = await LoadCanvasData();
    LoadingCanvasData = true;
    StateHasChanged?.Invoke();
    LocalCourse = LocalCourse.deleteCanvasIdsThatNoLongerExist(canvasModules, canvasAssignments);

    var canvasId =
      LocalCourse.CanvasId ?? throw new Exception("no course canvas id to sync with canvas");

    await LocalCourse.EnsureAllModulesExistInCanvas(canvasId, CanvasModules, canvas);
    CanvasModules = await canvas.GetModules(canvasId);

    await LocalCourse.SortCanvasModules(canvasId, CanvasModules, canvas);
    CanvasModulesItems = await canvas.GetAllModulesItems(canvasId, CanvasModules);

    LocalCourse = await LocalCourse.SyncModulesWithCanvasData(canvasId, CanvasModules, canvas);

    LocalCourse = await LocalCourse.SyncAssignmentsWithCanvas(canvasId, CanvasAssignments, canvas);
    CanvasAssignments = await canvas.Assignments.GetAll(canvasId);

    await syncModuleItemsWithCanvas(canvasId);
    CanvasModulesItems = await canvas.GetAllModulesItems(canvasId, CanvasModules);

    LoadingCanvasData = false;
    StateHasChanged?.Invoke();
    Console.WriteLine("done syncing with canvas\n");
  }

  private async Task syncModuleItemsWithCanvas(ulong canvasId)
  {
    if (LocalCourse == null)
      throw new Exception("cannot sync modules without localcourse selected");
    if (CanvasModulesItems == null)
      throw new Exception("cannot sync modules with canvas if they are not loaded in the variable");

    foreach (var localModule in LocalCourse.Modules)
    {
      var moduleCanvasId =
        localModule.CanvasId
        ?? throw new Exception("cannot sync canvas modules items if module not synced with canvas");

      bool anyUpdated = await ensureAllItemsCreated(canvasId, localModule, moduleCanvasId);

      var canvasModuleItems = anyUpdated
        ? await canvas.GetModuleItems(canvasId, moduleCanvasId)
        : CanvasModulesItems[moduleCanvasId];

      await sortModuleItems(canvasId, localModule, moduleCanvasId, canvasModuleItems);
    }
  }

  private async Task sortModuleItems(
    ulong canvasId,
    LocalModule localModule,
    ulong moduleCanvasId,
    IEnumerable<CanvasModuleItem> canvasModuleItems
  )
  {
    var localItemsWithCorrectOrder = localModule.Assignments
      .OrderBy(a => a.DueAt)
      .Select((a, i) => (Assignment: a, Position: i + 1));

    var canvasContentIdsByCurrentPosition =
      canvasModuleItems.ToDictionary(item => item.Position, item => item.ContentId)
      ?? new Dictionary<int, ulong?>();

    foreach (var (localAssignment, position) in localItemsWithCorrectOrder)
    {
      var itemIsInCorrectOrder =
        canvasContentIdsByCurrentPosition.ContainsKey(position)
        && canvasContentIdsByCurrentPosition[position] == localAssignment.CanvasId;

      var currentCanvasItem = canvasModuleItems.First(i => i.ContentId == localAssignment.CanvasId);
      if (!itemIsInCorrectOrder)
      {
        await canvas.UpdateModuleItem(
          canvasId,
          moduleCanvasId,
          currentCanvasItem with
          {
            Position = position
          }
        );
      }
    }
  }

  private async Task<bool> ensureAllItemsCreated(
    ulong canvasId,
    LocalModule localModule,
    ulong moduleCanvasId
  )
  {
    var anyUpdated = false;
    foreach (var localAssignment in localModule.Assignments)
    {
      var canvasModuleItemContentIds = CanvasModulesItems[moduleCanvasId].Select(i => i.ContentId);
      if (!canvasModuleItemContentIds.Contains(localAssignment.CanvasId))
      {
        var canvasAssignmentId =
          localAssignment.CanvasId
          ?? throw new Exception("cannot create module item if assignment does not have canvas id");
        await canvas.CreateModuleItem(
          canvasId,
          moduleCanvasId,
          localAssignment.Name,
          "Assignment",
          canvasAssignmentId
        );
        anyUpdated = true;
      }
    }

    return anyUpdated;
  }

  public void Clear()
  {
    LocalCourse = null;
    CanvasAssignments = null;
    CanvasModules = null;
  }
}
