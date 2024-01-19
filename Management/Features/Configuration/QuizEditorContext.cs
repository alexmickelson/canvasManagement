using System.Reflection.Metadata.Ecma335;
using CanvasModel.Modules;
using LocalModels;
using Management.Planner;
using Management.Services;
using Management.Services.Canvas;

public class QuizEditorContext(
  CoursePlanner planner,
  CanvasService canvas,
  MyLogger<QuizEditorContext> logger)
{
  public event Action? StateHasChanged;
  private CoursePlanner planner { get; } = planner;
  private CanvasService canvas { get; } = canvas;
  private readonly MyLogger<QuizEditorContext> logger = logger;


  private LocalQuiz? _quiz;

  private LocalModule? _module;

  public LocalQuiz? Quiz
  {
    get => _quiz;
    set
    {
      if (_quiz == null && value != null && planner != null && planner.LocalCourse != null)
      {
        _module = getCurrentLocalModule(value, planner.LocalCourse);
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
          : m with
          {
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
    if (Quiz == null)
    {
      logger.Log("cannot add null quiz to canvas");
      return;
    }
    await planner.LoadCanvasData();
    if (planner.CanvasQuizzes == null)
    {
      logger.Log("cannot add quiz to canvas, failed to retrieve current quizzes");
      return;
    }
    if (planner.LocalCourse == null)
    {
      logger.Log("cannot add quiz to canvas, no course stored in planner");
      return;
    }
    var canvasQuizId = await planner.LocalCourse.AddQuizToCanvas(Quiz, canvas);



    var courseCanvasId = planner.LocalCourse.Settings.CanvasId;
    if (courseCanvasId == null)
    {
      logger.Log("was able to add quiz to canvas, but errored while making module item. CourseCanvasId is null");
      return;
    }

    var canvasModule = getCurrentCanvasModule(Quiz, planner.LocalCourse);

    await canvas.CreateModuleItem(
      (ulong)courseCanvasId,
      canvasModule.Id,
      Quiz.Name,
      "Quiz",
      (ulong)canvasQuizId
    );

    var module = getCurrentLocalModule(Quiz, planner.LocalCourse);
    await module.SortModuleItems(
      (ulong)courseCanvasId,
      canvasModule.Id,
      canvas
    );
    logger.Log($"finished adding quiz {Quiz.Name} to canvas");
  }

  private static LocalModule getCurrentLocalModule(LocalQuiz quiz, LocalCourse course)
  {
    return course.Modules.FirstOrDefault(
      m => m.Quizzes.Select(q => q.Name + q.Description).Contains(quiz.Name + quiz.Description)
    )
      ?? throw new Exception("could not find current module in quiz editor context");
  }

  private CanvasModule getCurrentCanvasModule(LocalQuiz quiz, LocalCourse course)
  {
    var localModule = getCurrentLocalModule(quiz, course);
    var canvasModule = planner.CanvasModules?.FirstOrDefault(m => m.Name == localModule.Name)
      ?? throw new Exception($"error in quiz context, canvas module with name {localModule.Name} not found in planner");
    return canvasModule;
  }
}
