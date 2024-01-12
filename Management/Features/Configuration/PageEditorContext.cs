using CanvasModel.Modules;
using LocalModels;
using Management.Planner;
using Management.Services;
using Management.Services.Canvas;

public class PageEditorContext(
  CoursePlanner planner,
  CanvasService canvas,
  MyLogger<PageEditorContext> logger)
{
  public event Action? StateHasChanged;
  private CoursePlanner planner { get; } = planner;
  private CanvasService canvas { get; } = canvas;
  private readonly MyLogger<PageEditorContext> logger = logger;


  private LocalCoursePage? _page;

  private LocalModule? _module;


  public LocalCoursePage? Page
  {
    get => _page;
    set
    {
      if (_page == null && value != null && planner != null && planner.LocalCourse != null)
      {
        _module = getCurrentLocalModule(value, planner.LocalCourse);
      }
      _page = value;
      StateHasChanged?.Invoke();
    }
  }

  public void SavePage(LocalCoursePage newPage)
  {
    if (planner.LocalCourse != null && _module != null && Page != null)
    {
      // use Page not newPage because it is the version that was last stored

      var updatedModules = planner.LocalCourse.Modules
        .Select(
          m =>
            m.Name == _module.Name
              ? m with
              {
                Pages = m.Pages
                  .Select(p => p == Page ? newPage : p)
                  .ToArray()
              }
              : m
        )
        .ToArray();

      planner.LocalCourse = planner.LocalCourse with { Modules = updatedModules };
      Page = newPage;
    }
  }

  public void DeletePage()
  {
    if (planner.LocalCourse != null && Page != null && _module != null)
    {
      // not dealing with canvas rn
      var updatedModules = planner.LocalCourse.Modules
        .Select(m => m.Name != _module.Name
          ? m
          : m with
          {
            Pages = m.Pages.Where(p => p == Page).ToArray()
          }
        )
        .ToArray();

      planner.LocalCourse = planner.LocalCourse with { Modules = updatedModules };
      Page = null;
    }
  }


  public async Task AddPageToCanvas()
  {
    logger.Log("started to add page to canvas");
    if (Page == null)
    {
      logger.Log("cannot add null page to canvas");
      return;
    }
    await planner.LoadCanvasData();
    // if (planner.CanvasQuizzes == null)
    // {
    //   logger.Log("cannot add quiz to canvas, failed to retrieve current quizzes");
    //   return;
    // }
    // if (planner.LocalCourse == null)
    // {
    //   logger.Log("cannot add quiz to canvas, no course stored in planner");
    //   return;
    // }
    // var canvasQuizId = await planner.LocalCourse.AddQuizToCanvas(Quiz, canvas);



    // var courseCanvasId = planner.LocalCourse.Settings.CanvasId;
    // if (courseCanvasId == null)
    // {
    //   logger.Log("was able to add quiz to canvas, but errored while making module item. CourseCanvasId is null");
    //   return;
    // }

    // var canvasModule = getCurrentCanvasModule(Quiz, planner.LocalCourse);

    // await canvas.CreateModuleItem(
    //   (ulong)courseCanvasId,
    //   canvasModule.Id,
    //   Quiz.Name,
    //   "Quiz",
    //   (ulong)canvasQuizId
    // );

    // await planner.LocalCourse.Modules.First().SortModuleItems(
    //   (ulong)courseCanvasId,
    //   canvasModule.Id,
    //   canvas
    // );
    // logger.Log($"finished adding quiz {Quiz.Name} to canvas");
  }

  public async Task UpdateInCanvas(string pageId)
  {

  }



  private static LocalModule getCurrentLocalModule(LocalCoursePage page, LocalCourse course)
  {
    return course.Modules.FirstOrDefault(
      m => m.Pages.Contains(page)
    )
      ?? throw new Exception("could not find current module in page editor context");
  }

  private CanvasModule getCurrentCanvasModule(LocalCoursePage quiz, LocalCourse course)
  {
    var localModule = getCurrentLocalModule(quiz, course);
    var canvasModule = planner.CanvasModules?.FirstOrDefault(m => m.Name == localModule.Name)
      ?? throw new Exception($"error in page context, canvas module with name {localModule.Name} not found in planner");
    return canvasModule;
  }
}
