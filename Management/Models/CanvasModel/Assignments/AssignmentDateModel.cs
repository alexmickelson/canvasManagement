using System;


namespace Model.Assignments
{

  public class AssignmentDateModel
  {

    [JsonPropertyName("id")]
    public ulong? Id { get; set; }

    [JsonPropertyName("base")]
    public bool? Base { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("due_at")]
    public DateTime? DueAt { get; set; }

    [JsonPropertyName("unlock_at")]
    public DateTime? UnlockAt { get; set; }

    [JsonPropertyName("lock_at")]
    public DateTime? LockAt { get; set; }
  }
}