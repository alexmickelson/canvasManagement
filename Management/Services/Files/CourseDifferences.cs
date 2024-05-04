using LocalModels;

public static class CourseDifferences
{
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
        return newModule with { Assignments = newAssignments };
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