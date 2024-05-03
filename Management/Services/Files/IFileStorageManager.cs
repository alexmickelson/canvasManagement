using LocalModels;

public interface IFileStorageManager
{
  Task SaveCourseAsync(LocalCourse course, LocalCourse? previouslyStoredCourse);
  Task<IEnumerable<LocalCourse>> LoadSavedCourses();
  IEnumerable<string> GetEmptyDirectories();
}
