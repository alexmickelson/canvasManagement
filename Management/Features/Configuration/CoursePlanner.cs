using CanvasModel.EnrollmentTerms;
using CanvasModel.Courses;
using CanvasModel;
using LocalModels;

public class CoursePlanner
{
  private readonly YamlManager yamlManager;

  public CoursePlanner(YamlManager yamlManager)
  {
    this.yamlManager = yamlManager;
  }

  private LocalCourse? _localCourse { get; set; }
  public LocalCourse? LocalCourse
  {
    get => _localCourse;
    set
    {
      // ignore initial load of course
      if (_localCourse != null && value != null)
      {
        yamlManager.SaveCourse(value);
      }
      _localCourse = value;
      StateHasChanged?.Invoke();
    }
  }
  public event Action? StateHasChanged;
}
