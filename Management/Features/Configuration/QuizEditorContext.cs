using LocalModels;
using Management.Planner;

public class QuizEditorContext
{
  public event Action? StateHasChanged;
  private CoursePlanner planner { get; }

  public QuizEditorContext(CoursePlanner planner)
  {
    this.planner = planner;
  }

  private LocalQuiz? _quiz;
  public LocalQuiz? Quiz
  {
    get => _quiz;
    set
    {
      _quiz = value;
      StateHasChanged?.Invoke();
    }
  }

  public void SaveQuiz(LocalQuiz newQuiz)
  {
    if (planner.LocalCourse != null)
    {
      var currentModule =
        planner.LocalCourse.Modules.First(m => m.Quizzes.Select(q => q.Id).Contains(newQuiz.Id))
        ?? throw new Exception("could not find current module in quiz editor context");

      var updatedModules = planner.LocalCourse.Modules
        .Select(
          m =>
            m.Name == currentModule.Name
              ? currentModule with
              {
                Quizzes = currentModule.Quizzes
                  .Select(q => q.Id == newQuiz.Id ? newQuiz : q)
                  .ToArray()
              }
              : m
        )
        .ToArray();

      planner.LocalCourse = planner.LocalCourse with { Modules = updatedModules };
      Quiz = newQuiz;
    }
  }
}
