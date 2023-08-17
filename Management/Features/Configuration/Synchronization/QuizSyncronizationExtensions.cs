using System.Text.RegularExpressions;
using CanvasModel.Assignments;
using CanvasModel.Modules;
using CanvasModel.Quizzes;
using LocalModels;
using Management.Services.Canvas;

namespace Management.Planner;

public static partial class QuizSyncronizationExtensions
{
  internal static async Task<LocalQuiz> SyncQuizToCanvas(
    this LocalCourse localCourse,
    ulong canvasId,
    LocalQuiz localQuiz,
    IEnumerable<CanvasQuiz> canvasQuizzes,
    CanvasService canvas
  )
  {
    // TODO actually sync
    return localQuiz;
  }

  internal static async Task<LocalCourse> SyncQuizzesWithCanvas(
    this LocalCourse localCourse,
    ulong canvasId,
    IEnumerable<CanvasQuiz> canvasQuizzes,
    CanvasService canvas
  )
  {
    var moduleTasks = localCourse.Modules.Select(async m =>
    {
      var quizTasks = m.Quizzes.Select(
        (q) => localCourse.SyncQuizToCanvas(canvasId, q, canvasQuizzes, canvas)
      );
      var quizzes = await Task.WhenAll(quizTasks);
      return m with { Quizzes = quizzes };
    });

    var modules = await Task.WhenAll(moduleTasks);
    return localCourse;
  }
}
