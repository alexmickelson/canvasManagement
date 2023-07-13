using CanvasModel.EnrollmentTerms;

public class ConfigurationManagement : IConfigurationManagement
{
  public void SetConfiguration(
    EnrollmentTermModel canvasTerm,
    DayOfWeek[] daysOfWeek
  )
  {
    var start = canvasTerm.StartAt ?? throw new Exception($"Canvas Term must have a start date. Term: {canvasTerm.Name}");
    var end = canvasTerm.EndAt ?? throw new Exception($"Canvas Term must have a end date. Term: {canvasTerm.Name}");

    SemesterCalendar = new SemesterCalendarConfig(
      StartDate: start,
      EndDate: end,
      Days: daysOfWeek
    );
  }

  public SemesterCalendarConfig? SemesterCalendar { get; set; } = null;
  public IModuleManager ModuleManager {get; private set;} = new ModuleManager();



}