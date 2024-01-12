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
    if (planner.CanvasPages == null)
    {
      logger.Log("cannot add page to canvas, failed to retrieve current pages");
      return;
    }
    if (planner.LocalCourse == null)
    {
      logger.Log("cannot add page to canvas, no course stored in planner");
      return;
    }
    var canvasPage = await planner.LocalCourse.AddPageToCanvas(Page, canvas);



    var courseCanvasId = planner.LocalCourse.Settings.CanvasId;
    if (courseCanvasId == null)
    {
      logger.Log("was able to add page to canvas, but errored while making module item. CourseCanvasId is null");
      return;
    }

    var canvasModule = getCurrentCanvasModule(Page, planner.LocalCourse);

    if(canvasPage != null)
    {
      await canvas.CreatePageModuleItem(
        (ulong)courseCanvasId,
        canvasModule.Id,
        Page.Name,
        canvasPage
      );

      await planner.LocalCourse.Modules.First().SortModuleItems(
        (ulong)courseCanvasId,
        canvasModule.Id,
        canvas
      );
    }
    logger.Log($"finished adding page {Page.Name} to canvas");
  }

  public async Task UpdateInCanvas(ulong canvasPageId)
  {

    logger.Log("started to update page in canvas");
    if (Page == null)
    {
      logger.Log("cannot update null page in canvas");
      return;
    }


    await planner.LoadCanvasData();
    if (planner.CanvasPages == null)
    {
      logger.Log("cannot update page in canvas, failed to retrieve current pages");
      return;
    }
    if (planner.LocalCourse == null)
    {
      logger.Log("cannot update page in canvas, no course stored in planner");
      return;
    }
    if (planner.LocalCourse.Settings.CanvasId == null)
    {
      logger.Log("Cannot update page with null local course canvas id");
      return;
    }
    var assignmentInCanvas = planner.CanvasPages?.FirstOrDefault(p => p.PageId == canvasPageId);
    if (assignmentInCanvas == null)
    {
      logger.Log("cannot update page in canvas, could not find canvas page with id: " + canvasPageId);
      return;
    }


    await canvas.Pages.Update(
      courseId: (ulong)planner.LocalCourse.Settings.CanvasId,
      canvasPageId: canvasPageId,
      localCoursePage: Page
    );
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
