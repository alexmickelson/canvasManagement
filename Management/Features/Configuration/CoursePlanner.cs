using CanvasModel.EnrollmentTerms;
using CanvasModel.Courses;
using CanvasModel;
using LocalModels;
using CanvasModel.Assignments;
using CanvasModel.Modules;
using Management.Services.Canvas;
using System.Text.RegularExpressions;
using CanvasModel.Quizzes;
using Management.Services;

namespace Management.Planner;

public class CoursePlanner
{
  private readonly MyLogger<CoursePlanner> logger;
  private readonly FileStorageManager fileStorageManager;
  private readonly CanvasService canvas;
  private readonly ILogger<CoursePlanner> _otherLogger;

  public bool LoadingCanvasData { get; internal set; } = false;

  public CoursePlanner(
    MyLogger<CoursePlanner> logger,
    FileStorageManager fileStorageManager,
    CanvasService canvas,
    ILogger<CoursePlanner> otherLogger
  )
  {
    this.logger = logger;
    this.fileStorageManager = fileStorageManager;
    this.canvas = canvas;
    _otherLogger = otherLogger;
    _otherLogger.LogInformation("testing other logging");
  }

  private Timer? _debounceTimer;
  private int _debounceInterval = 1000;
  private LocalCourse? _localCourse { get; set; }
  private LocalCourse? _lastSavedCourse { get; set; }
  public LocalCourse? LocalCourse
  {
    get => _localCourse;
    set
    {
      using var activity = DiagnosticsConfig.Source?.StartActivity("Loading Course");
      if (value == null)
      {
        _localCourse = null;
        StateHasChanged?.Invoke();
        return;
      }

      var verifiedCourse = value.GeneralCourseCleanup();

      if (_localCourse == null)
      {
        _localCourse = verifiedCourse;
        _lastSavedCourse = verifiedCourse;
        StateHasChanged?.Invoke();
        return;
      }

      _debounceTimer?.Dispose();
      _debounceTimer = new Timer(
        async (_) => await saveCourseToFile(verifiedCourse),
        null,
        _debounceInterval,
        Timeout.Infinite
      );

      _localCourse = verifiedCourse;
      StateHasChanged?.Invoke();
    }
  }

  private async Task saveCourseToFile(LocalCourse courseAsOfDebounce)
  {
    _debounceTimer?.Dispose();

    // ignore initial load of course
    if (LocalCourse == null)
    {
      logger.Trace("saving course as of debounce call time");
      await fileStorageManager.SaveCourseAsync(courseAsOfDebounce, null);
      _lastSavedCourse = courseAsOfDebounce;
    }
    else
    {
      if (_lastSavedCourse == null)
      {
        logger.Trace("not saving course, no prevous saved course");
        _lastSavedCourse = LocalCourse ?? courseAsOfDebounce;
        return;
      }


      logger.Trace("Saving latest version of file");
      var courseToSave = LocalCourse;
      await fileStorageManager.SaveCourseAsync(courseToSave, _lastSavedCourse);
      _lastSavedCourse = courseToSave;

    }
  }

  public event Action? StateHasChanged;

  public IEnumerable<CanvasAssignment>? CanvasAssignments { get; internal set; }
  public IEnumerable<CanvasAssignmentGroup>? CanvasAssignmentGroups { get; internal set; }
  public IEnumerable<CanvasQuiz>? CanvasQuizzes { get; internal set; }
  public IEnumerable<CanvasModule>? CanvasModules { get; internal set; }
  public Dictionary<CanvasModule, IEnumerable<CanvasModuleItem>>? CanvasModulesItems { get; internal set; }

  public async Task<(
    IEnumerable<CanvasAssignment> CanvasAssignments,
    IEnumerable<CanvasModule> CanvasModules,
    Dictionary<CanvasModule, IEnumerable<CanvasModuleItem>> CanvasModulesItems,
    IEnumerable<CanvasQuiz> canvasQuizzes,
    IEnumerable<CanvasAssignmentGroup> canvasAssignmentGroups
  )> LoadCanvasData()
  {

    using var activity = DiagnosticsConfig.Source.StartActivity("Loading Canvas Data to Course Planner");
    LoadingCanvasData = true;
    StateHasChanged?.Invoke();

    var canvasId =
      LocalCourse?.Settings.CanvasId ?? throw new Exception("no canvas id found for selected course");

    var assignmentsTask = canvas.Assignments.GetAll(canvasId);
    var quizzesTask = canvas.Quizzes.GetAll(canvasId);
    var modulesTask = canvas.Modules.GetModules(canvasId);
    var assignmentGroupsTask = canvas.AssignmentGroups.GetAll(canvasId);

    CanvasAssignments = await assignmentsTask;
    CanvasQuizzes = await quizzesTask;
    CanvasModules = await modulesTask;
    CanvasAssignmentGroups = await assignmentGroupsTask;

    CanvasModulesItems = await canvas.Modules.GetAllModulesItems(canvasId, CanvasModules);

    LoadingCanvasData = false;
    StateHasChanged?.Invoke();
    return (CanvasAssignments, CanvasModules, CanvasModulesItems, CanvasQuizzes, CanvasAssignmentGroups);
  }

  public async Task CreateModule(LocalModule newModule)
  {
    if (LocalCourse == null)
      return;
    var canvasCourseId =
      LocalCourse.Settings.CanvasId ?? throw new Exception("no course canvas id to use to create module");
    await canvas.Modules.CreateModule(canvasCourseId, newModule.Name);
    CanvasModules = await canvas.Modules.GetModules(canvasCourseId);
  }

  public void Clear()
  {
    LocalCourse = null;
    CanvasAssignments = null;
    CanvasModules = null;
  }

  public async Task SyncAssignmentGroups()
  {
    if (LocalCourse == null)
      return;

    var canvasCourseId =
      LocalCourse.Settings.CanvasId ?? throw new Exception("no course canvas id to use to create module");


    CanvasAssignmentGroups = await canvas.AssignmentGroups.GetAll(canvasCourseId);

    await LocalCourse.EnsureAllAssignmentGroupsExistInCanvas(canvasCourseId, CanvasAssignmentGroups, canvas);

    CanvasAssignmentGroups = await canvas.AssignmentGroups.GetAll(canvasCourseId);

    LocalCourse = LocalCourse with {Settings = LocalCourse.Settings with {
        AssignmentGroups =  LocalCourse.Settings.AssignmentGroups.Select(g => {
            var canvasGroup = CanvasAssignmentGroups.FirstOrDefault(c => c.Name == g.Name);
            return canvasGroup == null
              ? g
              : g with {CanvasId = canvasGroup.Id};
          })
      }
    };
  }
}
