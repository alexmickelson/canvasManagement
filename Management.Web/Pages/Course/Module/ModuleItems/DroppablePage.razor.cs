using Microsoft.AspNetCore.Components;

namespace Management.Web.Course.Module.ModuleItems;
public class DroppablePage : ComponentBase
{
  [Inject]
  protected CoursePlanner planner { get; set; } = default!;

  [Parameter, EditorRequired]
  public LocalCoursePage Page { get; set; } = default!;
  private void dropOnDate(DateTime dropDate)
  {
    if (planner.LocalCourse == null) return;
    var currentModule = planner
      .LocalCourse
      .Modules
      .First(m =>
        m.Pages.Contains(Page)
      ) ?? throw new Exception("in drop page callback, could not find module");


    var defaultDueTimeDate = new DateTime(
      year: dropDate.Year,
      month: dropDate.Month,
      day: dropDate.Day,
      hour: planner.LocalCourse.Settings.DefaultDueTime.Hour,
      minute: planner.LocalCourse.Settings.DefaultDueTime.Minute,
      second: 0
    );

    var moduleWithUpdatedPage = currentModule with
    {
      Pages = currentModule.Pages.Select(p =>
        p.Name != Page.Name // we are only changing the due date, so the name should be the same
        ? p
        : p with { DueAt = defaultDueTimeDate }
      )
    };
    var updatedModules = planner.LocalCourse.Modules
      .Select(m =>
        m.Name == moduleWithUpdatedPage.Name
          ? moduleWithUpdatedPage
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
          Pages = m.Pages.Where(p => p.Name != Page.Name).DistinctBy(p => p.Name)
        }
        : m with
        {
          Pages = m.Pages.Append(Page).DistinctBy(a => a.Name)
        }
    );

    var newCourse = planner.LocalCourse with
    {
      Modules = newModules
    };
    planner.LocalCourse = newCourse;
  }

  protected void dropCallback(DateTime? dropDate, LocalModule? module)
  {
    if (module == null)
    {
      dropOnDate(dropDate ?? Page.DueAt);
    }
    else
    {
      dropOnModule(module);
    }
  }

}
