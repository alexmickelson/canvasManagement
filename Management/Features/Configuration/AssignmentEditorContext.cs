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
}
