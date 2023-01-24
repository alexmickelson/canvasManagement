public interface IModuleManager
{
  IEnumerable<CourseModule> Modules { get; }
  public void AddModule(CourseModule newModule);
  public void AddAssignment(int moduleIndex, LocalAssignment assignment);
}
