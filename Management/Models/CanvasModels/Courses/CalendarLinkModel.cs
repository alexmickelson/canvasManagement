namespace CanvasModel.Courses;
public record CalendarLinkModel
(
  [property: JsonPropertyName("ics")] string Ics
);