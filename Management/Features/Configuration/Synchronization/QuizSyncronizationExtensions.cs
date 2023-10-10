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

  public static async Task<LocalQuiz> AddQuizToCanvas(
    this LocalCourse localCourse,
    LocalQuiz localQuiz,
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
