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
      if (value == null)
      {
        _localCourse = null;
        StateHasChanged?.Invoke();
        return;
      }

      var verifiedCourse = verifyCourse(value);
      // ignore initial load of course
      if (_localCourse != null)
      {
        yamlManager.SaveCourse(verifiedCourse);
      }
      _localCourse = verifiedCourse;
      StateHasChanged?.Invoke();
    }
  }
  public event Action? StateHasChanged;

  private LocalCourse verifyCourse(LocalCourse incomingCourse)
  {
    var modulesWithUniqueAssignments = incomingCourse.Modules.Select(
      module => module with { Assignments = module.Assignments.DistinctBy(a => a.id) }
    );
    
    return incomingCourse with { Modules = modulesWithUniqueAssignments };
  }
}
