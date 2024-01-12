using CanvasModel.Pages;
using LocalModels;
using Management.Services.Canvas;

public static class PageSynchronizationExtension
{
  public static async Task<CanvasPage?> AddPageToCanvas(
    this LocalCourse localCourse,
    LocalCoursePage localPage,
    CanvasService canvas
  )
  {
    if (localCourse.Settings.CanvasId == null)
    {
      Console.WriteLine("Cannot add page to canvas without canvas course id");
      return null;
    }
    ulong courseCanvasId = (ulong)localCourse.Settings.CanvasId;

    var canvasPage = await canvas.Pages.Create(courseCanvasId, localPage);
    return canvasPage;
  }
}
