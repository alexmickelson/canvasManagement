using CanvasModel.EnrollmentTerms;

public interface IConfigurationManagement
{
  SemesterCalendarConfig? SemesterCalendar { get; set; }

  void SetConfiguration(EnrollmentTermModel canvasTerm, DayOfWeek[] daysOfWeek);
}
