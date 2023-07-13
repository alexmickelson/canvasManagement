public class ModuleManager : IModuleManager
{
  public IEnumerable<CourseModule> Modules { get; set; } = new CourseModule[] { };

  public void AddAssignment(int moduleIndex, LocalAssignment assignment)
  {
    var newAssignments = Modules.ElementAt(moduleIndex).Assignments.Append(assignment);
    var newModule = Modules.ElementAt(moduleIndex) with { Assignments = newAssignments };
    if (newModule == null)
      throw new Exception($"cannot get module at index {moduleIndex}");

    Modules = Modules
      .Take(moduleIndex)
      .Append(newModule)
      .Concat(Modules.Skip(moduleIndex + 1));
  }

  public void AddModule(CourseModule newModule)
  {
    Modules = Modules.Append(newModule);
  }
}