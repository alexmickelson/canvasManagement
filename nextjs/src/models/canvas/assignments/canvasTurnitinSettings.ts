export interface CanvasTurnitinSettings {
  originality_report_visibility: string;
  s_paper_check: boolean;
  internet_check: boolean;
  journal_check: boolean;
  exclude_biblio: boolean;
  exclude_quoted: boolean;
  exclude_small_matches_type?: boolean;
  exclude_small_matches_value?: number;
}
