using System;
using System.Collections.Generic;


namespace CanvasModel.Analytics;
// The format of this model in the documentation is COMPLETELY WRONG. Each property is an array of objects, not an object,
// and each of those objects have some extra fields: {id, date, views, participations} in by_date and 
// {id, category, views} in by_category. In both cases, id seems to be null 100% of the time, so I am omitting that one.
// The primary keys (date and category) are thankfully discrete, so we can trivially build the dictionary ourselves.
public class DepartmentParticipationModel
{

  [JsonPropertyName("by_date")]
  public IEnumerable<DepartmentParticipationDateEntryModel> ByDate { get; set; }

  [JsonPropertyName("by_category")]
  public IEnumerable<DepartmentParticipationCategoryEntryModel> ByCategory { get; set; }
}

public class DepartmentParticipationDateEntryModel
{

  [JsonPropertyName("date")]
  public DateTime Date { get; set; }

  [JsonPropertyName("views")]
  public ulong Views { get; set; }

  [JsonPropertyName("participations")]
  public ulong Participations { get; set; }
}

public class DepartmentParticipationCategoryEntryModel
{

  [JsonPropertyName("category")]
  public string Category { get; set; }

  [JsonPropertyName("views")]
  public ulong Views { get; set; }
}
