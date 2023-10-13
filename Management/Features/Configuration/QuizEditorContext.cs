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

  private LocalModule? _module;
  private readonly MyLogger<CanvasAssignmentService> logger;

  public LocalQuiz? Quiz
  {
    get => _quiz;
    set
    {
      if(_quiz == null)
      {
        _module = getCurrentModule(value, planner.LocalCourse);
      }
      _quiz = value;
      StateHasChanged?.Invoke();
    }
  }

  public void SaveQuiz(LocalQuiz newQuiz)
  {
    if (planner.LocalCourse != null && _module != null && Quiz != null)
    {
      // use Quiz not newQuiz because it is the version that was last stored

      var updatedModules = planner.LocalCourse.Modules
        .Select(
          m =>
            m.Name == _module.Name
              ? m with
              {
                Quizzes = m.Quizzes
                  .Select(q => q.Name + q.Description == Quiz.Name + Quiz.Description ? newQuiz : q)
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
    if (planner.LocalCourse != null && Quiz != null && _module != null)
    {

      var updatedModules = planner.LocalCourse.Modules
        .Select(m => m.Name != _module.Name
          ? m
          : m with {
            Quizzes = m.Quizzes.Where(q => q.Name + q.Description != Quiz.Name + Quiz.Description).ToArray()
          }
        )
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
    var canvasQuizId = await planner.LocalCourse.AddQuizToCanvas(Quiz, canvas);



    var courseCanvasId = planner.LocalCourse.Settings.CanvasId;
    if (courseCanvasId == null)
    {
      logger.Log("was able to add course to canvas, but errored while making module item. CourseCanvasId is null");
      return;
    }

    var currentModule = getCurrentModule(Quiz, planner.LocalCourse);
    if (currentModule.CanvasId == null)
    {
      logger.Log("was able to add course to canvas, but errored while making module item. module canvasId is null");
      return;
    }

    await canvas.CreateModuleItem(
      (ulong)courseCanvasId,
      (ulong)currentModule.CanvasId,
      Quiz.Name,
      "Quiz",
      (ulong)canvasQuizId
    );

    await planner.LocalCourse.Modules.First().SortModuleItems(
      (ulong)courseCanvasId,
      (ulong)currentModule.CanvasId,
      canvas
    );
    logger.Log($"finished adding quiz {Quiz.Name} to canvas");
  }

  private static LocalModule getCurrentModule(LocalQuiz newQuiz, LocalCourse course)
  {
    return course.Modules.FirstOrDefault(
      m => m.Quizzes.Select(q => q.Name + q.Description).Contains(newQuiz.Name + newQuiz.Description)
    )
      ?? throw new Exception("could not find current module in quiz editor context");
  }
}
