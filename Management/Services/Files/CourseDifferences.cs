using LocalModels;

public static class CourseDifferences
{
  public static DeleteCourseChanges GetDeletedChanges(LocalCourse newCourse, LocalCourse oldCourse)
  {
    if (newCourse == oldCourse)
      return new DeleteCourseChanges();
    var moduleNamesNoLongerReferenced = oldCourse.Modules
      .Where(oldModule =>
        !newCourse.Modules.Any(newModule => newModule.Name == oldModule.Name)
      )
      .Select(oldModule => oldModule.Name)
      .ToList();

    var modulesWithDeletions = oldCourse.Modules
      .Where(oldModule =>
        !newCourse.Modules.Any(newModule => newModule.Equals(oldModule))
      )
      .Select(oldModule =>
      {
        var newModule = newCourse.Modules.FirstOrDefault(m => m.Name == oldModule.Name);
        if (newModule == null)
          return oldModule;

        var unreferencedAssignments = oldModule.Assignments.Where(oldAssignment =>
          !newModule.Assignments.Any(newAssignment => newAssignment.Name == oldAssignment.Name)
        );
        var unreferencedQuizzes = oldModule.Quizzes.Where(oldQuiz =>
          !newModule.Quizzes.Any(newQuiz => newQuiz.Name == oldQuiz.Name)
        );
        var unreferencedPages = oldModule.Pages.Where(oldPage =>
          !newModule.Pages.Any(newPage => newPage.Name == oldPage.Name)
        );

        return oldModule with
        {
          Assignments = unreferencedAssignments,
          Quizzes = unreferencedQuizzes,
          Pages = unreferencedPages,
        };
      })
      .ToList();

    return new DeleteCourseChanges
    {
      NamesOfModulesToDeleteCompletely = moduleNamesNoLongerReferenced,
      DeleteContentsOfModule = modulesWithDeletions,
    };
  }

  public static NewCourseChanges GetNewChanges(LocalCourse newCourse, LocalCourse oldCourse)
  {
    if (newCourse == oldCourse)
      return new NewCourseChanges();

    var differentModules = newCourse.Modules
      .Where(newModule =>
        !oldCourse.Modules.Any(oldModule => oldModule.Equals(newModule))
      )
      .Select(newModule =>
      {
        var oldModule = oldCourse.Modules.FirstOrDefault(m => m.Name == newModule.Name);
        if (oldModule == null)
          return newModule;

        var newAssignments = newModule.Assignments.Where(
          newAssignment => !oldModule.Assignments.Any(oldAssignment => newAssignment == oldAssignment)
        );
        var newQuizzes = newModule.Quizzes.Where(
          newQuiz => !oldModule.Quizzes.Any(oldQuiz => newQuiz == oldQuiz)
        );
        var newPages = newModule.Pages.Where(
          newPage => !oldModule.Pages.Any(oldPage => newPage == oldPage)
        );
        return newModule with
        {
          Assignments = newAssignments,
          Quizzes = newQuizzes,
          Pages = newPages,
        };
      })
      .ToArray();

    return new NewCourseChanges
    {
      Settings = newCourse.Settings,
      Modules = differentModules,
    };
  }

}

public record NewCourseChanges
{
  public IEnumerable<LocalModule> Modules { get; init; } = [];
  public LocalCourseSettings? Settings { get; init; }
}
public record DeleteCourseChanges
{
  public IEnumerable<string> NamesOfModulesToDeleteCompletely { get; init; } = [];
  public IEnumerable<LocalModule> DeleteContentsOfModule { get; init; } = [];
}