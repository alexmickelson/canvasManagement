using CanvasModel.EnrollmentTerms;
using CanvasModel.Courses;
using CanvasModel;
using LocalModels;
using CanvasModel.Assignments;
using CanvasModel.Modules;

public class CoursePlanner
{
  private readonly YamlManager yamlManager;
  private readonly CanvasService canvas;

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

      var verifiedCourse = verifyCourse(value);
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

  private LocalCourse verifyCourse(LocalCourse incomingCourse)
  {
    var modulesWithUniqueAssignments = incomingCourse.Modules.Select(
      module => module with { Assignments = module.Assignments.DistinctBy(a => a.id) }
    );

    return incomingCourse with
    {
      Modules = modulesWithUniqueAssignments
    };
  }

  public IEnumerable<CanvasAssignment>? CanvasAssignments { get; set; } = null;
  public IEnumerable<CanvasModule>? CanvasModules { get; set; } = null;

  public async Task SyncWithCanvas()
  {
    if (
      LocalCourse == null
      || LocalCourse.CanvasId == null
      || CanvasAssignments == null
      || CanvasModules == null
    )
      return;

    var canvasId =
      LocalCourse.CanvasId ?? throw new Exception("no course canvas id to sync with canvas");
    await ensureAllModulesCreated(canvasId);
    await reloadModules_UpdateLocalModulesWithNewId(canvasId);

    await ensureAllAssignmentsCreated_updateIds(canvasId);
  }

  private async Task reloadModules_UpdateLocalModulesWithNewId(ulong canvasId)
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

  private async Task ensureAllModulesCreated(ulong canvasId)
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

  private async Task ensureAllAssignmentsCreated_updateIds(ulong canvasId)
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
      var assignmentTasks = m.Assignments.Select(ensureAssignmentInCanvas_returnUpdated);
      var assignments = await Task.WhenAll(assignmentTasks);
      return m with { Assignments = assignments };
    });

    var modules = await Task.WhenAll(moduleTasks);
    LocalCourse = LocalCourse with { Modules = modules };
  }

  private async Task<LocalAssignment> ensureAssignmentInCanvas_returnUpdated(
    LocalAssignment localAssignment
  )
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
    var canvasAssignment = await canvas.CreateAssignment(
      courseId: canvasId,
      name: localAssignment.name,
      submissionTypes: localAssignment.submission_types,
      description: localAssignment.description,
      dueAt: localAssignment.due_at,
      lockAt: localAssignment.lock_at,
      pointsPossible: localAssignment.points_possible
    );

    return localAssignment with
    {
      canvasId = canvasAssignment.Id
    };
  }

  public void Clear()
  {
    LocalCourse = null;
    CanvasAssignments = null;
    CanvasModules = null;
  }
}
