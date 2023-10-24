using LocalModels;
using Management.Planner;
using Management.Services;
using Management.Services.Canvas;

public class AssignmentEditorContext
{
  public event Action? StateHasChanged;

  public CanvasService canvas { get; }
  private CoursePlanner planner { get; }

  public AssignmentEditorContext(
    MyLogger<AssignmentEditorContext> logger,
    CanvasService canvas,
    CoursePlanner planner
  )
  {
    this.logger = logger;
    this.canvas = canvas;
    this.planner = planner;
  }

  private LocalAssignment? _assignment;
  private readonly MyLogger<AssignmentEditorContext> logger;

  public LocalAssignment? Assignment
  {
    get => _assignment;
    set
    {
      _assignment = value;
      StateHasChanged?.Invoke();
    }
  }

  public void SaveAssignment(LocalAssignment newAssignment)
  {
    if (planner.LocalCourse != null)
    {
      // run discovery on Assignment, it was the last stored version of the assignment
      var currentModule =
        planner.LocalCourse.Modules.First(
          m => m.Assignments.Contains(Assignment)
        ) ?? throw new Exception("could not find current module in assignment editor context");

      var updatedModules = planner.LocalCourse.Modules
        .Select(
          m =>
            m.Name == currentModule.Name
              ? currentModule with
              {
                Assignments = currentModule.Assignments
                  .Select(a => a == Assignment ? newAssignment : a)
                  .ToArray()
              }
              : m
        )
        .ToArray();

      Assignment = newAssignment;
      planner.LocalCourse = planner.LocalCourse with { Modules = updatedModules };
    }
  }

  public async Task AddAssignmentToCanvas()
  {
    logger.Log("started to add assignment to canvas");
    if (Assignment == null)
    {
      logger.Log("cannot add null assignment to canvas");
      return;
    }
    await planner.LoadCanvasData();
    if (planner.CanvasAssignments == null)
    {
      logger.Log("cannot add assignment to canvas, failed to retrieve current assignments");
      return;
    }
    if (planner.LocalCourse == null)
    {
      logger.Log("cannot add assignment to canvas, no course stored in planner");
      return;
    }



    var courseCanvasId = planner.LocalCourse.Settings.CanvasId;
    if (courseCanvasId == null)
    {
      logger.Log("cannot add assignment to canvas if there is no course canvas id");
      return;
    }

    var createdAssignmentCanvasId = await planner.LocalCourse.SyncAssignmentToCanvas(
      canvasCourseId: (ulong)courseCanvasId,
      localAssignment: Assignment,
      canvasAssignments: planner.CanvasAssignments,
      canvas: canvas
    );

    var currentModule = getCurrentModule(Assignment, planner.LocalCourse);
    if (currentModule.CanvasId == null)
    {
      logger.Log("was able to add assignment to canvas, but errored while making module item. module canvasId is null");
      return;
    }

    await canvas.CreateModuleItem(
      (ulong)courseCanvasId,
      (ulong)currentModule.CanvasId,
      Assignment.Name,
      "Assignment",
      createdAssignmentCanvasId
    );

    await planner.LocalCourse.Modules.First().SortModuleItems(
      (ulong)courseCanvasId,
      (ulong)currentModule.CanvasId,
      canvas
    );
    logger.Log($"finished adding assignment {Assignment.Name} to canvas");

  }

  private static LocalModule getCurrentModule(LocalAssignment assignment, LocalCourse course)
  {
    return course.Modules.FirstOrDefault(
      m => m.Assignments.Contains(assignment)
    )
      ?? throw new Exception("could not find current module in assignment editor context");
  }
}
