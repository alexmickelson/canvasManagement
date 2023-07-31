using CanvasModel.Assignments;

public record CanvasRubricCreationResponse
{
  public required CanvasRubric rubric { get; set; }
  public CanvasRubricAssociation? rubric_association { get; set; }
}
