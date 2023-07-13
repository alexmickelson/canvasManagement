public interface IModuleManager
{
  IEnumerable<CourseModule> Modules { get; set; }
  public void AddModule(CourseModule newModule);
  public void AddAssignment(int moduleIndex, LocalAssignment assignment);
}
