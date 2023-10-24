using Microsoft.AspNetCore.Components;

namespace Management.Web.Shared.Module.Assignment;
public class DroppableAssignment : ComponentBase
{
  [Inject]
  protected CoursePlanner planner { get; set; } = default!;

  [Parameter, EditorRequired]
  public LocalAssignment Assignment { get; set; } = default!;
  private void dropOnDate(DateTime dropDate)
  {
    if (planner.LocalCourse == null) return;
    var currentModule = planner
      .LocalCourse
      .Modules
      .First(m =>
        m.Assignments.Contains(Assignment)
      ) ?? throw new Exception("in day callback, could not find module");


    var defaultDueTimeDate = new DateTime(
      year: dropDate.Year,
      month: dropDate.Month,
      day: dropDate.Day,
      hour: planner.LocalCourse.Settings.DefaultDueTime.Hour,
      minute: planner.LocalCourse.Settings.DefaultDueTime.Minute,
      second: 0
    );

    var moduleWithUpdatedAssignment = currentModule with
    {
      Assignments = currentModule.Assignments.Select(a =>
        a.Name != Assignment.Name // we are only changing the due date, so the name should be the same
        ? a
        : a with
        {
          DueAt = defaultDueTimeDate
        }
      )
    };
    var updatedModules = planner.LocalCourse.Modules
      .Select(m =>
        m.Name == moduleWithUpdatedAssignment.Name
          ? moduleWithUpdatedAssignment
          : m
      );
    var newCourse = planner.LocalCourse with
    {
      Modules = updatedModules
    };
    planner.LocalCourse = newCourse;
  }
  private void dropOnModule(LocalModule module)
  {
    if (planner.LocalCourse == null) return;
    var newModules = planner.LocalCourse.Modules.Select(m =>
      m.Name != module.Name
        ? m with
        {
          Assignments = m.Assignments.Where(a => a.Name != Assignment.Name).DistinctBy(a => a.Name)
        }
        : m with
        {
          Assignments = m.Assignments.Append(Assignment).DistinctBy(a => a.Name)
        }
    );

    var newCourse = planner.LocalCourse with
    {
      Modules = newModules
    };
    planner.LocalCourse = newCourse;
  }

  protected void DropCallback(DateTime? dropDate, LocalModule? module)
  {
    if (module == null)
    {
      dropOnDate(dropDate ?? Assignment.DueAt);
    }
    else
    {
      dropOnModule(module);
    }
  }

}