using CanvasModel.EnrollmentTerms;
using CanvasModel.Courses;
using CanvasModel;
using LocalModels;
using CanvasModel.Assignments;
using CanvasModel.Modules;
using Management.Services.Canvas;
using System.Text.RegularExpressions;

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

      var verifiedCourse = cleanupCourse(value);
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

  private LocalCourse cleanupCourse(LocalCourse incomingCourse)
  {
    var modulesWithUniqueAssignments = incomingCourse.Modules.Select(
      module => module with { Assignments = module.Assignments.DistinctBy(a => a.id) }
    );

    return incomingCourse with
    {
      Modules = modulesWithUniqueAssignments
    };
  }

  private IEnumerable<CanvasAssignment>? canvasAssignments = null;

  public IEnumerable<CanvasAssignment>? CanvasAssignments
  {
    get => canvasAssignments;
    set
    {
      canvasAssignments = value;
      StateHasChanged?.Invoke();
    }
  }
  private IEnumerable<CanvasModule>? canvasModules = null;
  public IEnumerable<CanvasModule>? CanvasModules
  {
    get => canvasModules;
    set
    {
      canvasModules = value;
      StateHasChanged?.Invoke();
    }
  }

  public async Task LoadCanvasData()
  {
    LoadingCanvasData = true;
    StateHasChanged?.Invoke();

    Thread.Sleep(1000);
    var canvasId =
      LocalCourse?.CanvasId ?? throw new Exception("no canvas id found for selected course");
    CanvasAssignments = await canvas.Assignments.GetAll(canvasId);
    CanvasModules = await canvas.GetModules(canvasId);

    LoadingCanvasData = false;
    StateHasChanged?.Invoke();
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

    LoadingCanvasData = true;
    StateHasChanged?.Invoke();

    var canvasId =
      LocalCourse.CanvasId ?? throw new Exception("no course canvas id to sync with canvas");
    await ensureAllModulesCreated(canvasId);
    await reloadModules_UpdateLocalModulesWithNewId(canvasId);

    await ensureAllAssignmentsCreated_updateIds(canvasId);

    LoadingCanvasData = false;
    StateHasChanged?.Invoke();
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
    var canvasAssignment = CanvasAssignments.FirstOrDefault(
      ca => ca.Id == localAssignment.canvasId
    );
    string localHtmlDescription = getAssignmentDescriptionHtml(localAssignment);

    if (canvasAssignment != null)
    {
      var assignmentNeedsUpdates = AssignmentNeedsUpdates(localAssignment);
      if (assignmentNeedsUpdates)
      {
        await canvas.Assignments.Update(courseId: canvasId, localAssignment, localHtmlDescription);
      }
      return localAssignment;
    }
    else
    {
      var createdAssignment = await canvas.Assignments.Create(
        courseId: canvasId,
        name: localAssignment.name,
        submissionTypes: localAssignment.submission_types,
        description: localHtmlDescription,
        dueAt: localAssignment.due_at,
        lockAt: localAssignment.lock_at,
        pointsPossible: localAssignment.points_possible
      );

      return localAssignment with
      {
        canvasId = createdAssignment.Id
      };
    }
  }

  private string getAssignmentDescriptionHtml(LocalAssignment localAssignment)
  {
    if (LocalCourse == null)
      throw new Exception(
        "cannot get assignment description if local course is null or other values not set"
      );
    return localAssignment.use_template
      ? AssignmentTemplate.GetHtml(
        LocalCourse.AssignmentTemplates.First(t => t.Id == localAssignment.template_id),
        localAssignment
      )
      : Markdig.Markdown.ToHtml(localAssignment.description);
  }

  public bool AssignmentNeedsUpdates(LocalAssignment localAssignment)
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

    var localHtmlDescription = getAssignmentDescriptionHtml(localAssignment);

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

    return !nameSame
      || !dueDatesSame
      || !lockDateSame
      || !descriptionSame
      || !pointsSame
      || !submissionTypesSame;
  }

  public void Clear()
  {
    LocalCourse = null;
    CanvasAssignments = null;
    CanvasModules = null;
  }
}
