using LocalModels;

public interface IFileStorageManager
{
  Task SaveCourseAsync(LocalCourse course, LocalCourse? previouslyStoredCourse);
  Task<IEnumerable<LocalCourse>> LoadSavedCourses();
  Task<IEnumerable<string>> GetEmptyDirectories();
}
