public record SemesterCalendarConfig(
  DateTime StartDate,
  DateTime EndDate,
  IEnumerable<DayOfWeek> Days
);