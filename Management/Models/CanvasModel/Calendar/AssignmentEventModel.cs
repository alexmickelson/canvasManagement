namespace CanvasModel.Calendar;

public record AssignmentEventModel
{

  //   // A synthetic ID for the assignment
  //   "id": "assignment_987",
  [JsonPropertyName("id")]
  public string Id { get; set; }
  //   // The title of the assignment
  //   "title": "Essay",
  [JsonPropertyName("title")]
  public string Title { get; set; }
  //   // The due_at timestamp of the assignment
  //   "start_at": "2012-07-19T23:59:00-06:00",
  [JsonPropertyName("start_at")]
  public DateTime StartAt { get; set; }
  //   // The due_at timestamp of the assignment
  //   "end_at": "2012-07-19T23:59:00-06:00",
  [JsonPropertyName("end_at")]
  public DateTime EndAt { get; set; }
  //   // The HTML description of the assignment
  //   "description": "<b>Write an essay. Whatever you want.</b>",
  [JsonPropertyName("description")]
  public string Description { get; set; }
  //   // the context code of the (course) calendar this assignment belongs to
  //   "context_code": "course_123",
  //   // Current state of the assignment ('published' or 'deleted')
  //   "workflow_state": "published",
  //   // URL for this assignment (note that updating/deleting should be done via the
  //   // Assignments API)
  //   "url": "https://example.com/api/v1/calendar_events/assignment_987",
  //   // URL for a user to view this assignment
  //   "html_url": "http://example.com/courses/123/assignments/987",
  //   // The due date of this assignment
  //   "all_day_date": "2012-07-19",
  //   // Boolean indicating whether this is an all-day event (e.g. assignment due at
  //   // midnight)
  //   "all_day": true,
  //   // When the assignment was created
  //   "created_at": "2012-07-12T10:55:20-06:00",
  //   // When the assignment was last updated
  //   "updated_at": "2012-07-12T10:55:20-06:00",
  //   // The full assignment JSON data (See the Assignments API)
  //   "assignment": null,
  //   // The list of AssignmentOverrides that apply to this event (See the Assignments
  //   // API). This information is useful for determining which students or sections
  //   // this assignment-due event applies to.
  //   "assignment_overrides": null,
  //   // Boolean indicating whether this has important dates.
  //   "important_dates": true

}
