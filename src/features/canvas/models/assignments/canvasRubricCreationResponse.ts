import { CanvasRubric } from "./canvasRubric";
import { CanvasRubricAssociation } from "./canvasRubricAssociation";

export interface CanvasRubricCreationResponse {
  rubric: CanvasRubric;
  rubric_association: CanvasRubricAssociation;
}
