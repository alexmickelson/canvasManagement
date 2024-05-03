using System.Text.RegularExpressions;
using CanvasModel;
using CanvasModel.Assignments;
using CanvasModel.Courses;
using CanvasModel.EnrollmentTerms;
using CanvasModel.Modules;
using CanvasModel.Pages;
using CanvasModel.Quizzes;
using LocalModels;
using Management.Services;
using Management.Services.Canvas;

namespace Management.Planner;

public class CoursePlanner
{
  private readonly MyLogger<CoursePlanner> logger;
  private readonly IFileStorageManager fileStorageManager;
  private readonly ICanvasService canvas;
  private readonly ILogger<CoursePlanner> _otherLogger;

  public bool LoadingCanvasData { get; internal set; } = false;

  public CoursePlanner(
    MyLogger<CoursePlanner> logger,
    IFileStorageManager fileStorageManager,
    ICanvasService canvas,
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
  private string loadedCourseName = "";
  public LocalCourse? LocalCourse
  {
    get => _localCourse;
    set
    {
      if (value == null)
      {
        _localCourse = null;
        StateHasChanged?.Invoke();

        loadedCourseName = "";
        return;
      }

      var verifiedCourse = value.GeneralCourseCleanup();
      loadedCourseName = verifiedCourse.Settings.Name;

      if (_localCourse == null)
      {
        _localCourse = verifiedCourse;
        _lastSavedCourse = verifiedCourse;
        StateHasChanged?.Invoke();
        return;
      }

      saveCourseToFile(verifiedCourse);

      _localCourse = verifiedCourse;
      StateHasChanged?.Invoke();
    }
  }

  public async Task LoadCourseByName(string courseName)
  {

  }

  private void saveCourseToFile(LocalCourse courseAsOfDebounce)
  {
    _debounceTimer?.Dispose();
    _debounceTimer = new Timer(
        async (_) =>
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
        },
        null,
        _debounceInterval,
        Timeout.Infinite
      );
  }

  public event Action? StateHasChanged;

  public IEnumerable<CanvasAssignment>? CanvasAssignments { get; internal set; }
  public IEnumerable<CanvasAssignmentGroup>? CanvasAssignmentGroups { get; internal set; }
  public IEnumerable<CanvasQuiz>? CanvasQuizzes { get; internal set; }
  public IEnumerable<CanvasModule>? CanvasModules { get; internal set; }
  public IEnumerable<CanvasPage>? CanvasPages { get; internal set; }
  public Dictionary<CanvasModule, IEnumerable<CanvasModuleItem>>? CanvasModulesItems { get; internal set; }

  public async Task<(
    IEnumerable<CanvasAssignment> CanvasAssignments,
    IEnumerable<CanvasModule> CanvasModules,
    Dictionary<CanvasModule, IEnumerable<CanvasModuleItem>> CanvasModulesItems,
    IEnumerable<CanvasQuiz> canvasQuizzes,
    IEnumerable<CanvasAssignmentGroup> canvasAssignmentGroups,
    IEnumerable<CanvasPage> canvasPages
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
    var coursePagesTask = canvas.Pages.GetAll(canvasId);

    CanvasAssignments = await assignmentsTask;
    CanvasQuizzes = await quizzesTask;
    CanvasModules = await modulesTask;
    CanvasAssignmentGroups = await assignmentGroupsTask;
    CanvasPages = await coursePagesTask;

    CanvasModulesItems = await canvas.Modules.GetAllModulesItems(canvasId, CanvasModules);

    LoadingCanvasData = false;
    StateHasChanged?.Invoke();
    return (CanvasAssignments, CanvasModules, CanvasModulesItems, CanvasQuizzes, CanvasAssignmentGroups, CanvasPages);
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

    LocalCourse = LocalCourse with
    {
      Settings = LocalCourse.Settings with
      {
        AssignmentGroups = LocalCourse.Settings.AssignmentGroups.Select(g =>
        {
          var canvasGroup = CanvasAssignmentGroups.FirstOrDefault(c => c.Name == g.Name);
          return canvasGroup == null
            ? g
            : g with { CanvasId = canvasGroup.Id };
        })
      }
    };
  }
}
