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


public record CanvasCourseData
{
  public required IEnumerable<CanvasAssignment> Assignments { get; init; }
  public required IEnumerable<CanvasAssignmentGroup> AssignmentGroups { get; init; }
  public required IEnumerable<CanvasQuiz> Quizzes { get; init; }
  public required IEnumerable<CanvasModule> Modules { get; init; }
  public required IEnumerable<CanvasPage> Pages { get; init; }
  public required Dictionary<CanvasModule, IEnumerable<CanvasModuleItem>> ModulesItems { get; init; }
}

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

  public CanvasCourseData? CanvasData { get; internal set; }

  public async Task LoadCanvasData()
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


    var canvasAssignments = (await assignmentsTask) ?? throw new Exception("Error loading canvas assignments");
    var canvasQuizzes = (await quizzesTask) ?? throw new Exception("Error loading canvas quizzes");
    var canvasAssignmentGroups = (await assignmentGroupsTask) ?? throw new Exception("Error loading canvas assignment groups");
    var canvasPages = (await coursePagesTask) ?? throw new Exception("Error loading canvas pages");
    var canvasModules = (await modulesTask) ?? throw new Exception("Error loading canvas modules");
    var canvasModulesItems = (await canvas.Modules.GetAllModulesItems(canvasId, canvasModules)) ?? throw new Exception("Error loading canvas module items");

    CanvasData = new CanvasCourseData
    {
      Assignments = canvasAssignments,
      Quizzes = canvasQuizzes,
      AssignmentGroups = canvasAssignmentGroups,
      Pages = canvasPages,
      Modules = canvasModules,
      ModulesItems = canvasModulesItems,
    };

    LoadingCanvasData = false;
    StateHasChanged?.Invoke();
  }

  public async Task CreateModule(LocalModule newModule)
  {
    if (LocalCourse == null)
      return;
    var canvasCourseId =
      LocalCourse.Settings.CanvasId ?? throw new Exception("no course canvas id to use to create module");
    await canvas.Modules.CreateModule(canvasCourseId, newModule.Name);
    var canvasModules = await canvas.Modules.GetModules(canvasCourseId);
    if (CanvasData != null)
    {
      CanvasData = CanvasData with
      {
        Modules = canvasModules
      };
    }
  }

  public void Clear()
  {
    CanvasData = null;
    LocalCourse = null;
  }

  public async Task SyncAssignmentGroups()
  {
    if (LocalCourse == null)
      return;

    var canvasCourseId =
      LocalCourse.Settings.CanvasId ?? throw new Exception("no course canvas id to use to create module");

    var canvasAssignmentGroups = await canvas.AssignmentGroups.GetAll(canvasCourseId);

    await LocalCourse.EnsureAllAssignmentGroupsExistInCanvas(canvasCourseId, canvasAssignmentGroups, canvas);

    canvasAssignmentGroups = await canvas.AssignmentGroups.GetAll(canvasCourseId);

    LocalCourse = LocalCourse with
    {
      Settings = LocalCourse.Settings with
      {
        AssignmentGroups = LocalCourse.Settings.AssignmentGroups.Select(g =>
        {
          var canvasGroup = canvasAssignmentGroups.FirstOrDefault(c => c.Name == g.Name);
          return canvasGroup == null
            ? g
            : g with { CanvasId = canvasGroup.Id };
        })
      }
    };
    CanvasData = CanvasData with
    {
      AssignmentGroups = canvasAssignmentGroups
    };
  }
}
