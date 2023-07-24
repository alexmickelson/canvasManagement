using CanvasModel.EnrollmentTerms;
using CanvasModel.Courses;
using CanvasModel;
using LocalModels;

public class CoursePlanner
{
  public LocalCourse _localCourse { get; set; } = default!;
  public LocalCourse LocalCourse
  {
    get => _localCourse;
    set
    {
      _localCourse = value;
      StateHasChanged?.Invoke();
    }
  }
  public event Action? StateHasChanged;
}
