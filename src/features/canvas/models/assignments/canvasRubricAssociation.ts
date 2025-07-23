export interface CanvasRubricAssociation {
  id: number;
  rubric_id: number;
  association_id: number;
  association_type: string;
  use_for_grading: boolean;
  summary_data?: string;
  purpose: string;
  hide_score_total?: boolean;
  hide_points: boolean;
  hide_outcome_results: boolean;
}
