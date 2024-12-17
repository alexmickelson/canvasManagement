export interface CanvasRubricCriteria {
  id: string;
  description: string;
  long_description: string;
  points?: number;
  learning_outcome_id?: string;
  vendor_guid?: string;
  criterion_use_range?: boolean;
  ratings?: {
    points: number;
    id: string;
    description: string;
    long_description: string;
  }[];
  ignore_for_scoring?: boolean;
}
