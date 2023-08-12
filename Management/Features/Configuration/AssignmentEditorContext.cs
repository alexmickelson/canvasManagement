using LocalModels;
using Management.Planner;

public class AssignmentEditorContext
{
  public event Action? StateHasChanged;
  private CoursePlanner planner { get; }

  public AssignmentEditorContext(CoursePlanner planner)
  {
    this.planner = planner;
  }

  private LocalAssignment? _assignment;
  public LocalAssignment? Assignment
  {
    get { return _assignment; }
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
      var currentModule =
        planner.LocalCourse.Modules.First(
          m => m.Assignments.Select(a => a.Id).Contains(newAssignment.Id)
        ) ?? throw new Exception("could not find current module in assignment description form");

      var updatedModules = planner.LocalCourse.Modules
        .Select(
          m =>
            m.Name == currentModule.Name
              ? currentModule with
              {
                Assignments = currentModule.Assignments
                  .Select(a => a.Id == newAssignment.Id ? newAssignment : a)
                  .ToArray()
              }
              : m
        )
        .ToArray();

      planner.LocalCourse = planner.LocalCourse with { Modules = updatedModules };
    }
  }
}
