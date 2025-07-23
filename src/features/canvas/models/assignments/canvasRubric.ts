export interface CanvasRubric {
  id?: number;
  title: string;
  context_id: number;
  context_type: string;
  points_possible: number;
  reusable: boolean;
  read_only: boolean;
  hide_score_total?: boolean;
  // Uncomment and define if needed
  // data: CanvasRubricCriteria[];
  // free_form_criterion_comments?: boolean;
}
