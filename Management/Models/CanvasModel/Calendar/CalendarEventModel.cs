using System;
using System.Collections.Generic;


using CanvasModel.Assignments;
using CanvasModel.Groups;
using CanvasModel.Users;

namespace CanvasModel.Calendar;

/*
 * This class combines the fields of normal, reservation, time-slot, and assignment calendar events.
 * Concrete structure classes will specialize to these types and inherit from a common base.
 */

public record CalendarEventModel
{

  [JsonPropertyName("id")]
  public ulong Id { get; set; }

  [JsonPropertyName("title")]
  public string Title { get; set; }

  [JsonPropertyName("start_at")]
  public DateTime StartAt { get; set; }

  [JsonPropertyName("end_at")]
  public DateTime EndAt { get; set; }

  [JsonPropertyName("type")]
  public string Type { get; set; }

  [JsonPropertyName("description")]
  public string Description { get; set; }

  [JsonPropertyName("location_name")]
  public string LocationName { get; set; }

  [JsonPropertyName("location_address")]
  public string LocationAddress { get; set; }

  [JsonPropertyName("context_code")]
  public string ContextCode { get; set; }

  [JsonPropertyName("effective_context_code")]
  public string? EffectiveContextCode { get; set; }

  [JsonPropertyName("all_context_codes")]
  public string AllContextCodes { get; set; } // comma separated

  [JsonPropertyName("workflow_state")]
  public string WorkflowState { get; set; }

  [JsonPropertyName("hidden")]
  public bool Hidden { get; set; }

  [JsonPropertyName("parent_event_id")]
  public string? ParentEventId { get; set; }

  [JsonPropertyName("child_events_count")]
  public uint? ChildEventsCount { get; set; }

  [JsonPropertyName("child_events")]
  public IEnumerable<CalendarEventModel>? ChildEvents { get; set; }

  [JsonPropertyName("url")]
  public string Url { get; set; }

  [JsonPropertyName("html_url")]
  public string HtmlUrl { get; set; }

  [JsonPropertyName("all_day_date")]
  public DateTime? AllDayDate { get; set; }

  [JsonPropertyName("all_day")]
  public bool AllDay { get; set; }

  [JsonPropertyName("created_at")]
  public DateTime CreatedAt { get; set; }

  [JsonPropertyName("updated_at")]
  public DateTime UpdatedAt { get; set; }

  [JsonPropertyName("appointment_group_id")]
  public ulong AppointmentGroupId { get; set; }

  [JsonPropertyName("appointment_group_url")]
  public string AppointmentGroupUrl { get; set; }

  [JsonPropertyName("own_reservation")]
  public bool? OwnReservation { get; set; }

  [JsonPropertyName("reserve_url")]
  public string? ReserveUrl { get; set; }

  [JsonPropertyName("reserved")]
  public bool? Reserved { get; set; }

  [JsonPropertyName("participant_type")]
  public string ParticipantType { get; set; } // User|Group

  [JsonPropertyName("participant_limit")]
  public uint? ParticipantLimit { get; set; }

  [JsonPropertyName("available_slots")]
  public uint? AvailableSlots { get; set; }

  [JsonPropertyName("user")]
  public UserModel? User { get; set; }

  [JsonPropertyName("group")]
  public GroupModel? Group { get; set; }

  [JsonPropertyName("assignment")]
  public AssignmentModel? Assignment { get; set; }

  [JsonPropertyName("assignment_overrides")]
  public IEnumerable<AssignmentOverrideModel>? AssignmentOverrides { get; set; }

  [JsonPropertyName("can_manage_appointment_group")]
  public bool? CanManageAppointmentGroup { get; set; } // undocumented

  [JsonPropertyName("participants_per_appointment")]
  public uint? ParticipantsPerAppointment { get; set; }
}
