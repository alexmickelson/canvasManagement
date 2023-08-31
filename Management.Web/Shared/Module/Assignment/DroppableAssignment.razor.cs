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
        m.Assignments
          .Select(a => a.Id)
          .Contains(Assignment.Id)
      ) ?? throw new Exception("in day callback, could not find module");


    var defaultDueTimeDate = new DateTime(
      year: dropDate.Year,
      month: dropDate.Month,
      day: dropDate.Day,
      hour: planner.LocalCourse.DefaultDueTime.Hour,
      minute: planner.LocalCourse.DefaultDueTime.Minute,
      second: 0
    );

    var moduleWithUpdatedAssignment = currentModule with
    {
      Assignments = currentModule.Assignments.Select(a =>
        a.Id != Assignment.Id
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
          Assignments = m.Assignments.Where(a => a.Id != Assignment.Id).DistinctBy(a => a.Id)
        }
        : m with
        {
          Assignments = m.Assignments.Append(Assignment).DistinctBy(a => a.Id)
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