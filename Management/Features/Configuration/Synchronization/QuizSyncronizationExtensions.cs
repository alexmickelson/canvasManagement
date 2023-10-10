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
    IEnumerable<CanvasQuiz> canvasQuizzes,
    CanvasService canvas
  )
  {
    return localCourse;
    // var moduleTasks = localCourse.Modules.Select(async m =>
    // {

    //   var quizTasks = m.Quizzes
    //   .Select(
    //     async (q) => q.DueAt > DateTime.Now
    //     ? await localCourse.AddQuizToCanvas(q, canvasQuizzes, canvas)
    //     : q
    //   );
    //   var quizzes = await Task.WhenAll(quizTasks);
    //   return m with { Quizzes = quizzes };
    // });

    // var modules = await Task.WhenAll(moduleTasks);
    // return localCourse with { Modules = modules };
  }

  public static async Task<LocalQuiz> AddQuizToCanvas(
    this LocalCourse localCourse,
    LocalQuiz localQuiz,
    IEnumerable<CanvasQuiz> canvasQuizzes,
    CanvasService canvas
  )
  {
    if (localCourse.Settings.CanvasId == null)
    {
      Console.WriteLine("Cannot add quiz to canvas without canvas course id");
      return localQuiz;
    }
    ulong courseCanvasId = (ulong)localCourse.Settings.CanvasId;

    var canvasAssignmentGroupId = localQuiz.GetCanvasAssignmentGroupId(localCourse.Settings.AssignmentGroups);

    var canvasQuizId = await canvas.Quizzes.Create(courseCanvasId, localQuiz, canvasAssignmentGroupId);
    return localQuiz with { CanvasId = canvasQuizId };
  }
}
