using System.Text.RegularExpressions;
using CanvasModel.Assignments;
using CanvasModel.Modules;
using CanvasModel.Quizzes;
using LocalModels;
using Management.Services.Canvas;

namespace Management.Planner;

public static partial class QuizSyncronizationExtensions
{
  public static bool QuizIsCreated(this LocalQuiz localQuiz, IEnumerable<CanvasQuiz> canvasQuizzes)
  {
    return canvasQuizzes.Any(q => q.Id == localQuiz.CanvasId);
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
    return localCourse with { Modules = modules };
  }

  internal static async Task<LocalQuiz> SyncQuizToCanvas(
    this LocalCourse localCourse,
    ulong canvasCourseId,
    LocalQuiz localQuiz,
    IEnumerable<CanvasQuiz> canvasQuizzes,
    CanvasService canvas
  )
  {
    var isCreated = localQuiz.QuizIsCreated(canvasQuizzes);
    var canvasAssignmentGroupId = localQuiz.GetCanvasAssignmentGroupId(localCourse.Settings.AssignmentGroups);
    if (isCreated)
    {
      // TODO write update
    }
    else
    {
      return await canvas.Quizzes.Create(canvasCourseId, localQuiz, canvasAssignmentGroupId);
    }

    return localQuiz;
  }
}
