using CanvasModel.Modules;
using LocalModels;
using Management.Planner;
using Management.Services;
using Management.Services.Canvas;

public class AssignmentEditorContext
{
  public event Action? StateHasChanged;

  public ICanvasService canvas { get; }
  private CoursePlanner planner { get; }

  public AssignmentEditorContext(
    MyLogger<AssignmentEditorContext> logger,
    ICanvasService canvas,
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
    if (planner.LocalCourse != null && Assignment != null)
    {
      // run discovery on Assignment, it was the last stored version of the assignment
      var currentModule = getCurrentLocalModule(Assignment, planner.LocalCourse);

      var updatedModules = planner.LocalCourse.Modules
        .Select(
          m =>
            m.Name == currentModule.Name
              ? currentModule with
              {
                Assignments = currentModule.Assignments
                  .Select(a => a.Name == Assignment.Name ? newAssignment : a)
                  .ToArray()
              }
              : m
        )
        .ToArray();
      planner.LocalCourse = planner.LocalCourse with { Modules = updatedModules };

      Assignment = newAssignment;
    }
  }

  public async Task UpdateInCanvas(ulong canvasAssignmentId)
  {
    logger.Log("started to update assignment in canvas");
    if (Assignment == null)
    {
      logger.Log("cannot update null assignment in canvas");
      return;
    }


    await planner.LoadCanvasData();
    if (planner.CanvasAssignments == null)
    {
      logger.Log("cannot update assignment in canvas, failed to retrieve current assignments");
      return;
    }
    if (planner.LocalCourse == null)
    {
      logger.Log("cannot update assignment in canvas, no course stored in planner");
      return;
    }
    if (planner.LocalCourse.Settings.CanvasId == null)
    {
      logger.Log("Cannot update assignment with null local course canvas id");
      return;
    }
    var assignmentInCanvas = planner.CanvasAssignments?.FirstOrDefault(a => a.Id == canvasAssignmentId);
    if (assignmentInCanvas == null)
    {
      logger.Log("cannot update assignment in canvas, could not find canvas assignment with id: " + canvasAssignmentId);
      return;
    }
    // Console.WriteLine(JsonSerializer.Serialize(Assignment.LocalAssignmentGroupName));
    // Console.WriteLine(JsonSerializer.Serialize(planner.LocalCourse.Settings.AssignmentGroups));

    var canvasAssignmentGroupId = Assignment.GetCanvasAssignmentGroupId(planner.LocalCourse.Settings.AssignmentGroups);

    if (canvasAssignmentGroupId == null)
    {
      logger.Log("cannot update assignment in canvas, could not get assignment group id: " + assignmentInCanvas.AssignmentGroupId);
      return;
    }

    await canvas.Assignments.Update(
      courseId: (ulong)planner.LocalCourse.Settings.CanvasId,
      canvasAssignmentId: canvasAssignmentId,
      localAssignment: Assignment,
      canvasAssignmentGroupId: (ulong)canvasAssignmentGroupId
    );
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

    var canvasModule = getCurrentCanvasModule(Assignment, planner.LocalCourse);

    await canvas.CreateModuleItem(
      (ulong)courseCanvasId,
      canvasModule.Id,
      Assignment.Name,

      "Assignment",
      createdAssignmentCanvasId
    );

    var module = getCurrentLocalModule(Assignment, planner.LocalCourse);
    await module.SortModuleItems(
      (ulong)courseCanvasId,
      canvasModule.Id,
      canvas
    );
    logger.Log($"finished adding assignment {Assignment.Name} to canvas");
  }

  private static LocalModule getCurrentLocalModule(LocalAssignment assignment, LocalCourse course)
  {
    return course.Modules.FirstOrDefault(
      m => m.Assignments.Select(a => a.Name).Contains(assignment.Name)
    )
      ?? throw new Exception("could not find current module in assignment editor context");
  }

  private CanvasModule getCurrentCanvasModule(LocalAssignment assignment, LocalCourse course)
  {
    var localModule = getCurrentLocalModule(assignment, course);
    var canvasModule = planner.CanvasModules?.FirstOrDefault(m => m.Name == localModule.Name)
      ?? throw new Exception($"error in assignment context, canvas module with name {localModule.Name} not found in planner");
    return canvasModule;
  }
}
