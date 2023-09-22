using Microsoft.AspNetCore.Components;

namespace Management.Web.Shared.Components.Quiz;

public class DroppableQuiz : ComponentBase
{
  [Inject]
  protected CoursePlanner planner { get; set; } = default!;

  [Parameter, EditorRequired]
  public LocalQuiz Quiz { get; set; } = default!;


  internal void dropCallback(DateTime? dropDate, LocalModule? dropModule)
  {
    if (dropDate != null)
    {
      dropOnDate(dropDate ?? throw new Exception("drop date for quiz is null"));
    }
    else if (dropModule != null)
    {
      dropOnModule(dropModule);
    }
  }

  private void dropOnDate(DateTime dropDate)
  {
    if (planner.LocalCourse == null)
      return;
    var currentModule =
      planner.LocalCourse.Modules.First(m => m.Quizzes.Select(q => q.Id).Contains(Quiz.Id))
      ?? throw new Exception("in quiz callback, could not find module");

    var defaultDueTimeDate = new DateTime(
      year: dropDate.Year,
      month: dropDate.Month,
      day: dropDate.Day,
      hour: planner.LocalCourse.Settings.DefaultDueTime.Hour,
      minute: planner.LocalCourse.Settings.DefaultDueTime.Minute,
      second: 0
    );

    var NewQuizList = currentModule.Quizzes
      .Select(q => q.Id != Quiz.Id ? q : q with { DueAt = defaultDueTimeDate })
      .ToArray();

    var updatedModule = currentModule with { Quizzes = NewQuizList };
    var updatedModules = planner.LocalCourse.Modules
      .Select(m => m.Name == updatedModule.Name ? updatedModule : m)
      .ToArray();

    planner.LocalCourse = planner.LocalCourse with { Modules = updatedModules };
  }

  private void dropOnModule(LocalModule dropModule)
  {
    if (planner.LocalCourse == null)
      return;
    var newModules = planner.LocalCourse.Modules
      .Select(
        m =>
          m.Name != dropModule.Name
            ? m with
            {
              Quizzes = m.Quizzes.Where(q => q.Id != Quiz.Id).DistinctBy(q => q.Id)
            }
            : m with
            {
              Quizzes = m.Quizzes.Append(Quiz).DistinctBy(q => q.Id)
            }
      )
      .ToArray();

    var newCourse = planner.LocalCourse with { Modules = newModules };
    planner.LocalCourse = newCourse;
  }
}
