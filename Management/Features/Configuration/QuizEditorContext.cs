using System.Reflection.Metadata.Ecma335;
using LocalModels;
using Management.Planner;
using Management.Services;
using Management.Services.Canvas;

public class QuizEditorContext
{
  public QuizEditorContext(CoursePlanner planner, CanvasService canvas,
    MyLogger<CanvasAssignmentService> logger)
  {
    this.planner = planner;
    this.canvas = canvas;
    this.logger = logger;
  }
  public event Action? StateHasChanged;
  private CoursePlanner planner { get; }
  private CanvasService canvas { get; }


  private LocalQuiz? _quiz;
  private readonly MyLogger<CanvasAssignmentService> logger;

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
      var currentModule = getCurrentModule(newQuiz, planner.LocalCourse);

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

  public void DeleteQuiz()
  {
    if (planner.LocalCourse != null && Quiz != null)
    {
      var currentModule = getCurrentModule(Quiz, planner.LocalCourse);

      var updatedModules = planner.LocalCourse.Modules
        .Where(m => m.Name != currentModule.Name)
        .ToArray();

      planner.LocalCourse = planner.LocalCourse with { Modules = updatedModules };
      Quiz = null;
    }
  }


  public async Task AddQuizToCanvas()
  {
    logger.Log("started to add quiz to canvas");
    if(Quiz == null)
    {
      logger.Log("cannot add null quiz to canvas");
      return;
    }
    await planner.LoadCanvasData();
    if(planner.CanvasQuizzes == null)
    {
      logger.Log("cannot add quiz to canvas, failed to retrieve current quizzes");
      return;
    }
    if(planner.LocalCourse == null)
    {
      logger.Log("cannot add quiz to canvas, no course stored in planner");
      return;
    }
    var updatedQuiz = await planner.LocalCourse.AddQuizToCanvas(Quiz, canvas);



    var courseCanvasId = planner.LocalCourse.Settings.CanvasId;
    var currentModule = getCurrentModule(Quiz, planner.LocalCourse);

    await canvas.CreateModuleItem(
              (ulong)courseCanvasId,
              (ulong)currentModule.CanvasId,
              updatedQuiz.Name,
              "Quiz",
              (ulong)updatedQuiz.CanvasId
            );

    await planner.LocalCourse.Modules.First().SortModuleItems(
      (ulong)courseCanvasId,
      (ulong)currentModule.CanvasId,
      canvas
    );
    logger.Log("added quiz to canvas");
  }

  private static LocalModule getCurrentModule(LocalQuiz newQuiz, LocalCourse course)
  {
    return course.Modules.First(m => m.Quizzes.Select(q => q.Id).Contains(newQuiz.Id))
      ?? throw new Exception("could not find current module in quiz editor context");
  }
}
