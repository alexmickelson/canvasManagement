namespace LocalModels;

public record RubricItem
{
  public static readonly string extraCredit = "(Extra Credit) ";
  public required string Label { get; set; }
  public required double Points { get; set; }
  public bool IsExtraCredit => Label.Contains(extraCredit.ToLower(), StringComparison.CurrentCultureIgnoreCase);
}
