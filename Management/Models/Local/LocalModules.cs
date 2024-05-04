namespace LocalModels;

public sealed record LocalModule
{
  public string Name { get; init; } = string.Empty;
  public string Notes { get; set; } = string.Empty;
  public IEnumerable<LocalAssignment> Assignments { get; init; } = [];
  public IEnumerable<LocalQuiz> Quizzes { get; init; } = [];
  public IEnumerable<LocalCoursePage> Pages { get; init; } = [];

  public IEnumerable<IModuleItem> GetSortedModuleItems() =>
    Enumerable.Empty<IModuleItem>()
      .Concat(Assignments)
      .Concat(Quizzes)
      .Concat(Pages)
      .OrderBy(i => i.DueAt);

  public bool Equals(LocalModule? otherModule)
  {
    var areEqual =
      string.Equals(Name, otherModule?.Name, StringComparison.OrdinalIgnoreCase)
      && string.Equals(Notes, otherModule?.Notes, StringComparison.OrdinalIgnoreCase)
      && CompareCollections(Assignments.OrderBy(x => x.Name), otherModule?.Assignments.OrderBy(x => x.Name))
      && CompareCollections(Quizzes.OrderBy(x => x.Name), otherModule?.Quizzes.OrderBy(x => x.Name))
      && CompareCollections(Pages.OrderBy(x => x.Name), otherModule?.Pages.OrderBy(x => x.Name));
    return areEqual;
  }

  private static bool CompareCollections<T>(IEnumerable<T> first, IEnumerable<T>? second)
  {
    var firstList = first.ToList();
    var secondList = second?.ToList();

    if (firstList.Count != secondList?.Count)
      return false;

    for (int i = 0; i < firstList.Count; i++)
    {
      if (!Equals(firstList[i], secondList[i]))
        return false;
    }

    return true;
  }

  public override int GetHashCode()
  {
    HashCode hash = new HashCode();
    hash.Add(Name, StringComparer.OrdinalIgnoreCase);
    hash.Add(Notes, StringComparer.OrdinalIgnoreCase);
    AddRangeToHash(hash, Assignments.OrderBy(x => x.Name));
    AddRangeToHash(hash, Quizzes.OrderBy(x => x.Name));
    AddRangeToHash(hash, Pages.OrderBy(x => x.Name));
    return hash.ToHashCode();
  }

  private void AddRangeToHash<T>(HashCode hash, IEnumerable<T> items)
  {
    foreach (var item in items)
    {
      hash.Add(item);
    }
  }
}
