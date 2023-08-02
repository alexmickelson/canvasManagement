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

      // ignore initial load of course
      if (_localCourse != null)
      {
        yamlManager.SaveCourse(verifiedCourse);
      }
      _localCourse = verifiedCourse;
      StateHasChanged?.Invoke();
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
    LocalCourse = LocalCourse.deleteCanvasIdsThatNoLongerExist(canvasModules, canvasAssignments);

    var canvasId =
      LocalCourse.CanvasId ?? throw new Exception("no course canvas id to sync with canvas");

    await ensureAllModulesExistInCanvas(canvasId);
    CanvasModules = await canvas.GetModules(canvasId);
    await sortCanvasModules(canvasId);
    CanvasModulesItems = await canvas.GetAllModulesItems(canvasId, CanvasModules);

    await syncModulesWithCanvasData(canvasId);

    await syncAssignmentsWithCanvas(canvasId);
    CanvasAssignments = await canvas.Assignments.GetAll(canvasId);

    await syncModuleItemsWithCanvas(canvasId);
    CanvasModulesItems = await canvas.GetAllModulesItems(canvasId, CanvasModules);

    LoadingCanvasData = false;
    StateHasChanged?.Invoke();
    Console.WriteLine("done syncing with canvas\n");
  }

  private async Task syncModulesWithCanvasData(ulong canvasId)
  {
    if (LocalCourse == null)
      return;

    CanvasModules = await canvas.GetModules(canvasId);
    LocalCourse = LocalCourse with
    {
      Modules = LocalCourse.Modules.Select(m =>
      {
        var canvasModule = CanvasModules.FirstOrDefault(cm => cm.Name == m.Name);
        return canvasModule == null ? m : m with { CanvasId = canvasModule.Id };
      })
    };
  }

  private async Task ensureAllModulesExistInCanvas(ulong canvasId)
  {
    if (LocalCourse == null || CanvasModules == null)
      return;

    foreach (var module in LocalCourse.Modules)
    {
      var canvasModule = CanvasModules.FirstOrDefault(cm => cm.Id == module.CanvasId);
      if (canvasModule == null)
      {
        await canvas.CreateModule(canvasId, module.Name);
      }
    }
  }

  private async Task sortCanvasModules(ulong canvasId)
  {
    if (LocalCourse == null)
      throw new Exception("cannot sort modules, no course selected");
    if (CanvasModules == null)
      throw new Exception("cannot sort modules, no canvas modules loaded");

    var currentCanvasPositions = CanvasModules.ToDictionary(m => m.Id, m => m.Position);
    foreach (var (localModule, i) in LocalCourse.Modules.Select((m, i) => (m, i)))
    {
      var correctPosition = i + 1;
      var moduleCanvasId =
        localModule.CanvasId ?? throw new Exception("cannot sort module if no module canvas id");
      var currentCanvasPosition = currentCanvasPositions[moduleCanvasId];
      if (currentCanvasPosition != correctPosition)
      {
        await canvas.UpdateModule(canvasId, moduleCanvasId, localModule.Name, correctPosition);
      }
    }
  }

  private async Task syncAssignmentsWithCanvas(ulong canvasId)
  {
    if (
      LocalCourse == null
      || LocalCourse.CanvasId == null
      || CanvasAssignments == null
      || CanvasModules == null
    )
      return;

    var moduleTasks = LocalCourse.Modules.Select(async m =>
    {
      var assignmentTasks = m.Assignments.Select(syncAssignmentToCanvas);
      var assignments = await Task.WhenAll(assignmentTasks);
      return m with { Assignments = assignments };
    });

    var modules = await Task.WhenAll(moduleTasks);
    LocalCourse = LocalCourse with { Modules = modules };
  }

  private async Task<LocalAssignment> syncAssignmentToCanvas(LocalAssignment localAssignment)
  {
    if (
      LocalCourse == null
      || LocalCourse.CanvasId == null
      || CanvasAssignments == null
      || CanvasModules == null
    )
      throw new Exception(
        "cannot create canvas assignment if local course is null or other values not set"
      );

    ulong canvasId = LocalCourse.CanvasId ?? throw new Exception("no canvas id to create course");
    var canvasAssignment = CanvasAssignments.FirstOrDefault(
      ca => ca.Id == localAssignment.canvasId
    );
    string localHtmlDescription = localAssignment.GetDescriptionHtml(
      LocalCourse.AssignmentTemplates
    );

    if (canvasAssignment != null)
    {
      var assignmentNeedsUpdates = AssignmentNeedsUpdates(localAssignment, quiet: false);
      if (assignmentNeedsUpdates)
      {
        await canvas.Assignments.Update(courseId: canvasId, localAssignment, localHtmlDescription);
      }
      return localAssignment;
    }
    else
    {
      return await canvas.Assignments.Create(canvasId, localAssignment, localHtmlDescription);
    }
  }

  public bool AssignmentNeedsUpdates(LocalAssignment localAssignment, bool quiet = true)
  {
    if (
      LocalCourse == null
      || LocalCourse.CanvasId == null
      || CanvasAssignments == null
      || CanvasModules == null
    )
      throw new Exception(
        "cannot check if assignment needs updates if local course is null or other values not set"
      );

    var canvasAssignment = CanvasAssignments.First(ca => ca.Id == localAssignment.canvasId);

    var localHtmlDescription = localAssignment.GetDescriptionHtml(LocalCourse.AssignmentTemplates);

    var canvasHtmlDescription = canvasAssignment.Description;
    canvasHtmlDescription = Regex.Replace(canvasHtmlDescription, "<script.*script>", "");
    canvasHtmlDescription = Regex.Replace(canvasHtmlDescription, "<link .*\">", "");

    var dueDatesSame = canvasAssignment.DueAt == localAssignment.due_at;
    var descriptionSame = canvasHtmlDescription == localHtmlDescription;
    var nameSame = canvasAssignment.Name == localAssignment.name;
    var lockDateSame = canvasAssignment.LockAt == localAssignment.lock_at;
    var pointsSame = canvasAssignment.PointsPossible == localAssignment.points_possible;
    var submissionTypesSame = canvasAssignment.SubmissionTypes.SequenceEqual(
      localAssignment.submission_types.Select(t => t.ToString())
    );

    if (!quiet)
    {
      if (!dueDatesSame)
        Console.WriteLine(
          $"Due dates different for {localAssignment.name}, local: {localAssignment.due_at}, in canvas {canvasAssignment.DueAt}"
        );

      if (!descriptionSame)
      {
        Console.WriteLine($"descriptions different for {localAssignment.name}");
        Console.WriteLine("Local Description:");
        Console.WriteLine(localHtmlDescription);
        Console.WriteLine("Canvas Description: ");
        Console.WriteLine(canvasHtmlDescription);
      }

      if (!nameSame)
        Console.WriteLine(
          $"names different for {localAssignment.name}, local: {localAssignment.name}, in canvas {canvasAssignment.Name}"
        );
      if (!lockDateSame)
        Console.WriteLine(
          $"Lock Dates different for {localAssignment.name}, local: {localAssignment.lock_at}, in canvas {canvasAssignment.LockAt}"
        );
      if (!pointsSame)
        Console.WriteLine(
          $"Points different for {localAssignment.name}, local: {localAssignment.points_possible}, in canvas {canvasAssignment.PointsPossible}"
        );
      if (!submissionTypesSame)
        Console.WriteLine(
          $"Submission Types different for {localAssignment.name}, local: {JsonSerializer.Serialize(localAssignment.submission_types.Select(t => t.ToString()))}, in canvas {JsonSerializer.Serialize(canvasAssignment.SubmissionTypes)}"
        );
    }

    return !nameSame
      || !dueDatesSame
      || !lockDateSame
      || !descriptionSame
      || !pointsSame
      || !submissionTypesSame;
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
      .OrderBy(a => a.due_at)
      .Select((a, i) => (Assignment: a, Position: i + 1));

    var canvasContentIdsByCurrentPosition =
      canvasModuleItems.ToDictionary(item => item.Position, item => item.ContentId)
      ?? new Dictionary<int, ulong?>();

    foreach (var (localAssignment, position) in localItemsWithCorrectOrder)
    {
      var itemIsInCorrectOrder =
        canvasContentIdsByCurrentPosition.ContainsKey(position)
        && canvasContentIdsByCurrentPosition[position] == localAssignment.canvasId;

      var currentCanvasItem = canvasModuleItems.First(i => i.ContentId == localAssignment.canvasId);
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
      if (!canvasModuleItemContentIds.Contains(localAssignment.canvasId))
      {
        var canvasAssignmentId =
          localAssignment.canvasId
          ?? throw new Exception("cannot create module item if assignment does not have canvas id");
        await canvas.CreateModuleItem(
          canvasId,
          moduleCanvasId,
          localAssignment.name,
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
